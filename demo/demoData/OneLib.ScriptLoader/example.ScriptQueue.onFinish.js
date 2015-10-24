var test_onFinish = function(){
    var queue_onfinish = OneLib.ScriptLoader.beginQueue('3 modules').
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b.js').//加载文件1.js
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b2.js').//加载文件2.js
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b3.js');//加载文件3.js

    queue_onfinish.on("load",function(url,begin,end){
        alert('script:['+url+'] load success,['+begin.toLocaleTimeString()+'~'+end.toLocaleString()+']');
    });
    queue_onfinish.on("finish",function(){
        alert('全部下载成功');
    });
    queue_onfinish.start();//开启下载
};