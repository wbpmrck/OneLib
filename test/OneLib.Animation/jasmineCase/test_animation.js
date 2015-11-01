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



            //use option object to create animation
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

    it('should can use api:regDelta to regist your delta functions', function () {
        //do some assert
        define('t3', [], function (require, exports, module) {

            var Animation = require("OneLib.Animation");
            Animation.regDelta("line", function (progress) {
                return progress;
            });
            var line = Animation.builtInDelta("line");
            expect(line).not.toBeUndefined();
        });
    });

    it('should can use apis to control the animation play or stop', function (done) {
        define('t4', [], function (require, exports, module) {

            var Animation = require("OneLib.Animation");

            var linear = Animation.createAnimation(10000,Animation.builtInDelta("linear"),function(delta){
            });

            expect(linear.status).toEqual(0);

            //use play to start
            linear.play();
            expect(linear.status).toEqual(1);

            //use pause
            setTimeout(function () {
                linear.pause();
                expect(linear.status).toEqual(2);
                expect(linear.curFrame).toBeGreaterThan(5);//1s 内动画应该执行不止5帧

                //use resume
                setTimeout(function () {
                    linear.resume();
                    expect(linear.status).toEqual(1);
                    expect(linear.totalPaused).toBeGreaterThan(500);//停止了 1s 的动画

                    //use restart
                    setTimeout(function () {
                        linear.restart();
                        expect(linear.status).toEqual(1);
                        //use stop
                        setTimeout(function () {
                            linear.stop();
                            expect(linear.status).toEqual(0);
                            done();
                        },1000);
                    },1000);

                },1000);
            },1000);
        });
    },10000);

    it('should can use event api to subscribe and handler every useful events', function (done) {
        define('t5', [], function (require, exports, module) {

            var Animation = require("OneLib.Animation");
            var linear = Animation.createAnimation(10000,Animation.builtInDelta("linear"),function(delta){
            });

            var eventListen ={
                "start":0,
                "fpsChange":0,
                "finish":0,
                "pause":0,
                "resume":0,
                "stop":0
            }

            function hasEvent(name){
                console.log("event:"+name +" has received!")
                eventListen[name]++;
                var c = 0;
                for(var e in eventListen){
                    if(eventListen[e]==0){
                        c++;
                    }
                }
                if(c==0){
                    done();
                }
            }

            linear.on("*", function (evtName) {
                hasEvent(evtName);
            });
            //use play to start
            linear.play();
            expect(linear.status).toEqual(1);

            //use pause
            setTimeout(function () {
                linear.pause();
                expect(linear.status).toEqual(2);
                expect(linear.curFrame).toBeGreaterThan(5);//1s 内动画应该执行不止5帧

                //use resume
                setTimeout(function () {
                    linear.resume();
                    expect(linear.status).toEqual(1);
                    expect(linear.totalPaused).toBeGreaterThan(500);//停止了 1s 的动画

                    //use restart
                    setTimeout(function () {
                        linear.restart();
                        expect(linear.status).toEqual(1);
                        //use stop
                        setTimeout(function () {
                            linear.stop();
                            expect(linear.status).toEqual(0);
                            done();
                        },1000);
                    },1000);

                },1000);
            },1000);

        });
    },10000);
});