/**
 * @Created by kaicui(https://github.com/wbpmrck).
 * @Date:2013-08-27 19:56
 * @Desc: 实现部分ECMAScript 5里新增的实用功能
 * 1、部分功能可能会对已有的Built-in对象进行侵入
 * 2、检测到浏览器已经支持的话，会什么都不做
 * @Change History:
 --------------------------------------------
 @created：|kaicui| 2013-08-27 19:56.
 --------------------------------------------
 */
;
//Array
if(!Array.prototype.forEach){
    /**
     @param {Function} iterator
     @param {Object} [thisObject]
     @return void
     */
    Array.prototype.forEach = function(iterator,thisObject){
        for(var i=0,j=this.length;i<j;i++){
            var _item = this[i];
            iterator&&iterator.call(thisObject||this,_item,i,this)
        }
    }
}
if(!Array.prototype.filter){
    /**
     *
     * @param filter
     * @param thisObject
     * @return {Array}
     */
    Array.prototype.filter = function(filter,thisObject){
        var _result =[];
        for(var i=0,j=this.length;i<j;i++){
            var _item = this[i];
            if(filter&&filter.call(thisObject||this,_item,i,this)){
                _result.push(_item);
            }
        }
        return _result;
    }
}
if(!Array.prototype.isArray){
    Array.prototype.isArray = function(obj){
       return Object.prototype.toString.apply(obj) === '[object Array]';
    }
}
// 实现 ECMA-262, Edition 5, 15.4.4.19
// 参考: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. 将O赋值为调用map方法的数组.
        var O = Object(this);

        // 2.将len赋值为数组O的长度.
        var len = O.length >>> 0;

        // 4.如果callback不是函数,则抛出TypeError异常.
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. 创建新数组A,长度为原数组O长度len
        A = new Array(len);

        // 7. 将k赋值为0
        k = 0;

        // 8. 当 k < len 时,执行循环.
        while(k < len) {

            var kValue, mappedValue;

            //遍历O,k为原数组索引
            if (k in O) {

                //kValue为索引k对应的值.
                kValue = O[ k ];

                // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
                mappedValue = callback.call(T, kValue, k, O);

                // 返回值添加到新书组A中.
                A[ k ] = mappedValue;
            }
            // k自增1
            k++;
        }

        // 9. 返回新数组A
        return A;
    };
}
//Function(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FFunction%2Fbind)
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}