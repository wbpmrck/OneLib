define('DOM.getViewportWidth', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    exports.runTest = function(){
        wnd.alert('getViewportWidth:'+dom.getViewportWidth());
    }
});