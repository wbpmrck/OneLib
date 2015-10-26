define('DOM.getDocumentHeight', function (require, exports, module) {
    var dom = require('OneLib.DOM'),wnd = window;

    exports.runTest = function(){
        wnd.alert('getDocumentHeight:'+dom.getDocumentHeight());
    }
});