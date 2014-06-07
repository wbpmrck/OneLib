describe('Array ', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can use forEach to iterate', function () {
        //do some assert
        expect(Array.prototype.forEach).toBeDefined();

        var arr =[1,2,3,4,5],sum=0;
        expect(function(){
            arr.forEach(function(item,idx,arr){
                sum+=item;
            });
        }).not.toThrow();

        expect(sum).toBe(15);
    });

    it('should can use map to iterate', function () {
        //do some assert
        expect(Array.prototype.map).toBeDefined();

        var arr =[1,2,3,4,5],mapped;
        expect(function(){
            mapped=arr.map(function(item,idx,arr){
                return item*10;
            });
        }).not.toThrow();

        expect(mapped).toEqual([10,20,30,40,50]);
    });
    it('should can use filter ', function () {
        //do some assert
        expect(Array.prototype.filter).toBeDefined();

        var arr =[1,2,3,4,5],result;
        expect(function(){
            result=arr.filter(function(item,idx,arr){
                return item%2===0||idx===4
            });
        }).not.toThrow();

        expect(result).toEqual([2,4,5]);
    });
    it('should can use isArray ', function () {
        //do some assert
        expect(Array.prototype.isArray).toBeDefined();

        var arr =[1,2,3,4,5],result;
        expect(function(){
            result=Array.isArray(arr);
        }).not.toThrow();

        expect(result).toBe(true);
    });
});