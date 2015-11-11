define('example.pipe', ['OneLib.EventEmitter'], function (require, exports, module) {
    var EventEmitter = require('OneLib.EventEmitter');

    //定义一个类
    function Factory(name){
        //注入事件能力
        EventEmitter.mixin(Factory);
        this.name = name;
    }

    var fac = new Factory('沈飞');

    fac.on('J10',function _step1(num,rate,next){
        //处理事件
        alert(this.name+' 代号为:'+num+'的J10战机 _step1建造中')
        if(num%2==0){
            next() //传递给下一步(不修改参数)
        }
    });
    fac.on('J10',function _step2(num,rate,next){
        //处理事件
        alert(this.name+' 代号为:'+num+'的J10战机 _step2抽样检查不合格！')
        next(num,Math.random().toFixed(2)) //传递给下一步(修改参数)
    });
    fac.on('*',function _step3(evtName,num,rate,next){
        //处理事件
        alert(this.name+' 代号为:'+num+'的'+evtName+'战机 _step3修复概率为'+rate+'！')
    });



    exports.runTest = function(){
        fac.pipe("J10",919,100); //建造1个J10,只经过1 工序
        fac.pipe("J10",1900,100);//建造1个J10,经过1,2,*工序
        fac.pipe("J11",2900,100);//建造1个J11,只经过* 工序
    }

});