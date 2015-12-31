describe('OneLib.Validation ', function () {
    beforeEach(function () {
        //run before each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20*1000

    });

    afterEach(function () {
        //run after each test
    });


    it('should can use targetWrapper to begin validation', function () {
        define('testRemoveDump3', [], function (require, exports, module) {

            var validation = require('OneLib.Validation');

            var someInput = 10;

            var v = validation.targetWrapper(someInput);

            expect(v).not.toBeUndefined();
            expect(v.targets.length).toBe(1);

        });

    });
});

describe('Built-in Validator:', function () {
    beforeEach(function () {
        //run before each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20*1000
    });

    afterEach(function () {
        //run after each test
    });

    it('should can work with "isPhoneNo" validator', function () {
        define('test-isPhoneNo', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '13865803583';

            validation(someInput).isPhoneNo().
                failed(function (val,desc,funcKey,args,funcDesc) {
                }).
                passed(function () {
                    cb();
                }).
                run();

        });
    });
});