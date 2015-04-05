describe('OneLib.Inherit ', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can work well from the users sight', function () {
        define('test1', ['OneLib.Inherit'], function (require, exports, module) {
            var Inherit = require('OneLib.Inherit');

            function Animal(){
                var self = this;
                self.isAnimal = true;
            }
            Animal.prototype.makeSound = function(){
                return "i am animal";
            };
            Animal.prototype.die = function(){
                return "i was dead";
            };

            function Dog(){
                var self = this;//save the this ref
                self.isDog = true;
            }

            //notice:use return value to overwrite Dog
            //and this call MUST before method define(like makeSound in Dog)
            Dog=Inherit.inherit(Dog,Animal);
            Dog.prototype.makeSound = function(){
                return "woof!"
            }


            var tom = new Dog();

            expect(tom instanceof Dog).toBe(true);
            expect(tom.isAnimal).toBe(true);
            expect(tom.isDog).toBe(true);


            expect(tom.makeSound).toBeDefined();
            expect(tom.makeSound()).toBe("woof!");

            expect(tom.die).toBeDefined();
            expect(tom.die()).toBe("i was dead");

            expect(Inherit.getSupper(Dog)).toBe(Animal.prototype);

        });
    });
});