define('controlAnimation', function (require, exports, module) {
    var Animation = require("OneLib.Animation"),
        $ = require("$");


    var a = Animation.createAnimation({
        duration:5*1000,
        delta:Animation.builtInDelta("bounce",null,"easeOut"),
        step: function (delta) {
            var to = 500;
            $("#block").css("left",to*delta + "px")
        },
        delay:40//25 fps
    })

    exports.play = function () {
        a.play();
    };
        exports.pause = function () {
        a.pause();
    };
    exports.resume = function () {
        a.resume();
    };
    exports.stop = function () {
        a.stop();
    };
    exports.restart = function () {
        a.restart();
    };

});