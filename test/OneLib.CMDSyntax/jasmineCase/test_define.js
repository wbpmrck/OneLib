describe('define:', function () {

    beforeEach(function () {
    });

    afterEach(function () {
        //run after each test
        OneLib.CMDSyntax.removeAll();
    });

    describe('require method:', function () {

        it('should can require other modules from dependencies', function () {
            //do some assert
            define('some module', [], function (require, exports, module) {
                return 1;

            });
            define('testModule', ['some module'], function (require, exports, module) {
                var m1 = require('some module');
                var m2 = require('some module');
                expect(m1).toBeDefined();
                expect(m1).not.toBe(m2); //2015-09-15：every require will got a copy of module
            });
        });

        //it('should throw error when required moduleName not in dependencies array', function () {
        //    //do some assert
        //    define('testModule', ['_log'], function (require, exports, module) {
        //        expect(function(){
        //            var logModule = require('someNameNotExistInArray');
        //        }).toThrow();
        //    });
        //});
    });

    describe(' "return" in the factory:', function () {
        beforeEach(function () {
            //run before each test
        });

        afterEach(function () {
            //run after each test
        });

        it('should replace the exports if you use return in the factory', function () {
            //do some assert
            define('someModule', [], function (require, exports, module) {
                return {
                  some:'thing'
                }
            });
            define('module2', ['someModule'], function (require, exports, module) {

                var m = require('someModule');
                expect(m).toBeDefined();
                expect(m).toEqual({
                    some:'thing'
                });
            });
        });
    });

    describe('exports object:', function () {
        beforeEach(function () {
            //run before each test
        });

        afterEach(function () {
            //run after each test
            OneLib.CMDSyntax.removeAll();
        });

        it('should exports its properties to outside', function () {
            //do some assert
            define('calculator', [], function (require, exports, module) {
                exports.add  = function(a,b){
                    return a+b;
                }
            });
            define('bizModule', ['calculator'], function (require, exports, module) {
                var cal = require('calculator');
                expect(cal.add(1,2)).toBe(3);
            });
        });
        it('should not update "exports" object,it does not work', function () {
            //do some assert
            define('calculator', [], function (require, exports, module) {
                exports={
                    add:function(a,b){
                        return a+b;
                    }
                } ;
            });
            define('bizModule', ['calculator'], function (require, exports, module) {
                var cal = require('calculator');
                expect(cal.add).toBeUndefined();
            });
        });
    });

    describe('factory function:', function () {
        beforeEach(function () {
            //run before each test
        });

        afterEach(function () {
            //run after each test
            OneLib.CMDSyntax.removeAll();
        });

        it('should can visit some meta information from the "module" param ', function () {
            define('_log', [], function (require, exports, module) {

            });
            //do some assert
            define('calculator', ['_log','notExist'], function (require, exports, module) {
                expect(require('notExist')).toBeUndefined();
                expect(module.id).toBe('calculator');
                expect(module.name).toBe('calculator');
                //expect(module.dependencies).toEqual(['_log','notExist']);

                module.dependencies="aaa";//update inside the factory,but does not infect the real data
            });

            var calModule = OneLib.CMDSyntax.require('calculator');
            //expect(calModule.dependencies).toEqual(['_log','notExist']);//update inside the factory,but does not infect the real data
            expect(calModule.dependencies).toBe(undefined);//update inside the factory,but does not infect the real data

        });

        it('should keep private members save,can not visit from outside', function () {
            //do some assert
            define('calculator', [], function (require, exports, module) {
                var _privateMember =1;
                exports.add  = function(a,b){
                    return a+b;
                }
            });
            define('bizModule', ['calculator'], function (require, exports, module) {
                var cal = require('calculator');
                expect(cal.add(1,2)).toBe(3);
                expect(cal._privateMember).toBeUndefined();
            });
            expect(window['calculator']).toBeUndefined();
        });
        it('should create the module inside the system,invisible in global', function () {
            //do some assert
            define('calculator', [], function (require, exports, module) {
                exports.add  = function(a,b){
                    return a+b;
                }
            });
            expect(window['calculator']).toBeUndefined();
        });

        it('should can set the "module.exports" to exports multiple members to outside ', function () {
            //do some assert
            define('calculator', [], function (require, exports, module) {
                var _privateMember =1;
                module.exports={
                    add:function(a,b){
                        return a+b;
                    },
                    double:function(a){
                        return 2*a;
                    }
                };
            });
            define('bizModule', ['calculator'], function (require, exports, module) {
                var cal = require('calculator');
                expect(cal.add(1,2)).toBe(3);
                expect(cal.double(6)).toBe(12);
            });
        });
    });


});
describe('defined Module:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
        OneLib.CMDSyntax.removeAll();
    });

    it('should have id,name,dependencies and other properties,alias must be transformed', function () {
        define('_log', [], function (require, exports, module) {

        });  
        //do some assert
        define('testModule', ['_log'], function (require, exports, module) {
        });
        var _testModule = OneLib.CMDSyntax.require('testModule');
        expect(_testModule).toBeDefined();

        expect(_testModule.id).toBe('testModule');
        expect(_testModule.name).toBe('testModule');
        //expect(_testModule.dependencies).toEqual(['_log']);
        expect(_testModule.exports).toBeDefined();
        expect(_testModule.factory).toBeDefined();
    });
    it('dump define module will throw error', function () {
        //do some assert
        define('a', [], function (require, exports, module) {
            return {a:'module'}
        });
        expect(function(){
            define('a', [], function (require, exports, module) {
                return {a:'again'}
            });
        }).toThrow();
    });
});

describe('define with out dependency', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
        OneLib.CMDSyntax.removeAll();
        OneLib.CMDSyntax.setSrcMap(null);
    });

    it('should success if has config srcMap first.', function () {
        //首先初始化srcMap
        OneLib.CMDSyntax.setSrcMap({
            "a":{
                uri:"http://static.local.com/a.js",
                deps:[] //无依赖的情况
            },
            "b":{
                uri:"http://static.local.com/b.js",
                deps:[
                    "a" //b依赖a
                ]
            }
        });
        define('a', function (require, exports, module) {
            return {a:'this is module a without dependency on factory method'}
        });
        define('b', function (require, exports, module) {
            var a = require("a");
            expect(a.a).toEqual('this is module a without dependency on factory method');
        });
        expect(function () {
            define('c', function (require, exports, module) {
                var a = require("a");
            });
        }).not.toThrow();
    });
});