var getParams = function() {
    var result = {};
    var query = window.location.search.substring(1);
    var parmsArray = query.split('&');
    for(var i = 0; i < parmsArray.length; i++) {
        var pair = parmsArray[i].split('=');
        var val = decodeURIComponent(pair[1]);
        var key = decodeURIComponent(pair[0]);
        if (val != '' && key != '') result[key] = val;
    }
    return result;
}();