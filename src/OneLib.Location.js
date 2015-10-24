/**
 * @Created by kaicui.
 * @Date:2013-12-01 18:27
 * @Desc: 和地址栏相关的操作和通用库
 * @Change History:
 *
 * 2013-12-01 添加解析域名和地址字符串功能，解析对象格式参照chrome的BOM对象
 --------------------------------------------
 @created：|kaicui| 2013-12-01 18:27.
 --------------------------------------------
 */
define('OneLib.Location', [], function (require, exports, module) {

    //浏览器刷新
    exports.refresh = function () {
        window.location.reload();
    };
    //浏览器回退
    exports.back = function () {
        window.history.back();
    };
    //浏览器打开新窗口
    exports.newWindow = function (url, name, features, replace) {
        window.open(url, name, features, replace);
    };
    //浏览器前进
    exports.forward = function () {
        window.history.forward();
    };
    /**
     * 跳转到某个地址
     * @param url
     */
    exports.redirectTo = function (url) {
        window.location.href = url;
    };
    /**
     * 获取当前浏览器地址
     * @return {String}
     */
    exports.getCurUrl = function () {
        return window.location.href.toString();
    };
    /**
     * 将传入的url转化为格式化的对象
     * @param location
     * @return {Object}
     */
    exports.parseUrl=function(location){
        var parsed={
            href:location,
            host:'',
            path:'',
            origin:'',
            port:'',
            protocol:''
        };
        var protocolAndOther = location.split('://');
        parsed.protocol = protocolAndOther[0];

        var hostAndOther = protocolAndOther[1].split('/');
        var hostAndPort = hostAndOther[0].split(':');
        parsed.host = hostAndPort[0];
        parsed.port = parseInt(hostAndPort[1]||80);
        parsed.path = protocolAndOther[1].substr(hostAndOther[0].length);
        parsed.origin = parsed.protocol+'://'+parsed.host;

        return parsed;
    }
});