describe('SVGTest ', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can get a SVG path string', function () {
        define('test1', function (require, exports, module) {
            var SVG = require('OneLib.SVG');

            var path = SVG.newPath().moveTo(1,2).lineTo(100,2).lineTo(100,200).moveTo(200,200).resolve()

            expect(path).toEqual("M1,2L100,2L100,200M200,200");

        });
    });
});