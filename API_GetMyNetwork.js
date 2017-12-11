// Get by API
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift().replace('"', '').replace('"', '');
}

var csrfToken = getCookie('JSESSIONID');
console.log('csrfToken', csrfToken);

function getLinkedInConnections(csrfToken, skip = 0, limit = 0) {
    return new Promise(resolve => {
        function reqListener() {
            resolve(JSON.parse(this.responseText));
        }

        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", `https://www.linkedin.com/voyager/api/relationships/connections?count=${limit}&sortType=RECENTLY_ADDED&start=${skip}`);
        oReq.setRequestHeader("csrf-token", csrfToken);
        oReq.send();
    })
}

function getNumberConnection() {
    // Get lenght network
    lengthNetWork = 0;
    var networkLength = document.getElementsByClassName('mn-connections__title');
    var textLengththNetWork = networkLength[0].textContent || networkLength[0].innerText;
    var lengthNetWork = textLengththNetWork.match(/\d/g);
    lengthNetWork = lengthNetWork.join("");
    console.log("lengthNetWork: "+lengthNetWork);
    return lengthNetWork;
}

function exportFile(data, filename) {

    if (!data) {
        console.error('Console.save: No data');
        return;
    }

    if (!filename) filename = 'console.json';

    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e)
}

function main() {
    var numberConnection = getNumberConnection();
    if (numberConnection < 1)
        return;
    var dataResponse = [];
    var numberCallAPI = Math.floor(numberConnection / 2000);
    var limitEndCall = numberConnection % 2000;
    var skip = 0;
    var limit = 2000;
    var promises = [];
    var empConnects = [];
    for (var i = 0; i < numberCallAPI; i++) {
        console.log("skip: "+ skip +", limit: " + limit);
        promises.push(getLinkedInConnections(csrfToken, skip, limit));
        skip += limit;
    }
    promises.push(getLinkedInConnections(csrfToken, skip, limitEndCall));
    Promise.all(promises).then(dataResponse => {
        dataResponse.forEach(function (value, index) {
            value.elements.forEach(function (emp) {
                empConnects.push([
                    "\"" + emp.miniProfile.firstName + "\"",
                    "\"" + emp.miniProfile.lastName + "\"",
                    "\"" + emp.miniProfile.occupation + "\"",
                    "\"" + emp.miniProfile.publicIdentifier + "\"",
                    "\"" + "https://www.linkedin.com/in/" + encodeURI(emp.miniProfile.publicIdentifier) + "\""
                ]);
            })
        });
        if (empConnects.length < 1) {
            console.log("no data");
            return;
        }
        var csvContent = "data:text/csv;charset=utf-8,%EF%BB%BF";
        csvContent = "First Name, Last Name, Occupation, URL-publicIdentifier \n";
        empConnects.forEach(function (infoArray, index) {

            dataString = infoArray.join(",");
            csvContent += index < empConnects.length ? dataString + "\n" : dataString;

        });
        exportFile(csvContent, "InforLinkedin.csv");
    });

}

main();

/*async function getDataAsync() {
    var result = [];
    var a = await getLinkedInConnections(csrfToken, 0, 40);
    result.push(a);
    var b = await getLinkedInConnections(csrfToken, 40, 40);
    result.push(b);
    return result;
}
getDataAsync().then(result=>{console.log(result)})*/


