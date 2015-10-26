define('DOM.getScrollManager', function (require, exports, module) {
    var dom = require('OneLib.DOM');

    var manager = dom.getScrollManager(document.body);//获取控制body滚动的控制器
    //manager.xxx()后面可以调用manager的方法来控制滚动
});