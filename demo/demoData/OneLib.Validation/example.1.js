var validation = OneLib.Validation,wnd = window;

//添加一个自定义验证器，验证某个输入必须在指定范围内
validation.setValidateFunction("mustBetween", {
    /**
     * 验证函数体，接收from,to 2个参数，让用户指定比较范围
     */
    fn:function (from,to, cb) {
        //验证器逻辑：当被验证的值(origin)在from,to之间时，为true(通过)
        cb&&cb(this.origin >= from && this.origin <= to,"输入必须在[{1},{2}]之间");
    },
    desc:'输入必须在[{1},{2}]之间' //如果fn中的cb没有给出第二个参数，会默认用这个描述来返回
});
var valid = validation.targetWrapper;//方便使用

var test1 = function(){
    var userInput1 =12; //模拟用户输入
    var result = valid(userInput1,"用户输入的内容1").mustBetween(11,21).run();
    result.then(function (ret) {
        wnd.alert('ret is:'+JSON.stringify(ret));
    });
    
}
var test2 = function(){
    var userInput1 =123; //模拟用户输入
    var result = valid(userInput1,"用户输入的内容1").mustBetween(11,21).run();
    result.then(function (ret) {
        wnd.alert('ret is:'+JSON.stringify(ret));
    });
    
}
