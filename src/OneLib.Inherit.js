/**
 * @Created by kaicui.
 * @Date:2015-02-05 10:16
 * @Desc: 用于提供继承特性
 * 1、使用中间函数对象来隔离子类的prototype修改对基类的影响
 * @Change History:
 --------------------------------------------
 @created：|kaicui| 2015-02-05 10:16.
 --------------------------------------------
 */

define('OneLib.Inherit', [], function (require, exports, module) {
    //inherit几点说明：
    //1:使用中间函数对象F的实例new F，来充当子类的prototype,而new F的_proto_('此刻'F的prototype)
    //指向父类prototype,所以实现继承
    //2:要注意到的是，F函数对象只有一个，那么，修改F.prototype = parentClass.prototype;会不会导致不同类的继承
    //关系混乱？答案是否，因为，new F执行的时候，会将"此刻"F.prototype赋值给obj._proto_,即使后来F.prototype改了
    //之前生成好的对象也不会改变其原型链
    var inherit = (function () {
        var F = function () {};
        return function (subClass, parentClass) {
            F.prototype = parentClass.prototype;
            subClass.prototype = new F();
            subClass.prototype.constructor = subClass;//设置constructor指向构造函数
            //add by kaicui 2015-02-10(保留基类的prototype,方便调用基类方法)
            subClass.__supperClassProto__ = parentClass.prototype;
        }
    }());

    //return sth to replace the exports
    return {
        inherit:inherit,
        getSupper:function(classRef){
            return classRef.__supperClassProto__;
        }
    }

});