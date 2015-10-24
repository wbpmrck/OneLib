

//通常在项目中使用的时候，建议这些添加别名的操作统一放到1个js中，方便维护。

//config.alias.js
OneLib.CMDSyntax.addAlias({
    'module_long':'i-am-a-long-module-name-that-you-never-want-to-type-again'
});


//module1.js
define('i-am-a-long-module-name-that-you-never-want-to-type-again', [], function (require, exports, module) {
    exports.what='ever';
}); //定义一个模块，它的名字很长=。=

//module2.js
define('module_test_long', ['$','module_long','global'], function (require, exports, module) {

    var M = require('module_long'), //使用别名获取之前定义的模块
        $=require('$'),//使用别名获取jQuery
        wnd=require('global');//使用别名获取 window

    $("#test_module_test_long").click(function(){
        wnd.alert('M.what = '+ M.what);
    });

});