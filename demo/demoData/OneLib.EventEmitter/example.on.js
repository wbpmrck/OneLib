var aDog = new Dog('bingo')

aDog.on('shouted',function(name){
    //处理事件
    alert('dog:'+name+' shouted!')
})