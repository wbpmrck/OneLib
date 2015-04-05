/**
 * @Created by kaicui.
 * @Date:2015-02-05 10:16
 * @Desc: 用于提供继承特性
 * 1、使用中间函数对象来隔离子类的prototype修改对基类的影响
 * 2、此js库主要是为了在已有的js代码工程中添加继承特性。如果是新的工程，建议使用OneLib.OOP库
 * @Change History:
 --------------------------------------------
 @updated:2015-04-03：
 为了方便进行js的oop编程，已经重新写了一套库OneLib.OOP,建议使用OOP里的方法来进行：
 类定义、继承等操作

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

            //add on 2015-04-03:rewrite subclass constructor,so caller do not call parent again
            var tmpSub = function(){
                parentClass.call(this);//call parent to initial instance properties
                subClass.call(this);//then call sub
                return this;
            }

            tmpSub.prototype = new F();
            tmpSub.prototype.constructor = tmpSub;//设置constructor指向构造函数
            //add by kaicui 2015-02-10(保留基类的prototype,方便调用基类方法)
            tmpSub.__supperClassProto__ = parentClass.prototype;

            return tmpSub ;//from this version,user must get the return value to overwrite the subclass outside
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