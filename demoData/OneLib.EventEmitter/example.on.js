define('testEmitterOn', ['OneLib.EventEmitter'], function (require, exports, module) {
    var EventEmitter = require('OneLib.EventEmitter');

    //定义一个类
    function Dog(name){
        this.name = name;
    }
    Dog.prototype.shout = function(){
        this.emit('shouted',this.name)
    }
    Dog.prototype.walk = function(){
        this.emit('walk',this.name)
    }

    //使用mixin方法将on,emit,off方法注入到类的prototype里
    EventEmitter.mixin(Dog);

    var aDog = new Dog('bingo')

    aDog.on('shouted',function(name){
        //处理事件
        alert('dog:'+name+' shouted!')
    })
    aDog.on('walk',function(name){
        //处理事件
        alert('dog:'+name+' walk!')
    },2) //设置TTL为2
    exports.runTest = function(){
        aDog.shout();
        aDog.shout();
        aDog.shout();//由于shout订阅没有指定TTL,所以3次全部会触发
        aDog.walk();
        aDog.walk();
        aDog.walk();//调用3次walk,只会触发2次调用
    }

});