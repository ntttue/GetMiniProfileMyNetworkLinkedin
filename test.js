var profileId = ["Tags"];
function getPDFProfile(dmsLink, idProfile) {
    var req = new XMLHttpRequest();
    req.open("GET", dmsLink);
    var namePDF = decodeURI(idProfile);
    console.log(namePDF);
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

// send POST pdf profile
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift().replace('"', '').replace('"', '');
}

var csrfToken = getCookie('JSESSIONID');
console.log(csrfToken);

// send POST pdf profile
function POSTRequest(idProfile) {
    var linkRequest = "https://www.linkedin.com/voyager/api/identity/profiles/" + idProfile + "/profileActions?versionTag=3123833624&action=saveToPdf";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var parsedData = JSON.parse(this.responseText);
            // console.log(parsedData.value);
            getPDFProfile(parsedData.value, idProfile);
        }
    };
    xhttp.open("POST", linkRequest, true);
    xhttp.setRequestHeader("csrf-token", csrfToken);
    xhttp.send();
}



profileId.forEach(function(entry) {
    POSTRequest(entry);
});