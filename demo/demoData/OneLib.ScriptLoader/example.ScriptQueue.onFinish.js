var test_onFinish = function(){
    OneLib.ScriptLoader.beginQueue('3 modules').
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b.js').//加载文件1.js
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b2.js').//加载文件2.js
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b3.js').//加载文件3.js
        onFinish(function(start,end){
            alert('文件下载成功,start:'+start.toLocaleTimeString()+',end:'+end.toLocaleTimeString());
        }).
        start();//开启下载
};