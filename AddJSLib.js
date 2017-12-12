$.ajaxSetup({
    cache: true
});
jQuery.cachedScript = function (url, options) {
    // Allow user to set any option except for dataType, cache, and url
    options = $.extend(options || {}, {
        dataType: "script",
        cache: true,
        url: url
    });

    // Use $.ajax() since it is more flexible than $.getScript
    // Return the jqXHR object so we can chain callbacks
    return jQuery.ajax(options);
};

// Usage
$.cachedScript("ajax/http://igniteui.com/js/modernizr.min.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://code.jquery.com/jquery-1.9.1.min.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://code.jquery.com/ui/1.10.3/jquery-ui.min.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/infragistics.core.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/infragistics.lob.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.ext_core.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.ext_collections.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.ext_text.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.ext_io.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.ext_ui.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.documents.core_core.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.ext_collectionsextended.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.excel_core.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.ext_threading.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.ext_web.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.xml.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.documents.core_openxml.js").done(function (script, textStatus) {
    console.log(textStatus);
});
$.cachedScript("ajax/http://cdn-na.infragistics.com/igniteui/latest/js/modules/infragistics.excel_serialization_openxml.js").done(function (script, textStatus) {
    console.log(textStatus);
});