
var runTest = function(){
    OneLib.ScriptLoader.loadScript('../demoData/OneLib.ScriptLoader/script_a.js',function(){
        alert('script_a loaded! _scriptA:'+_scriptA);
    });
};