define('DOM.getDocumentWidth', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    exports.runTest = function(){
        wnd.alert('getDocumentWidth:'+dom.getDocumentWidth());
    }
});