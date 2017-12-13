var profileId = ["carwyn-littlewood-0b394655", "sultan-ahmed-959b6355", "nguyentoanngoc", "ricardoglenn", "nguyen-truc-6aa0586", "bang-ngo-1a212b6", "kentran27", "chon-nguyen-huu-b0b3396", "huanduong", "trung-le-thanh-22a5316"];

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

function getPDFProfile(dmsLink, idProfile) {

    var req = new XMLHttpRequest();
    req.open("GET", dmsLink, true);
    var namePDF = decodeURI(idProfile);
    req.responseType = "blob";
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var filename = namePDF + ".pdf";
            if (typeof window.chrome !== 'undefined') {
                // Chrome version
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(req.response);
                link.download = namePDF + ".pdf";
                link.click();
            } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE version
                var blob = new Blob([req.response], {type: 'application/pdf'});
                window.navigator.msSaveBlob(blob, filename);
            } else {
                // Firefox version
                var file = new File([req.response], filename, {type: 'application/force-download'});
                window.open(URL.createObjectURL(file));
            }
        }
    };
    req.send();
}

var dmsLink = {};

// send POST pdf profile
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift().replace('"', '').replace('"', '');
}

var csrfToken = getCookie('JSESSIONID');
var succeedGetProfile = [];
var failGetProfile = [];

// send POST pdf profile
function POSTRequest(idProfile) {
    return new Promise(resolve => {
        var linkRequest = "https://www.linkedin.com/voyager/api/identity/profiles/" + idProfile + "/profileActions?versionTag=3123833624&action=saveToPdf";
        var xhttp = new XMLHttpRequest();

        function reqListener() {
            resolve(JSON.parse(this.responseText));
            if (this.readyState === 4 && this.status === 200) {
                var parsedData = JSON.parse(this.responseText);
                dmsLink[idProfile] = parsedData.value;
                // getPDFProfile(parsedData.value, idProfile)
                var index = failGetProfile.indexOf(idProfile);
                if (index > -1) {
                    console.log("slice: " + index, idProfile);
                    // failGetProfile.slice(index, 1);
                    //
                    removeA(failGetProfile, idProfile);
                    console.log(failGetProfile);
                }
            } else {
                if (failGetProfile.indexOf(idProfile) === -1) {
                    failGetProfile.push(idProfile);
                }
            }
        }

        xhttp.addEventListener("load", reqListener);
        xhttp.open("POST", linkRequest, true);
        xhttp.setRequestHeader("csrf-token", csrfToken);
        xhttp.send();
    });

}

var numberRecall = 1;
var limitRecall = 5;

function recallGetProfile() {
    console.log("numberRecall: " + numberRecall);
    numberRecall += 1;
    var failPromies = [];
    failGetProfile.forEach(function (profile_fail) {
        failPromies.push(POSTRequest(profile_fail));
    });
    Promise.all(failPromies).then(function () {
        console.log("Fail- : " + failGetProfile);
        if (failGetProfile.length > 0 && numberRecall <= limitRecall) {
            recallGetProfile(failGetProfile);
        }
        if (numberRecall > limitRecall && failGetProfile.length > 0) {
            //save id cannot GetProfile to file pdf
            exportFile(failGetProfile.toString(), "profileID_Failed.txt")
        }
        if (numberRecall > limitRecall || failGetProfile.length <= 0) {
            for (var profile_id in dmsLink) {
                getPDFProfile(dmsLink[profile_id], profile_id);
            }
        }
    });
}

function main() {
    var promises = [];
    profileId.forEach(function (entry) {
        promises.push(POSTRequest(entry));
    });
    Promise.all(promises).then(function () {
        recallGetProfile();
    });
}

main();