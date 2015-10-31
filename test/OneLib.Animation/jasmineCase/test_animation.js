describe('Animation', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can create by api:createAnimation', function () {
        define('t1', function (require, exports, module) {

            var Animation = require("OneLib.Animation");

            var a = Animation.createAnimation(1000, function (progress) {
                return progress;
            }, function (progress) {
                console.log(progress);
            },50,200);

            expect(a).not.toBeUndefined();
            expect(a.startTime).toBeUndefined();
            expect(a.endTime).toBeUndefined();
            expect(a.lastPausedTime).toBeUndefined();
            expect(a.totalPaused).toEqual(0);
            expect(a.id).toBeUndefined();
            expect(a.duration).toEqual(1000);
            expect(a.delay).toEqual(50);
            expect(a.totalFrame).toEqual(200);
            expect(a.curFrame).toEqual(0);
            expect(a.fps).toEqual(0);
            expect(a.status).toEqual(0);



            var a2 = Animation.createAnimation(   {
                duration:1000,
                delta:function (progress) {
                    return progress;
                },
                step:function (progress) {
                    console.log(progress);
                },
                delay:50,
                totalFrame:200
            });

            expect(a2).not.toBeUndefined();
            expect(a2.startTime).toBeUndefined();
            expect(a2.endTime).toBeUndefined();
            expect(a2.lastPausedTime).toBeUndefined();
            expect(a2.totalPaused).toEqual(0);
            expect(a2.id).toBeUndefined();
            expect(a2.duration).toEqual(1000);
            expect(a2.delay).toEqual(50);
            expect(a2.totalFrame).toEqual(200);
            expect(a2.curFrame).toEqual(0);
            expect(a2.fps).toEqual(0);
            expect(a2.status).toEqual(0);

        });
    });
    it('should can use api:builtInDelta to get built in delta functions', function () {
        define('t2', [], function (require, exports, module) {

            var Animation = require("OneLib.Animation");

            var linearFn = Animation.builtInDelta("linear");
            var bounceFn =  Animation.builtInDelta("bounce");
            var bounceEaseOut = Animation.builtInDelta("bounce","easeOut");

            expect(linearFn).not.toBeUndefined();
            expect(bounceFn).not.toBeUndefined();
            expect(bounceEaseOut).not.toBeUndefined();
            expect(bounceEaseOut).not.toEqual(bounceFn);

        });
    });
});