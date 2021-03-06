/**
 * Created by cuikai on 2016/1/6.
 */

define('OneLib.Utils.Date', [], function (require, exports, module) {


    exports.newDate = function (year, month, day, hour, minute, seconds, ms) {
        var d =new Date();
        d.setYear(year);
        d.setMonth(month);
        d.setDate(day);
        d.setHours(hour);
        d.setMinutes(minute);
        d.setSeconds(seconds);
        d.setMilliseconds(ms);

        return d;
    }

    exports.format = function (date,fmt) { //author: meizz
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        //将毫秒补位成3位
        var less = 3 - (""+ o["f+"]).length;
        while( less > 0){
            o["f+"] = "0" + o["f+"];
            less--;
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

});
