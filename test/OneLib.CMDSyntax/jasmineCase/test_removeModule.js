describe('removeModule function:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
        //run after each test
        OneLib.CMDSyntax.removeAll();
    });

    it('should can remove a exist module', function () {

        define('_log', [], function (require, exports, module) {
        });
        //do some assert  //do some assert
        var logModule = OneLib.CMDSyntax.require('_log');//use alias to require OneLib.Log module
        expect(logModule).toBeDefined();

        expect(OneLib.CMDSyntax.removeModule('_log')).toBe(true);//remove success
        expect(OneLib.CMDSyntax.require('_log')).toBeUndefined();//the module is not exist again

    });
});