describe('OneLib.CMDSyntax.require function:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
        OneLib.CMDSyntax.removeAll();
    });

    it('should can get a real module object ', function () {
        define('_log', [], function (require, exports, module) {
        });
        //do some assert
        var logModule = OneLib.CMDSyntax.require('_log');//use alias to require OneLib.Log module
        expect(logModule).toBeDefined();
    });
});