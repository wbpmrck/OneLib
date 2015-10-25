define('DOM.getHorizontalScroll', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    exports.runTest = function(){
        wnd.alert('getHorizontalScroll:'+dom.getHorizontalScroll());
    }
});