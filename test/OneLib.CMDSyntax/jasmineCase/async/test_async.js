

describe('require.async:', function () {

    //异步获取脚本，要求脚本信息要配置在srcMap里
    OneLib.CMDSyntax.setSrcMap({
        "module1":{
            uri:"http://localhost:19527/test/OneLib.CMDSyntax/jasmineCase/resource/module1.js",
            deps:['module3'] //module1 同步依赖module3
        },
        "module2":{
            uri:"http://localhost:19527/test/OneLib.CMDSyntax/jasmineCase/resource/module2.js",
            deps:[]
        },
        "module3":{
            uri:"http://localhost:19527/test/OneLib.CMDSyntax/jasmineCase/resource/module3.js",
            deps:[]
        },
        "module4":{
            uri:"http://localhost:19527/test/OneLib.CMDSyntax/jasmineCase/resource/module4.js",
            deps:[]
        },
        "module5":{
            uri:"http://localhost:19527/test/OneLib.CMDSyntax/jasmineCase/resource/module5.js",
            deps:[]
        }
    });

    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
    });
    it('should can use require.async to load a script', function (done) {

        define('test', function (require, exports, module) {
            require.async('module1', function (module1) {
                expect(module1.method1()).toEqual('method1');
                module1.method2(function (val) {
                    console.log('sss---'+val);
                    expect(val).toEqual(5);
                    done();
                });
            })
        });
    },3000);

    it('should can require multiple scripts', function (done) {

        define('testMultiple', function (require, exports, module) {
            require.async(['module1','module3','module4','module5'], function (module1,module3,module4,module5) {
                expect(module1.method1()).toEqual('method1');
                expect(module3.val).toEqual(3);
                expect(module4.val).toEqual(4);
                expect(module5.val).toEqual(5);
                done();
            })
        });
    },3000);
});

window.onload = function () {
    window.startJasmine();
}