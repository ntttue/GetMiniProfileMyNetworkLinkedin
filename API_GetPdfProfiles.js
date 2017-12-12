let profileId = ["nguyenta", "christophelefebvre", "nghia-doan-a5402534"];

function getPDFProfile(dmsLink, idProfile) {

    let req = new XMLHttpRequest();
    req.open("GET", dmsLink, false);
    let namePDF = decodeURI(idProfile);
    req.responseType = "blob";
        req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let filename = namePDF + ".pdf";
            if (typeof window.chrome !== 'undefined') {
                // Chrome version
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(req.response);
                link.download = namePDF + ".pdf";
                link.click();
            } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE version
                let blob = new Blob([req.response], {type: 'application/pdf'});
                window.navigator.msSaveBlob(blob, filename);
            } else {
                // Firefox version
                let file = new File([req.response], filename, {type: 'application/force-download'});
                window.open(URL.createObjectURL(file));
            }
        }
    };
    req.send();
}

// send POST pdf profile
function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift().replace('"', '').replace('"', '');
}

let csrfToken = getCookie('JSESSIONID');
let succeedGetProfile = [];
let failGetProfile = [];

// send POST pdf profile
function POSTRequest(idProfile) {
    let linkRequest = "https://www.linkedin.com/voyager/api/identity/profiles/" + idProfile + "/profileActions?versionTag=3123833624&action=saveToPdf";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let parsedData = JSON.parse(this.responseText);
            getPDFProfile(parsedData.value, idProfile)
        }
    };
    xhttp.open("POST", linkRequest, false);
    xhttp.setRequestHeader("csrf-token", csrfToken);
    xhttp.send();
}

function main() {
    profileId.forEach(function (entry) {
        POSTRequest(entry);
    });
    console.log("Done");
    console.log("ss " + succeedGetProfile);
    console.log("fail " + failGetProfile);
}

main();