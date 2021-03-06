// send POST pdf profile

var profileId = ["huyns", "andytranhr", "angiestrahle", "kiettran2502", "tran-nga-563b9615", "thuy-nguyen-thu-74158022", "chau-ky-khanh-2a190a25", "joseph-phuc-phan-9a9a6212", "hung-tran-a599382a", "pham-huy-14b59031", "haovp", "vinh-pham-phu-7617112b"];

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift().replace('"', '').replace('"', '');
}

var csrfToken = getCookie('JSESSIONID');
var profileIDCallSS = [];
var indexInput = 0;
var profileFailed = [];

function getSkill(profileID) {
    return new Promise( ( resolve, reject ) => {
        try {
            setTimeout(() => {
                var linkGetSkill = "https://www.linkedin.com/voyager/api/identity/profiles/" + profileID + "/featuredSkills?includeHiddenEndorsers=true&count=50";
                var req = new XMLHttpRequest();

                function reqListener() {
                    if (req.readyState === 4 && req.status === 200) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        var index = profileIDCallSS.indexOf(profileID);
                        console.log("Fail: " + profileID);
                        if (index > -1) {
                            removeA(profileIDCallSS, profileID);
                        }
                        profileFailed.push(profileID);
                        resolve( null );
                    }
                }

                req.addEventListener("load", reqListener);
                req.open("GET", linkGetSkill, true);
                req.setRequestHeader("csrf-token", csrfToken);
                req.send();
            }, 1000);
        } catch(ex) {
            resolve( null );
        }
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
    var dataResponse = [];
    await Promise.all(profileId.map(async function (profile) {
        let result = await getSkill(profile);
        if ( result ) {
            dataResponse.push(result);
            profileIDCallSS.push(profile);
        } else {
            // console.log('Failed', profile);
        }
    }));

    dataResponse.forEach(function (value, index) {
        // console.log("Failed : " + profileFailed.length);
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
}

main();

