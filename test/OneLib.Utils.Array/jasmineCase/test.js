describe('arrayUtils ', function () {
    beforeEach(function () {
        //run before each test
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20*1000

    });

    afterEach(function () {
        //run after each test
    });
    
     
    it('should can use eachAsync ', function (done) {
        define('test1', function (require, exports, module) {
            var arrayUtil = require('OneLib.Utils.Array');
            var sum = 0,count=0;
            arrayUtil.eachAsync([1,2,3,4],function(item,idx,next,cancel) {
                sum+=item;
                //验证每一次调用，idx指向当前数组的下标
                expect(count).toEqual(idx);
                count++;

                if(idx ==3){
                    //已经结束
                    expect(sum).toEqual(10);
                    done();
                }else{
                    //模拟异步操作
                    setTimeout(function () {
                        next();
                    }, 1000);
                }

            });
        });
    },9000);

    it('should can use cancel to stop async execution', function (done) {
        //do some assert
        define('testCancel', function (require, exports, module) {
            var arrayUtil = require('OneLib.Utils.Array');
            var sum = 0,count=0;
            arrayUtil.eachAsync([1,2,3,4],function(item,idx,next,cancel) {
                sum+=item;
                //验证每一次调用，idx指向当前数组的下标
                expect(count).toEqual(idx);
                count++;

                if(idx ==2){
                    //并过一会，验证sum并没有增加
                    setTimeout(function () {
                        expect(sum).toEqual(6);
                        done();
                    }, 3000);
                    //提前结束
                    cancel();
                }else{
                    //模拟异步操作
                    setTimeout(function () {
                        next();
                    }, 1000);
                }

            });
        });
    },9000);
    it('should can use removeDump with no param', function () {
        define('testRemoveDump', [], function (require, exports, module) {

            var arrayUtil = require('OneLib.Utils.Array');

            var arr1 = [1,2,3,4,5,6,1,3,3,1,5,13,444,444];

            arrayUtil.removeDump(arr1);
            expect(arr1.length).toBe(8);
            expect(arr1).toEqual([1,2,3,4,5,6,13,444]);
        });
    });
    it('should can use reverse option to iterate from bottom to top', function () {
        define('testRemoveDump2', [], function (require, exports, module) {

            var arrayUtil = require('OneLib.Utils.Array');

            var arr1 = [1,2,3,4,5,6,1,3,3,1,5,13,444,444];

            arrayUtil.removeDump(arr1,true);
            expect(arr1.length).toBe(8);
            expect(arr1).toEqual([2,4,6,3,1,5,13,444]);
        });

    });

    it('should can use filter to custmize the rule to identify dump item', function () {
        define('testRemoveDump3', [], function (require, exports, module) {

            var arrayUtil = require('OneLib.Utils.Array');

            var arr1 =[
                {key1:1,key2:2,name:"data1"},
                {key1:1,key2:2,name:"data2"},
                {key1:2,key2:3,name:"data3"},
                {key1:2,key2:4,name:"data4"},
                {key1:2,key2:4,name:"data5"}
            ];

            arrayUtil.removeDump(arr1,false, function (item) {
                return item.key1+item.key2 //用key1和key2的和，来唯一标识一个item
            });
            expect(arr1.length).toBe(3);
            expect(arr1).toEqual([
                {key1:1,key2:2,name:"data1"},
                {key1:2,key2:3,name:"data3"},
                {key1:2,key2:4,name:"data4"}
            ]);
        });

    });
});