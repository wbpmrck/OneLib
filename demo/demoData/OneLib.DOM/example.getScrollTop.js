define('DOM.getScrollTop', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    var manager = dom.getScrollManager(document);
    exports.runTest = function(){
        wnd.alert("getScrollTop()="+manager.getScrollTop());
    }
});