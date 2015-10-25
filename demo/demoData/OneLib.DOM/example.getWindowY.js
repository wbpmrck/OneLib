define('DOM.getWindowY', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    exports.runTest = function(){
        wnd.alert('browserWindow.y is:'+dom.getWindowY());
    }
});