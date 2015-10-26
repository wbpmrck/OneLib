/**
 * @Created by kaicui(https://github.com/wbpmrck).
 * @Date:2013-08-17 13:47
 * @Desc: 封装浏览器滚动相关的操作
 *
 *
 *
 * @Change History:
 * 2015-10-25：改名字为OneLib.DOM
 * 2015-10-25：重构scroll模块，在调用滚动api之前需要传入要滚动的对象，模块根据不同对象类型，进行兼容性控制
 * 2015-10-25：添加对页面滚动事件的封装，以及对滚动时间进行触发频率控制的API
 --------------------------------------------
 @created：|kaicui| 2013-08-17 13:47.
 --------------------------------------------
 */

define('OneLib.DOM', [], function (require, exports, module) {

    var _addListener = window.addEventListener || window.attachEvent,
        _removeListener = window.removeEventListener || window.detachEvent;

    //查询浏览器窗口在电脑桌面的坐标（但经测试发现，在IE和Opera下为可视化窗口在电脑桌面坐标）
    //IE,safari,opera
    if (window.screenLeft != undefined) {
        exports.getWindowX = function () { return window.screenLeft; };
        exports.getWindowY = function () { return window.screenTop; };
    }
    //firefox,safari
    else if (window.screenX != undefined) {
        exports.getWindowX = function () { return window.screenX; };
        exports.getWindowY = function () { return window.screenY; };
    }

    //查询可视化窗口大小，文档的水平垂直滚动距离
    //all browser but IE
    if (window.innerWidth != undefined) {
        exports.getViewportWidth = function () { return window.innerWidth; };
        exports.getViewportHeight = function () { return window.innerHeight; };
        exports.getHorizontalScroll = function () { return window.pageXOffset; };
        exports.getVerticalScroll = function () { return window.pageYOffset; };
    }
    //IE
    else if (document.documentElement != undefined && document.documentElement.clientWidth != undefined) {
        exports.getViewportWidth = function () { return document.documentElement.clientWidth; };
        exports.getViewportHeight = function () { return document.documentElement.clientHeight; };
        exports.getHorizontalScroll = function () { return document.documentElement.scrollLeft; };
        exports.getVerticalScroll = function () { return document.documentElement.scrollTop; };
    }
    //IE6 without a DOCTYPE
    else if (document.body.clientWidth != undefined) {
        exports.getViewportWidth = function () { return document.body.clientWidth; };
        exports.getViewportHeight = function () { return document.body.clientHeight; };
        exports.getHorizontalScroll = function () { return document.body.scrollLeft; };
        exports.getVerticalScroll = function () { return document.body.scrollTop; };
    }

    //查询文档的实际高度和宽度
    if (document.documentElement != undefined && document.documentElement.scrollWidth != undefined) {
        exports.getDocumentWidth = function () { return document.documentElement.scrollWidth; };
        exports.getDocumentHeight = function () { return document.documentElement.scrollHeight; };
    }
    else if (document.body.scrollWidth != undefined) {
        exports.getDocumentWidth = function () { return document.body.scrollWidth; };
        exports.getDocumentHeight = function () { return document.body.scrollHeight; };
    }
    
    
    function ScrollManager(container){
        var self = this;

        //最外层可操作滚动的对象为body
        if(container === window||container === document || container === document.body){
            //self.container = document.documentElement?document.documentElement:document.body;
            self.container = document.body;
        }else{
            self.container = container;
        }
        self.containerName = (container.tagName?container.tagName.toLowerCase():'');

    }
    ScrollManager.prototype.scrollToTop = function(){
        var self = this;//save the this ref
        self.container.scrollTop = 0;
        return self;

    };
    ScrollManager.prototype.scrollToBottom = function() {
        var self = this;//save the this ref
        self.container.scrollTop = exports.getDocumentHeight();
        return self;
    };
    ScrollManager.prototype.scrollUp = function(pixel){
        var self = this;//save the this ref

        self.container.scrollTop -= pixel;
        return self;
    };
    ScrollManager.prototype.scrollDown = function(pixel){
        var self = this;//save the this ref

        self.container.scrollTop += pixel;
        return self;
    };
    ScrollManager.prototype.getScrollTop = function(){
        var self = this;//save the this ref
        return self.container.scrollTop;

    };
    ScrollManager.prototype.setScrollTop = function(top){
        var self = this;//save the this ref

        self.container.scrollTop = top;
        return self;
    };


    /**
     * 根据传入的DOM节点，来生成滚动条控制器
     * @param containerDOM
     */
    exports.getScrollManager = function (containerDOM) {
        return new ScrollManager(containerDOM);
    }

});