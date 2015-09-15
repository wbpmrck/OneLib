//演示即将被异步加载的一个模块module1 所同步加载的另外一个模块 module3
//注意，由于本模块 被module1使用 require 来使用，所以模块加载器应该在异步加载module1的时候，自动发现要先加载module3

define('module3', function (require, exports, module) {

    exports.val =3

});