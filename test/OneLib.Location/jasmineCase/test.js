describe('OneLib.Location.parseUrl:', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can parse url correctly', function () {
        //do some assert
        define('TestParseUrl', ['OneLib.Location'], function (require, exports, module) {
            var Location = require('OneLib.Location');

            var url1 ="http://www.baidu.com/?a=1&b=2";
            var url2 ="https://www.baidu.com:9090/?a=1&b=2";

            var parsed1 = Location.parseUrl(url1);
            var parsed2 = Location.parseUrl(url2);

            //parsed1
            expect(parsed1.href).toEqual(url1);
            console.log(JSON.stringify(parsed1));
            expect(parsed1.host).toEqual('www.baidu.com');
            expect(parsed1.path).toEqual('/?a=1&b=2');
            expect(parsed1.origin).toEqual('http://www.baidu.com');
            expect(parsed1.port).toEqual(80);
            expect(parsed1.protocol).toEqual('http');

            //parsed2
            expect(parsed2.href).toEqual(url2);
            expect(parsed2.host).toEqual('www.baidu.com');
            expect(parsed2.path).toEqual('/?a=1&b=2');
            expect(parsed2.origin).toEqual('https://www.baidu.com');
            expect(parsed2.port).toEqual(9090);
            expect(parsed2.protocol).toEqual('https');

        });

    });

});