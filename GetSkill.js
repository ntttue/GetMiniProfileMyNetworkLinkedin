// send POST pdf profile

var profileId = ["huyns", "andytranhr", "angiestrahle", "kiettran2502", "anh-mai-vu-ba0a9488", "an-le-5ab37956"];

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift().replace('"', '').replace('"', '');
}

var csrfToken = getCookie('JSESSIONID');
var profileIDCallSS = [];
var indexInput = 0;

function getSkill(profileID) {
    return new Promise(resolve => {
        setTimeout(() => {
            var linkGetSkill = "https://www.linkedin.com/voyager/api/identity/profiles/" + profileID + "/featuredSkills?includeHiddenEndorsers=true&count=50";
            var req = new XMLHttpRequest();

            function reqListener() {
                if (req.readyState === 4 && req.status === 200) {
                    resolve(JSON.parse(this.responseText));
                }
            }

            req.addEventListener("load", reqListener);
            req.open("GET", linkGetSkill, true);
            req.setRequestHeader("csrf-token", csrfToken);
            req.send();
        }, 1000);
    });
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

async function main() {
    var promises = [];
    var empConnects = [];
    profileId.forEach(function (profile) {
        promises.push(getSkill(profile));
        profileIDCallSS.push(profile);
    });
    await Promise.all(promises).then(dataResponse => {
        dataResponse.forEach(function (value, index) {
            console.log(profileIDCallSS);
            var stringInput = "\"" + profileIDCallSS[index] + "\"" + "\,";
            console.log(index + " - " + profileIDCallSS[index]);
            var skillStr = "";
            if ((dataResponse.length) === (profileIDCallSS.length)) {
                value.elements.forEach(function (skill) {
                    skillStr += "\"" + skill.skill.name + "\"" + "\," + "\"" + skill.endorsementCount + "\"" + "\,";

                });
                stringInput += skillStr;
                empConnects.push([stringInput]);
            } else {
                console.log("not equals");
            }
        });

        if (empConnects.length < 1) {
            console.log("no data");
            return;
        }
        var csvContent = "data:text/csv;charset=utf-8,%EF%BB%BF";
        csvContent = "";
        empConnects.forEach(function (infoArray, index) {
            dataString = infoArray.join(",");
            csvContent += index < empConnects.length ? dataString : dataString;
            csvContent += "\n";
        });

        exportFile(csvContent, "skill.csv");
    });
}

main();

