define('testEmitterRealonce', ['OneLib.EventEmitter'], function (require, exports, module) {
    var EventEmitter = require('OneLib.EventEmitter');

    //定义一个类
    function Dog(name){
        this.name = name;
    }
    Dog.prototype.shout = function(){
        this.emit('shouted',this.name)
    }

    //使用mixin方法将on,emit,off方法注入到类的prototype里
    EventEmitter.mixin(Dog);

    var aDog = new Dog('bingo')

    aDog.once('shouted',function(name){
        //处理事件,这个回调只会被执行一次
        alert('dog:'+name+' shouted!')
    })
    exports.runTest = function(){
        aDog.shout();//第1次调用,只有这一次会触发回调
        aDog.shout();//第2次调用
        aDog.shout();//第3次调用
    }

});