//演示即将被异步加载的一个模块module1 所异步加载的另外一个模块 module2
//他返回一个val

define('module2', function (require, exports, module) {

    exports.val =2

});