define('testGUID', ['OneLib.GUID','window'], function (require, exports, module) {
    var GUID = require('OneLib.GUID'),wnd = require('window');

    exports.runTest = function(){
        var guid = GUID.getGUID();
        wnd.alert('guid is:'+guid);
    }
});