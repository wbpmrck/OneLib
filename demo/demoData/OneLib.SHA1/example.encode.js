define('testSHA1', ['OneLib.SHA1'], function (require, exports, module) {
    var SHA1 = require('OneLib.SHA1'),wnd = window;

    exports.runTest = function(){
        var result = SHA1.encode("123456");
        wnd.alert('result is:'+result);
    }
});