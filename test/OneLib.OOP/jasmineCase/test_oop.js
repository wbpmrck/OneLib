describe('OneLib.OOP ', function () {
    beforeEach(function () {
        //run before each test
    });

    afterEach(function () {
        //run after each test
    });

    it('should can define a class', function () {
        define('test1', ['OneLib.OOP'], function (require, exports, module) {
            var OOP = require('OneLib.OOP');

            var Animal = OOP.defineClass({
                constructor:function(name){
                    var self = this;
                    self.name = name;
                    self.isAnimal = true;
                },
                prototype:{
                    makeSound : function(){
                        return "i am animal";
                    },
                    die : function(){
                        return "i was dead";
                    }
                }
            });
            var aAnimal = new Animal();
            expect(aAnimal instanceof Animal).toBe(true);
            expect(aAnimal.makeSound()).toEqual("i am animal");
            expect(aAnimal.die()).toEqual("i was dead");

            var Dog = OOP.defineClass({
                constructor:function(name,dogType){
                    var self = this;//save the this ref
                    self.isDog = true;
                    self.dogType = dogType;
                },
                prototype:{
                    makeSound : function(){
                        return "woof!"
                    }
                },
                super:Animal
            })

            var tom = new Dog("tom","big dog");

            expect(tom instanceof Dog).toBe(true);
            expect(tom.isAnimal).toBe(true);
            expect(tom.isDog).toBe(true);

            expect(tom.name).toBe("tom");
            expect(tom.dogType).toBe("big dog");


            expect(tom.makeSound).toBeDefined();
            expect(tom.makeSound()).toBe("woof!");

            expect(tom.die).toBeDefined();
            expect(tom.die()).toBe("i was dead");

            expect(OOP.getSupper(Dog)).toBe(Animal.prototype);
            expect(OOP.getSupper(tom)).toBe(Animal.prototype);
        });
    });
});