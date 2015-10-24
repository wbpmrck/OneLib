define('test_osProperty', ['OneLib.BrowserDetect','$'], function (require, exports, module) {

    var Detect = require('OneLib.BrowserDetect'),$ = require('$'),wnd = window;
    $("#test_osProperty").click(function(){
        wnd.alert('OS is:'+Detect.OS); //获取操作系统版本
    });
});