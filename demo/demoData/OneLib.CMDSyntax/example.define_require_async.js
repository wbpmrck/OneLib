define('moduleName',function (require, exports, module) {
    require.async("loginModule",function(loginModule){
        //use loginModule to do sth...
    });
    require.async(["module1","module2"],function(m1,m2){
        //m1 = module1
        //m2 = module2
    });

});