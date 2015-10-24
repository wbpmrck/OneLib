describe('EventEmitter ', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can use "mixin" to mix the prototype to other class', function () {
        function Dog(){

        }
        Dog.prototype.shout = function(){
            console.log('woof!woof!');
        }

        OneLib.EventEmitter.mixin(Dog);

        expect(Dog.prototype.emit).toBeDefined();
        expect(Dog.prototype.on).toBeDefined();
        expect(Dog.prototype.off).toBeDefined();

    });
    it('should can use "emit" to fire events,and use "on" to set callback', function () {
        //do some assert

            function Dog(){

            }
            Dog.prototype.shout = function(){
                console.log('woof!woof!');
                this.emit('shouted');
            }

            OneLib.EventEmitter.mixin(Dog);

            var called = false;
            var aDog = new Dog();
            var slotID = aDog.on('shouted',function(){
                called = true;
            })
            aDog.shout();
            expect(called).toEqual(true);
            expect(typeof slotID).toEqual("number");

    });
    it('should can use "mixin" in the constructor', function () {

        var called = false,slotID;
        function Dog(){
            OneLib.EventEmitter.mixin(Dog);
            slotID=this.on('shouted',function(){
                called = true;
            })
        }
        Dog.prototype.shout = function(){
            console.log('woof!woof!');
            this.emit('shouted');
        }


        var aDog = new Dog();
        aDog.shout();
        expect(called).toEqual(true);
        expect(typeof slotID).toEqual("number");

    });
    it('should can use "off" to delete callback', function () {
        //do some assert

            function Dog(){

            }
            Dog.prototype.shout = function(){
                console.log('woof!woof!');
                this.emit('shouted');
            }

            OneLib.EventEmitter.mixin(Dog);

            var called = false;
            var aDog = new Dog();
            function cb(){
                called = true;
            }
            aDog.on('shouted',cb);
            aDog.off('shouted',cb);
            aDog.shout();
            expect(called).toEqual(false);

    });
    it('should can use slotID to "off" callback', function () {

            function Dog(){

            }
            Dog.prototype.shout = function(){
                console.log('woof!woof!');
                this.emit('shouted');
            }

            OneLib.EventEmitter.mixin(Dog);

            var called = false;
            var aDog = new Dog();
            function cb(){
                called = true;
            }
            var slotID = aDog.on('shouted',cb);
            aDog.off('shouted',slotID);
            aDog.shout();
            expect(called).toEqual(false);
    });
    it('should can "off" all callback at one time', function () {

            function Dog(){

            }
            Dog.prototype.shout = function(){
                console.log('woof!woof!');
                this.emit('shouted');
            }

            OneLib.EventEmitter.mixin(Dog);

            var called1 = 0,called2 = 0;
            var aDog = new Dog();
            function cb1(){
                called1 ++;
            }
            function cb2(){
                called2 ++;
            }
            var slotID1 = aDog.on('shouted',cb1);
            var slotID2 = aDog.on('shouted',cb2);
            aDog.shout();
            expect(called1).toEqual(1);
            expect(called2).toEqual(1);

//            aDog.off('shouted',"all");
            aDog.off('shouted');
            aDog.shout();
            expect(called1).toEqual(1);
            expect(called2).toEqual(1);

    });

    it('should can use "once" to receive only one callback', function () {
        function Dog(){
        }
        Dog.prototype.shout = function(){
            console.log('woof!woof!');
            this.emit('shouted');
        }

        OneLib.EventEmitter.mixin(Dog);

        var calledTimes=0
        var aDog = new Dog();
        function cb(){
            calledTimes ++;
        }
        aDog.once('shouted',cb);
        aDog.shout();
        aDog.shout();
        aDog.shout();//shout 3 times
        expect(calledTimes).toEqual(1);

    });

    it('should can use "on+ttl" to set callback times', function () {
        function Dog(){
        }
        Dog.prototype.shout = function(){
            console.log('woof!woof!');
            this.emit('shouted');
        }

        OneLib.EventEmitter.mixin(Dog);

        var calledTimes= 0,
         calledTimes2=0;
        var aDog = new Dog();
        function cb(){
            calledTimes ++; //this callback should be called by <TTL> times
        }
        function cb2(){
            calledTimes2 ++;
        }
        aDog.on('shouted',cb,2);//set max callback times (TTL)
        aDog.on('shouted',cb2);//default no (TTL) limit
        aDog.shout();
        aDog.shout();
        aDog.shout();//shout 3 times
        expect(calledTimes).toEqual(2);
        expect(calledTimes2).toEqual(3);

    });


    it('should work with forloop+func scenario', function () {
        function Dog(){
        }
        Dog.prototype.shout = function(){
            this.emit('shouted');
        }

        OneLib.EventEmitter.mixin(Dog);

        var count= {
            calledTimes1: 0,
            calledTimes2: 0
        };
        var aDog = new Dog();

        for(var i=1;i<=2;i++){
            aDog.on('shouted',(function(it){
                return function(){
                    console.log("i="+it);
                    count["calledTimes"+ it.toString()]+=1;
                }
            })(i));
        }
        aDog.shout();
        aDog.shout();
        aDog.shout();//shout 3 times
        expect(count.calledTimes1).toEqual(3);
        expect(count.calledTimes2).toEqual(3);
    });


    it('should work with forloop+func scenario[2]', function () {
        function Dog(){
        }
        Dog.prototype.shout = function(){
            this.emit('shouted');
        }

        OneLib.EventEmitter.mixin(Dog);

        var count=0;
        var aDog = new Dog();

        for(var i=1;i<=2;i++){
            aDog.on('shouted',function(it){
                count++;
            },i*2);//use i as ttl. if success,the 1st callback._ttl should be 1*2,tne 2nd should be 2*2,so total limit 6 times
        }
        aDog.shout();
        aDog.shout();
        aDog.shout();//shout 3 times
        aDog.shout();//shout 4 times
        aDog.shout();//shout 5 times
        aDog.shout();//shout 6 times
        aDog.shout();//shout 7 times
        aDog.shout();//shout 8 times
        expect(count).toEqual(6);
    });

    it('should can use * to subscribe all events', function () {
        function Dog(){
            OneLib.EventEmitter.mixin(Dog);
        }
        Dog.prototype.shout = function(){
            this.emit('shouted',1,2);
        };
        Dog.prototype.cry = function(){
            this.emit('cry',3,4);
        };
        Dog.prototype.happy = function(){
            this.emit('happy',5,6);
        };

        var call={};//记录事件调用
        var aDog = new Dog();
        //use * to receive all event notification
        aDog.on("*",function(evtName,val1,val2){
            call[evtName]=(call[evtName]?call[evtName]:0)+(val1+val2);
        });
        aDog.shout();
        aDog.cry();
        aDog.happy();
        aDog.emit("*",7,8);//尝试发射 * 事件，这时，外部应该也只收到一次通知

        expect(call.shouted).toEqual(3);
        expect(call.cry).toEqual(7);
        expect(call.happy).toEqual(11);
        expect(call["*"]).toEqual(15);


    });
});