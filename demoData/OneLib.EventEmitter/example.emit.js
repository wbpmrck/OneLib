//定义一个类
function Dog(name){
    this.name = name;
}
Dog.prototype.shout = function(){
    this.emit('shouted',this.name)
}

//使用mixin方法将on,emit,off方法注入到类的prototype里
EventEmitter.mixin(Dog);