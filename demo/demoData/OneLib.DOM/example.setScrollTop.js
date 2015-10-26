define('DOM.setScrollTop', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    var manager = dom.getScrollManager(document);
    exports.runTest = function(){
        manager.setScrollTop(20)
        wnd.alert("after:setScrollTop(20),now scrollTop is:"+manager.getScrollTop());
    }
});