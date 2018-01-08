/*@alia urlHelper


 作者： kaicui
 依赖： 无
 使用说明：用于Url地址的扩展，方便指定各种Url如MVC的Url格式

 PS:由于需拼接服务端action地址，所以需要知道服务端虚拟目录路径。有两种方式配置服务端虚拟目录路径：
 1、在页面内放一个id为‘rootUrl’的元素，里面存放的是服务端的根目录地址。
 2、直接调用

 版本历史：
 2012年6月26日9:46:04       功能添加
 1、添加方法：setRoot，用于手工指定服务器的根目录地址
 2、格式化API:所有方法都首字母小写，只有类名、模块名首字母大写，更新对应Demo

 2012年3月29日20:08:47      版本创建
 *
 */

var $  =require("$");//使用jquery来做ajax调用

exports.root = "";

var getHref = function () {
    return decodeURIComponent(location.href);
}

exports.setRoot = function (root) {
    exports.root = root;
};
exports.getRoot = function () {

    if (exports.root === "") {
        var ele = document.getElementById("rootUrl");
        if (ele)
            exports.root = ele.innerText;
        else
            exports.root = "need a hidden <p> tag in the page named:rootUrl";
    };
    return exports.root;
};
exports.action = function (action, controller, paras) {
    //        return controller + "/" + action;
    var rootUrl = exports.getRoot();
    var paraString = exports.getQueryStrFromObj(paras);
    if(action && controller){
        return rootUrl + "/" + controller + "/" + action + paraString;
    }else if(action){
        return rootUrl + "/" + action+ paraString;
    }else{
        return rootUrl + paraString;
    }
};


//根据传入的url，分析出查询字符串，返回对象
exports.getQueryStrObj = function (url) {
    var name, value, i;
    var str = url || getHref();
    var num = str.indexOf("?")
    str = str.substr(num + 1);
    var arrtmp = str.split("&");
    var obj = {};
    for (i = 0; i < arrtmp.length; i++) {
        num = arrtmp[i].indexOf("=");
        if (num > 0) {
            name = arrtmp[i].substring(0, num);
            value = decodeURIComponent(arrtmp[i].substr(num + 1));
            obj[name] = value;
        }
    }
    //将所有键值转化为url
    obj.toString = function () {
        var s = "?";
        for (var i in this) {
            if (!this[i].prototype)
                s += i + "=" + this[i] + "&";
        }
        if (s.length > 1)
            s = s.substring(0, s.length - 1);
        else
            s = "";
        return s;
    };
    return obj;
};
//返回当前Url对象，可以对url的参数进行修改，转化为新的url
exports.getNowUrlObj = function () {
    var nowurl = getHref(),
        server_port = location.host,
        protocol = location.protocol,
        pathName = location.pathname,
        query = exports.getQueryStrObj(window.location.search);
    return {
        RawUrl: nowurl,
        Server: server_port,
        Protocol: protocol,
        Path: pathName,
        QueryStr: query,
        toString: function () {
            return this.Protocol + "//" + this.Server + this.Path + this.QueryStr.toString();
        }
    };
};

exports.getUrlExceptQueryStr = function (url) {
    return url.split('?')[0];
}
//根据传入的参数对象，拼出querystring
exports.getQueryStrFromObj = function (paras) {
    var paraString = "";
    if (paras) {
        for (var i in paras) {
            if(paras.hasOwnProperty(i)){
                var val = paras[i];
                if(typeof val !=='function'){
                    paraString += i + "=" + encodeURIComponent(paras[i]) + "&";
                }
            }
        }
        if (paraString.length > 0) {
            paraString = "?" + paraString.substr(0, paraString.length - 1); //去掉最后一个&
        }
    }
    return paraString;
};



/**
 * 回到跳转过来的页面
 */
exports.returnBack = function(){
    var url = exports.getUrlReturnBack();
    if(url){
        location.href = url;
    }
}
/**
 * 获取跳转回前一个页面的url
 */
exports.getUrlReturnBack = function(){
    var queryObj = exports.getQueryStrObj(window.location.search),url;
    //如果当前页面是从一个【同域名】的其他页面跳转过来，则返回
    if(queryObj._from && queryObj._from.split('/')[2]===location.host){
        url = queryObj._from
    }
    return url;
}
/**
 * 跳转到一个目标页面。会在请求参数里带上_from字段，方便后者再跳回来
 * @param action
 * @param controller
 * @param paras
 */
exports.redirectTo = function(action, controller, paras){
    location.href = exports.getUrlRedirectTo(action, controller, paras);
}

//在页面跳转之间，需要保留的queryString
var _keepParams={
};
exports.setKeepParams = function (name) {
    _keepParams[name] = true;
}
/**
 * 获取跳转到某个action的url
 * @param action
 * @param controller
 * @param paras
 * @param supportRecursive:是否支持递归跳转，默认false,否则可能会造成多次跳转后链接n长
 */
exports.getUrlRedirectTo = function(action, controller, paras,supportRecursive){

    paras = paras ||{};
    var oldUrl = getHref();
    var oldQuery = exports.getQueryStrObj(oldUrl);
    if(!supportRecursive){
        delete oldQuery._from ; //如果当前地址已经有from了，则移除（这样就不支持递归跳转）
    }
    paras._from =exports.getUrlExceptQueryStr(oldUrl)+exports.getQueryStrFromObj(oldQuery);

    for(var i in oldQuery){
        if(_keepParams[i]===true){
            paras[i] = oldQuery[i]
        }
    }
    var url = exports.action(action,controller,paras);
    return url;
}
