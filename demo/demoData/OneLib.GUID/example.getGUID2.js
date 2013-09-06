define('testGUID2', ['OneLib.GUID'], function (require, exports, module) {
    var GUID = require('OneLib.GUID'),wnd = window;

    exports.runTest = function(){
        var guid = GUID.getGUID(10,2);
        wnd.alert('guid (10位，2进制) is:'+guid);

        guid = GUID.getGUID(8,16);
        wnd.alert('guid (8位，16进制) is:'+guid);
    }
});