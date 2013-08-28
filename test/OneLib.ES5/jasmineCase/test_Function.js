describe('Function.prototype ', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can use bind method', function () {
        //do some assert
        function _add(a,b,c){
            expect(this).toEqual({a:1});
            return a+b+c;
        }
        var _addWithEight = _add.bind({a:1},8);
        expect(_addWithEight(10,20)).toBe(38); //it bind 8 to the params. so it do 8+10+20=38
        expect(_addWithEight.call({a:2},10,20)).toBe(38); //it bind 8 to the params. so it do 8+10+20=38
    });
});