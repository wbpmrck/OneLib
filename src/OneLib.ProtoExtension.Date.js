/**
 * @Created by kaicui.
 * @Date:2014-03-31 10:15
 * @Desc: 用于对Date类进行基础扩展，使其支持更多的功能
 * 1、增加直接按格式获取日期字符串功能
 * 2、增加IE9-等对Date.now的支持
 * @Change History:
 --------------------------------------------
 @created：|kaicui| 2014-03-31 10:15.
 --------------------------------------------
 */

//增加IE9-等对Date.now的支持
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
if (!Date.prototype.format) {
    Date.prototype.format = function(fmt){
        var self = this;//save the this ref
        var o = {
            "M+" : self.getMonth()+1,                 //月份
            "d+" : self.getDate(),                    //日
            "h+" : self.getHours(),                   //小时
            "m+" : self.getMinutes(),                 //分
            "s+" : self.getSeconds(),                 //秒
            "q+" : Math.floor((self.getMonth()+3)/3), //季度
            "f+"  : self.getMilliseconds()             //毫秒
        };
        //将毫秒补位成3位
        var less = 3 - (""+ o["f+"]).length;
        while( less > 0){
            o["f+"] = "0" + o["f+"];
            less--;
        }
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (self.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    };
}