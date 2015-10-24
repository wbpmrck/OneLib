var LoggerClass = OneLib.Log.Logger,
    _logger = new LoggerClass(true); //true means enable logging

function runTest_writeLine(){
    _logger.writeLine('this is some log !!'); //default will write to DOM
}
