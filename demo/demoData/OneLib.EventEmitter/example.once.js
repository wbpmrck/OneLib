var aDog = new Dog('bingo')

aDog.once('shouted',function(name){
    //处理事件,这个回调只会被执行一次
    alert('dog:'+name+' shouted!')
})