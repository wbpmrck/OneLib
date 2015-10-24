define('testMD5', ['OneLib.MD5'], function (require, exports, module) {
    var MD5 = require('OneLib.MD5'),wnd = window;

    exports.runTest = function(){
        var result = MD5.encode("123456");
        wnd.alert('result is:'+result);
    }
});