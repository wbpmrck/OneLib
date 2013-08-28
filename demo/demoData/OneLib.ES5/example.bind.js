var test_bind = function(){

    //一个把两个数相加的函数
    function add(a,b){
        return a+b;
    }

    var plus_10 = add.bind(undefined,10);//通过给函数绑定一个参数10,返回的函数就会默认的执行+10的操作

    alert('plus_10(20) is:'+plus_10(20)); //30

    function doSth(){
        alert('this is:'+this);
    }
    var _binded = doSth.bind('binded context!');//执行绑定后的函数，无论怎么调用该函数，this的值都是我们指定的
    _binded();
    _binded.call('another context will not work');
    _binded.apply('another context will not work too');
}
