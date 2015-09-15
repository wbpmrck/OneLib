//演示即将被异步加载的一个模块
//该模块采用了Commonjs规范，不声明依赖，而是在全局地方有一个依赖配置
define('module1', function (require, exports, module) {

    exports.method1 = function(){
        return 'method1'
    };

    exports.method2 = function(cb){
        var EventEmitter = require('OneLib.EventEmitter');

        //验证可以同步获取到已经加载的模块
        expect(EventEmitter.mixin).toBeDefined();

        require.async('module2',function(module2){
            cb && cb(module2.val+require('module3').val);
        })
    };
});