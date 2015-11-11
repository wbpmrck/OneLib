define('testEmitterOnall', ['OneLib.EventEmitter'], function (require, exports, module) {
    var EventEmitter = require('OneLib.EventEmitter');

    //定义一个类
    function Dog(name){
        this.name = name;
    }
    Dog.prototype.shout = function(text){
        this.emit('shouted',' said:'+text)
    }
    Dog.prototype.walk = function(distance){
        this.emit('walk',' has walked:'+distance +' km!')
    }

    //使用mixin方法将on,emit,off方法注入到类的prototype里
    EventEmitter.mixin(Dog);

    var aDog = new Dog('bingo')

    aDog.on('*',function(evtName,param){
        //处理事件
        alert('event:'+evtName+' Captured!')
        alert('dog:'+this.name+param)
    })

    exports.runTest = function(){
        aDog.shout("hello!");
        aDog.walk(30);
    }

});