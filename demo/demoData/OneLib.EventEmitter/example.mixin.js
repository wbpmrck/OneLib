    var EventEmitter = require('OneLib.EventEmitter');

    //定义一个类
    function Dog(){
    }
    Dog.prototype.shout = function(){
        alert('woof!woof!');
    }

    //使用mixin方法将on,emit,off方法注入到类的prototype里
    EventEmitter.mixin(Dog);

