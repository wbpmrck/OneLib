define('test_browserProperty', ['OneLib.BrowserDetect','$'], function (require, exports, module) {

    var Detect = require('OneLib.BrowserDetect'),$ = require('$'),wnd =window;
    $("#test_browserProperty").click(function(){
        wnd.alert('browser is:'+Detect.browser); //获取当前访问页面的浏览器类型
    });
});