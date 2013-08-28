describe('auto browserDetect', function () {
    var module;
    beforeEach(function () {
        //run before each test
        module = OneLib.CMDSyntax.require('OneLib.BrowserDetect').exports;
    });

    afterEach(function () {
        //run after each test
    });

    it('should show the browser type in:browser property', function () {
        //do some assert
        console.log('browser is:'+module.browser);
        expect(module.browser.length).toBeGreaterThan(1);
    });
    it('should show the browser version in:version property', function () {
        //do some assert
        console.log('version is:'+module.version);
        expect(parseInt(module.version)).toBeGreaterThan(1);
    });
    it('should show the os version in:OS property', function () {
        //do some assert
        console.log('os is:'+module.OS);
        expect(module.OS.length).toBeGreaterThan(1);
    });
});