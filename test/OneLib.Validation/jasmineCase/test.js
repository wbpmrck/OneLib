describe('OneLib.Validation ', function () {
    beforeEach(function () {
        //run before each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20*1000

    });
 
    afterEach(function () {
        //run after each test
    });

    it("should also work when no loader in browser document", function () {
        
        define("testNoLoader",function(require,exports,module){
            //2种方式拿到的module的属性在内存中是一块
            expect(window.OneLib.Validation.targetWrapper).toBe(require('OneLib.Validation').targetWrapper);
            expect(window.OneLib.Validation.setValidateFunction).toBe(require('OneLib.Validation').setValidateFunction);
        });
        
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

describe("Promise return", function () {
    beforeEach(function () {
        //run before each test
    });
    afterEach(function () {
        //run after each test
    });

    it("can return promise", function () {


        define("test promise",function(require,exports,module){

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '13374823341',passCalled = false;

            // var v = validation(someInput,'正确的输入示例').isPhoneNoStr().runAsPromise();
            var v = validation(someInput,'正确的输入示例').isPhoneNoStr().run();

            v.then(function (result) {
                expect(result.pass).toBe(true);
                expect(result.origin).toEqual(someInput);
                expect(result.desc).toEqual('正确的输入示例');

            });
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

    it('should can work with "isNum" validator', function () {
        define('test-isNum', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = 123,passCalled = false;
            var someInput2 = '123',failedCalled = false;

            validation(someInput,'正确的输入示例').isNum().
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

            validation(someInput2,"错误的输入示例").isNum().
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须是数字类型');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });

    it('should can work with "isOneOf" validator', function () {
        define('test-isNum', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = 123,passCalled = false;
            var someInput2 = '123',failedCalled = false;

            validation(someInput,'正确的输入示例').isOneOf([123,234,456]).
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

            validation(someInput2,"错误的输入示例").isOneOf([123,234,456]).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须取集合[123,234,456]中的值');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });

    it('should can work with "isIntStr" validator', function () {
        define('test-isIntStr', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '123456',passCalled = false;
            var someInput2 = 'wrong1',failedCalled = false;

            validation(someInput,'正确的输入示例').isIntStr(6,6).
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

            validation(someInput2,"错误的输入示例").isIntStr(6,6).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须是6~6位整数数字');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });


    it('should can work with "isStr" validator', function () {
        define('test-isStr', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '123456',passCalled = false;
            var someInput2 = 22,failedCalled = false;

            validation(someInput,'正确的输入示例').isStr().
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

            validation(someInput2,"错误的输入示例").isStr().
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须是字符串');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });



    it('should can work with "notEmptyStr" validator', function () {
        define('test-notEmptyStr', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '123456',passCalled = false;
            var someInput2 = '',failedCalled = false;

            validation(someInput,'正确的输入示例').notEmptyStr().
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

            validation(someInput2,"错误的输入示例").notEmptyStr().
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('不能为空');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });


    it('should can work with "noSpecialStr" validator', function () {
        define('test-noSpecialStr', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '123abc我你_"\',，?？.',passCalled = false;
            var someInput2 = '^&*##',failedCalled = false;

            validation(someInput,'正确的输入示例').noSpecialStr().
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

            validation(someInput2,"错误的输入示例").noSpecialStr().
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('不能包含特殊字符');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });

    it('should can work with "lengthBetween" validator', function () {
        define('test-lengthBetween', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '123456789',passCalled = false;
            var someInput2 = '123',failedCalled = false;

            validation(someInput,'正确的输入示例').lengthBetween(4,'*').lengthBetween(4,30).lengthBetween('*',30).
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

            validation(someInput2,'错误的输入示例').lengthBetween(4,'*').lengthBetween(4,30).lengthBetween('*',30).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('长度必须大于4');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });


    it('should can work with "notNull" validator', function () {
        define('test-notNull', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = '12',passCalled = false;
            var someInput2 = null,failedCalled = false;
            var someInput3 = undefined,failedCalled3 = false;

            validation(someInput,'正确的输入示例').notNull().
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

            validation(someInput2,"错误的输入示例").notNull().
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('不能为空');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

            validation(someInput3,"错误的输入示例").notNull().
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled3 = true;

                    //get info when failed
                    expect(val).toEqual(someInput3);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('不能为空');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled3).toBe(true);

        });
    });




    it('should can work with "positiveInt" validator', function () {
        define('test-positiveInt', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = 1233,passCalled = false;
            var someInput2 = -2,failedCalled = false;

            validation(someInput,'正确的输入示例').positiveInt().
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

            validation(someInput2,"错误的输入示例").positiveInt().
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须是正整数');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });


    it('should can work with "positiveFloat" validator', function () {
        define('test-positiveFloat', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = 123.44,passCalled = false;
            var someInput2 = -2,failedCalled = false;

            validation(someInput,'正确的输入示例').positiveFloat(3,2).
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

            validation(someInput2,"错误的输入示例").positiveFloat(3,2).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须是整数位不超过3,小数位不超过2的正数');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });

    it('should can work with "equalTo" validator', function () {
        define('test-equalTo', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = 123,passCalled = false;
            var someInput2 = -2,failedCalled = false;

            validation(someInput,'正确的输入示例').equalTo(someInput).
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

            validation(someInput2,"错误的输入示例").equalTo(someInput).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须等于123');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });

    it('should can work with "sameTo" validator', function () {
        define('test-sameTo', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = {val:123,toString:function(){return 'someInput'}},passCalled = false;
            var someInput2 = {val:123,toString:function(){return 'someInput'}},failedCalled = false;

            validation(someInput,'正确的输入示例').sameTo(someInput).
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

            validation(someInput2,"错误的输入示例").sameTo(someInput).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须等价于someInput');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });


    it('should can work with "biggerThan" validator', function () {
        define('test-biggerThan', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = 123,passCalled = false;
            var someInput2 = -2,failedCalled = false;

            validation(someInput,'正确的输入示例').biggerThan(1).
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

            validation(someInput2,"错误的输入示例").biggerThan(1).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须大于1');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });


    it('should can work with "biggerEqualThan" validator', function () {
        define('test-biggerEqualThan', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = 123,passCalled = false;
            var someInput2 = -2,failedCalled = false;

            validation(someInput,'正确的输入示例').biggerEqualThan(123).
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

            validation(someInput2,"错误的输入示例").biggerEqualThan(1).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须大于等于1');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });

    it('should can work with "smallerThan" validator', function () {
        define('test-smallerThan', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = 123,passCalled = false;
            var someInput2 = -2,failedCalled = false;

            validation(someInput,'正确的输入示例').smallerThan(1223).
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

            validation(someInput2,"错误的输入示例").smallerThan(-21).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须小于-21');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });
    it('should can work with "smallerEqualThan" validator', function () {
        define('test-smallerEqualThan', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput = 123,passCalled = false;
            var someInput2 = -2,failedCalled = false;

            validation(someInput,'正确的输入示例').smallerEqualThan(123).
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

            validation(someInput2,"错误的输入示例").smallerEqualThan(-21).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('必须小于等于-21');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);

        });
    });
    //todo:剩余的built-in validator的test case
});

describe('Custom Validator:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can add your own validator', function () {
        define('test.addCustomValidator', [], function (require, exports, module) {

            var validation = require('OneLib.Validation');
            //添加一个自定义验证器，验证某个输入必须是x的2倍
            validation.setValidateFunction("mustDoubleTo", {
                fn:function (that, cb) {
                    //验证器逻辑：当被验证的值(origin)为目标的2倍时，为true(通过)
                    cb&&cb(this.origin == 2*that);
                },
                desc:'输入必须是{1}的2倍' //使用{index}来引用函数的输入参数
            });

            var someInput = 4,passCalled = false;
            var someInput2 = 5,failedCalled = false;

            validation.targetWrapper(someInput,'正确的输入示例').mustDoubleTo(2).
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

            validation.targetWrapper(someInput2,"错误的输入示例").mustDoubleTo(6).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('输入必须是6的2倍');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);


        });

    });
    it('should can change errorMsg template if need', function () {
        define('test.changeErrorMsg', [], function (require, exports, module) {

            var validation = require('OneLib.Validation');
            //添加一个自定义验证器，验证某个输入必须是x的2倍
            validation.setValidateFunction("mustDoubleTo", {
                fn:function (that, cb) {
                    //验证器逻辑：当被验证的值(origin)为目标的2倍时，为true(通过)
                    cb&&cb(this.origin == 2*that,"听到了吗，输入必须是{1}的2倍");
                },
                desc:'输入必须是{1}的2倍' //使用{index}来引用函数的输入参数
            });

            var someInput = 4,passCalled = false;
            var someInput2 = 5,failedCalled = false;

            validation.targetWrapper(someInput,'正确的输入示例').mustDoubleTo(2).
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

            validation.targetWrapper(someInput2,"错误的输入示例").mustDoubleTo(6).
                failed(function (val,desc,funcKey,args,funcDesc) {
                    failedCalled = true;

                    //get info when failed
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual('错误的输入示例');
                    expect(funcDesc).toEqual('听到了吗，输入必须是6的2倍');

                }).
                passed(function () {
                    throw new Error("this code should not be called!")
                }).
                run();
            expect(failedCalled).toBe(true);


        });

    });
});
describe('Batch Validator:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can add multiple validator use and', function () {
        define('multiple', [], function (require, exports, module) {

            var validation = require('OneLib.Validation').targetWrapper;

            var someInput='123abc',someInput2='222';
            validation(someInput,'输入信息').notEmptyStr().lengthBetween(1,11).
                and(someInput2).isIntStr(3,3).sameTo('222').
                failed(function (val,desc,funcKey,args,funcDesc) {
                    throw new Error("this code should not be called!")
                }).
                passed(function (val,desc) {
                    passCalled = true;
                    expect(val).toEqual(someInput2);
                    expect(desc).toEqual(undefined);
                }).
                run();
        });

    });
});