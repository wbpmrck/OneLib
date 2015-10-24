describe('configDealConflicts function:', function () {
    beforeEach(function () {
        //run before each test
//        OneLib.CMDSyntax.logOn();
    });

    afterEach(function () {
        //run after each test
        OneLib.CMDSyntax.removeAllModulesExcept('_log');
        OneLib.CMDSyntax.configDealConflicts({
            moduleNameConflict:'throw'
        });
//        OneLib.CMDSyntax.logOff();
    });

    it('should can modify the behavior when moduleName conflict', function () {

        OneLib.CMDSyntax.configDealConflicts({
            moduleNameConflict:'throw'
        });
        //没修改配置的时候，默认应该是抛出异常
        expect(function(){
            //do some assert
            OneLib.CMDSyntax.addAlias({
                'global':'what ever!'
            });
        }).toThrow();
        expect(function(){
            define('window', [], function (require, exports, module) {
              //what ever!
            });
        }).toThrow();
        OneLib.CMDSyntax.configDealConflicts({
            moduleNameConflict:'overwrite'
        });

        expect(function(){
            define('window', [], function (require, exports, module) {
                return {
                    i: 'am new window module'
                };
            });
        }).not.toThrow();

        expect(OneLib.CMDSyntax.require('window').exports).toEqual( {
            i: 'am new window module'
        });

        OneLib.CMDSyntax.configDealConflicts({
            moduleNameConflict:'return'
        });

        expect(function(){
            define('window', [], function (require, exports, module) {
                return {
                    i: 'am new window module2'
                };
            });
        }).not.toThrow();

        //由于配置为return,所以本次重新定义不会生效
        expect(OneLib.CMDSyntax.require('window').exports).toEqual( {
            i: 'am new window module'
        });
    })

});