describe('OneLib.Validation ', function () {
    beforeEach(function () {
        //run before each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20*1000

    });

    afterEach(function () {
        //run after each test
    });


    it('should can use targetWrapper to start a validation', function () {
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

    it('should can work with "isPhoneNoStr" validator', function () {
        define('test-isPhoneNoStr', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '13374823341',passCalled = false;
            var someInput2 = 's74823341',failedCalled = false;

            validation(someInput,'正确的输入示例').isPhoneNoStr().
                failed(function (val,desc,funcKey,args,funcDesc) {
                    throw new Error("this code should not be called!")
                }).
                passed(function (val,desc) {
                    passCalled = true;
                    expect(val).toEqual(someInput);
                    expect(desc).toEqual('正确的输入示例');
                }).
                run();
            expect(passCalled).toBe(true);

            validation(someInput2,"错误的输入示例").isPhoneNoStr().
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须是合法的手机号格式');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });

    it('should can work with "isNumStr" validator', function () {
        define('test-isNumStr', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '123456',passCalled = false;
            var someInput2 = 'wrong1',failedCalled = false;

            validation(someInput,'正确的输入示例').isNumStr(6).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    throw new Error("this code should not be called!")
                }).
                passed(function (val,desc) {
                    passCalled = true;
                    expect(val).toEqual(someInput);
                    expect(desc).toEqual('正确的输入示例');
                }).
                run();
            expect(passCalled).toBe(true);

            validation(someInput2,"错误的输入示例").isNumStr(6).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须是6位数字');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });
});

describe('Custom Validator:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can add your own validator', function () {
        //do some assert

    });
});