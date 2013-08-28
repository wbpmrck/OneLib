define('test_osProperty', ['OneLib.BrowserDetect','$','window'], function (require, exports, module) {

    var Detect = require('OneLib.BrowserDetect'),$ = require('$'),wnd = require('window');
    $("#test_osProperty").click(function(){
        wnd.alert('OS is:'+Detect.OS); //获取操作系统版本
    });
});