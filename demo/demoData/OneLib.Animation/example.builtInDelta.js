define('test2', function (require, exports, module) {
    var Animation = require("OneLib.Animation");

    var linear = Animation.builtInDelta("linear");
    var linearEaseOut = Animation.builtInDelta("linear",null,"easeOut");
    var linearEaseInOut = Animation.builtInDelta("linear",null,"easeInOut");

    var a1 = Animation.createAnimation({
        duration: 3000,
        delta: linear, //这里也可以用:linearEaseOut/linearEaseInOut
        step: function (deltaProgress) {
            //make some change to animate objects here
        },
        delay: 20,
        totalFrame: 300
    });
});