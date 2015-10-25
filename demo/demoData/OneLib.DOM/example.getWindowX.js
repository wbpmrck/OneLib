define('DOM.getWindowX', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    exports.runTest = function(){
        wnd.alert('browserWindow.x is:'+dom.getWindowX());
    }
});