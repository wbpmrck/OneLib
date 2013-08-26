
var test_beginQueue = function(){
    OneLib.ScriptLoader.beginQueue('3 modules').
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b.js').
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b2.js').
        load(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/module_b3.js').start();
};