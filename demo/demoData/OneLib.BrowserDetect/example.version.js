define('test_versionProperty', ['OneLib.BrowserDetect','$','window'], function (require, exports, module) {

    var Detect = require('OneLib.BrowserDetect'),$ = require('$'),wnd = require('window');
    $("#test_versionProperty").click(function(){
        wnd.alert('version is:'+Detect.version); //获取当前访问页面的浏览器版本号
    });
});