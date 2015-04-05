describe('EventEmitter ', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can use "mixin" to mix the prototype to other class', function () {
        define('testEmitter1', ['OneLib.EventEmitter'], function (require, exports, module) {
            var EventEmitter = require('OneLib.EventEmitter');

            function Dog(){

            }
            Dog.prototype.shout = function(){
                console.log('woof!woof!');
            }

            EventEmitter.mixin(Dog);

            expect(Dog.prototype.emit).toBeDefined();
            expect(Dog.prototype.on).toBeDefined();
            expect(Dog.prototype.off).toBeDefined();

        });
    });
    it('should can use "emit" to fire events,and use "on" to set callback', function () {
        //do some assert
        define('testEmitter2', ['OneLib.EventEmitter'], function (require, exports, module) {
            var EventEmitter = require('OneLib.EventEmitter');

            function Dog(){

            }
            Dog.prototype.shout = function(){
                console.log('woof!woof!');
                this.emit('shouted');
            }

            EventEmitter.mixin(Dog);

            var called = false;
            var aDog = new Dog();
            var slotID = aDog.on('shouted',function(){
                called = true;
            })
            aDog.shout();
            expect(called).toEqual(true);
            expect(typeof slotID).toEqual("number");

        });
    });
    it('should can use "off" to delete callback', function () {
        //do some assert
        define('testEmitter3', ['OneLib.EventEmitter'], function (require, exports, module) {
            var EventEmitter = require('OneLib.EventEmitter');

            function Dog(){

            }
            Dog.prototype.shout = function(){
                console.log('woof!woof!');
                this.emit('shouted');
            }

            EventEmitter.mixin(Dog);

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
    });
    it('should can use slotID to "off" callback', function () {
        //do some assert
        define('testEmitter4', ['OneLib.EventEmitter'], function (require, exports, module) {
            var EventEmitter = require('OneLib.EventEmitter');

            function Dog(){

            }
            Dog.prototype.shout = function(){
                console.log('woof!woof!');
                this.emit('shouted');
            }

            EventEmitter.mixin(Dog);

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
    });
    it('should can "off" all callback at one time', function () {
        //do some assert
        define('testEmitter5', ['OneLib.EventEmitter'], function (require, exports, module) {
            var EventEmitter = require('OneLib.EventEmitter');

            function Dog(){

            }
            Dog.prototype.shout = function(){
                console.log('woof!woof!');
                this.emit('shouted');
            }

            EventEmitter.mixin(Dog);

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
    });
});