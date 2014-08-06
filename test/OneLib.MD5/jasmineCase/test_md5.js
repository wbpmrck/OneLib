describe('MD5 ', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can use "encode" to encode content', function () {
        define('testMD5', ['OneLib.MD5'], function (require, exports, module) {
            var MD5 = require('OneLib.MD5');

            var encoded = MD5.encode("123456");

            expect(encoded).toEqual("e10adc3949ba59abbe56e057f20f883e");

        });
    });
});