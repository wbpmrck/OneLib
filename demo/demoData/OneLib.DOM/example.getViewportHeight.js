define('DOM.getViewportHeight', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    exports.runTest = function(){
        wnd.alert('getViewportHeight:'+dom.getViewportHeight());
    }
});