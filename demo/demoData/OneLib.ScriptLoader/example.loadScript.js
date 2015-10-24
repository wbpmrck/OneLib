
var runTest = function(){
    OneLib.ScriptLoader.loadScript(__subdomain__+'/demo/demoData/OneLib.ScriptLoader/script_a.js',function(){
        alert('script_a loaded! _scriptA:'+_scriptA);
    });
};