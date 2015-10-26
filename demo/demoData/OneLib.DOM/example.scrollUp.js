define('DOM.scrollUp', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    var manager = dom.getScrollManager(document);
    exports.runTest = function(){
        manager.scrollUp(3);
    }
});