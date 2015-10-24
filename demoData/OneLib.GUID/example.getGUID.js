define('testGUID', ['OneLib.GUID'], function (require, exports, module) {
    var GUID = require('OneLib.GUID'),wnd = window;

    exports.runTest = function(){
        var guid = GUID.getGUID();
        wnd.alert('guid is:'+guid);
    }
});