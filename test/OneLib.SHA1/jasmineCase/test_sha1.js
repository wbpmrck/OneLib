describe('SHA1 ', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can use "encode" to encode content', function () {
        define('testSHA1', ['OneLib.SHA1'], function (require, exports, module) {
            var SHA1 = require('OneLib.SHA1');

            var encoded = SHA1.encode("123456");

            expect(encoded).toEqual("7c4a8d09ca3762af61e59520943dc26494f8941b");

        });
    });
});