var test_onLoadedOne = function(){
    OneLib.ScriptLoader.beginQueue('3 modules').
        load('/demo/demoData/OneLib.ScriptLoader/module_b.js').//加载文件1.js
        load('/demo/demoData/OneLib.ScriptLoader/module_b2.js').//加载文件2.js
        load('/demo/demoData/OneLib.ScriptLoader/module_b3.js').//加载文件3.js
        onLoadedOne(function(url,start,end){
            alert('文件:'+url+'下载成功,start:'+start.toLocaleTimeString()+',end:'+end.toLocaleTimeString());
        }).
        start();//开启下载
};