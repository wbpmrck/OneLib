
var test_theQueue = function(){
    OneLib.ScriptLoader.beginQueue('3 modules').
        load('../demoData/OneLib.ScriptLoader/module_b.js').
        load('../demoData/OneLib.ScriptLoader/module_b2.js').
        load('../demoData/OneLib.ScriptLoader/module_b3.js');

    OneLib.ScriptLoader.theQueue('3 modules').start();

};