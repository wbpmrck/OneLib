define('DOM.getVerticalScroll', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    exports.runTest = function(){
        wnd.alert('getVerticalScroll:'+dom.getVerticalScroll());
    }
});