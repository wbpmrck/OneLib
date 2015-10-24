
var test_asyncStart = function(){
    OneLib.ScriptLoader.beginQueue('asyncStartDemo').
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_a4.js').
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b4.js').
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_c4.js').
        asyncStart();
};