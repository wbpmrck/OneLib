
jasmine.DEFAULT_TIMEOUT_INTERVAL = 2*1000 //扩大jasmine 默认的每个suite的超时时间
var logger = new OneLib.Log.Logger(true);

function LoadTarget(urlArray){
    var self = this;//save the this ref

    self.tasks = urlArray;
}
/**
 * 获取下载的url是不是在任务目标中
 * @param url
 * @returns {boolean}
 */
LoadTarget.prototype.contain = function(url){
    var self = this;//save the this ref

    for(var i=0,j=self.tasks.length;i<j;i++){
        if(url==self.tasks[i]){
            return true;
        }
    }
    return false;
}

describe('加载外部js,并且有回调', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can use loadScript to simple download a script', function (done) {
        var toLoad = new LoadTarget([
            'http://localhost:19527/src/old/MyCore.ImageLoader.js',
            'http://localhost:19527/src/old/MyCore.Navigation.js',
            'http://localhost:19527/src/old/MyCore.Url.js'
        ]);
        var calledTimes = 0;

        for(var i=0,j=toLoad.tasks.length;i<j;i++){
            var _item = toLoad.tasks[i];
            OneLib.ScriptLoader.loadScript(_item,function(url,beginAt,endAt){

                expect(beginAt).toBeDefined();
                expect(endAt).toBeDefined();
                expect(endAt).toBeGreaterThan(beginAt);
                expect(toLoad.contain(url)).toBe(true);

                calledTimes++;
                if(calledTimes===toLoad.tasks.length){
                    done();
                }
            });
        }
    });
});

describe('可以使用queue来串行下载多个文件', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can use ScriptQueue.start to download scripts in sequence', function (done) {
        var toLoad = new LoadTarget([
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/module_a.js',
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/module_b.js',
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/module_c.js'
        ]);
        var calledTimes = 0; //回调被调用的数量，可能是其他任务在同一个队列执行的任务
        var loaded =0; //正在下载成功通知的文件在自己意识的范围内的数量

        var queue1 = OneLib.ScriptLoader.beginQueue('queue1').load(toLoad.tasks);
        queue1.on("load", function (url, beginAt, endAt) {
            logger.writeLine("1 onload called");
            expect(beginAt).toBeDefined();
            expect(endAt).toBeDefined();
            expect(endAt).toBeGreaterThan(beginAt);

            if(toLoad.contain(url)){
                loaded++;
            }

            calledTimes++;
        });
        queue1.on("finish",function(){
            logger.writeLine("1 finish called");
            if(loaded===toLoad.tasks.length){
                done();
            }
        });
        queue1.start();

    });
    it('should can use theQueue to find a exist queue,and add some task to continue download', function (done) {
        var queue1 = OneLib.ScriptLoader.theQueue("queue1");
        var toLoad = new LoadTarget([
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/module_a3.js',
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/module_b3.js',
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/module_c3.js']);

        var calledTimes = 0;
        var loaded =0; //正在下载成功通知的文件在自己意识的范围内的数量
        expect(queue1).toBeDefined();
        queue1.load(toLoad.tasks);
        queue1.on("load", function (url, beginAt, endAt) {

            logger.writeLine("2 load called");
            expect(beginAt).toBeDefined();
            expect(endAt).toBeDefined();
            expect(endAt).toBeGreaterThan(beginAt);

            if(toLoad.contain(url)){
                loaded++;
            }
            calledTimes++;
        });
        queue1.on("finish",function(){
            logger.writeLine("2 finish called");
            if(loaded===toLoad.tasks.length){
                done();
            }
        });
        queue1.start();
    });
    it('should ensure the script load in sequence', function (done) {
        //为了保证脚本加载确实是按照顺序的，专门设计独立的脚本来验证
        var toLoad = new LoadTarget([
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/seq_1.js',
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/seq_2.js',
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/seq_3.js'
        ]);
        var calledTimes = 0; //回调被调用的数量，可能是其他任务在同一个队列执行的任务
        var loaded =0; //正在下载成功通知的文件在自己意识的范围内的数量

        var queue3 = OneLib.ScriptLoader.beginQueue('queue3').load(toLoad.tasks);
        queue3.on("load", function (url, beginAt, endAt) {
            logger.writeLine("3 onload called");
            expect(beginAt).toBeDefined();
            expect(endAt).toBeDefined();
            expect(endAt).toBeGreaterThan(beginAt);

            if(toLoad.contain(url)){
                loaded++;
            }

            calledTimes++;
        });
        queue3.on("finish",function(){
            logger.writeLine("3 finish called");
            //只有当3个脚本确实是按照顺序加载的，才会得到正确的值
            if(loaded===toLoad.tasks.length){
                expect(seq_3).toEqual("seq_1_seq_2_seq_3");
                done();
            }
        });
        queue3.start();
    });


    it('should can use ScriptQueue.asyncStart to download scripts in async mode', function (done) {
        var toLoad = new LoadTarget([
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/module_a4.js',
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/module_b4.js',
            'http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/module_c4.js'
        ]);
        var calledTimes = 0; //回调被调用的数量，可能是其他任务在同一个队列执行的任务
        var loaded =0; //正在下载成功通知的文件在自己意识的范围内的数量

        var queue4 = OneLib.ScriptLoader.beginQueue('queue4').load(toLoad.tasks);
        queue4.on("load", function (url, beginAt, endAt) {
            logger.writeLine("4 onload called");
            expect(beginAt).toBeDefined();
            expect(endAt).toBeDefined();
            expect(endAt).toBeGreaterThan(beginAt);

            if(toLoad.contain(url)){
                loaded++;
            }

            calledTimes++;
        });
        queue4.on("finish",function(){
            logger.writeLine("4 finish called");
            if(loaded===toLoad.tasks.length){
                done();
            }
        });
        queue4.asyncStart();

    });

});

describe('others', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('if you create a queue with name exist,will cause error', function () {
        expect(function () {
            var queue4 = OneLib.ScriptLoader.beginQueue('queue4').load(toLoad.tasks);
        }).toThrow();

    });
    it('if you don not specify queuename,loader will not keep the queue in memory', function () {
        var queues = OneLib.ScriptLoader.getAllQueue();
        var count = 0,count2=0;
        for(var i in queues){
            count++;
        }
        var queue = OneLib.ScriptLoader.beginQueue();
        queues = OneLib.ScriptLoader.getAllQueue();
        for(var i in queues){
            count2++;
        }
        expect(count).toEqual(count2);

    });
});

//加载窗口的时候就启动jasmine
window.onload=function(){
    window.startJasmine();
}