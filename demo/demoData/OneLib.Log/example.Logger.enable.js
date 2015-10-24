var LoggerClass = OneLib.Log.Logger,
    _logger2 = new LoggerClass(true); //true means enable logging

_logger2.enable = false;

function runTest_enable(){
    _logger2.writeLine('this log will not show');
}
