
//module1.js
define('module1', [], function (require, exports, module) {

    //工厂方法内部的变量是私有的
    var _privateMember = 'i am private!';

    //使用module.exports直接设置整个public对象
    module.exports={
      pub:'i am public member',
      getPrivate:function(){
          return _privateMember;
      }
    };
});

//module2.js
define('module2', ['module1','jQuery'], function (require, exports, module) {

    var wnd = window,$ = require('jQuery'),M1 = require('module1');

    //点击测试按钮的时候触发:
    $("#define_module_param").click(function(){
        wnd.alert('M1.pub = '+M1.pub); //访问M1的公开对象
        wnd.alert('M1._privateMember = '+M1._privateMember); //M1的私有对象是外部看不到的:undefined
        wnd.alert('M1._privateMember by interface = '+M1.getPrivate()); // 可以通过封装的公开接口访问对方的私有属性

        //验证module的其他属性
        wnd.alert('module.id = '+module.id);
        wnd.alert('module.name = '+module.name);
        wnd.alert('module.dependencies = '+module.dependencies);
    });

});