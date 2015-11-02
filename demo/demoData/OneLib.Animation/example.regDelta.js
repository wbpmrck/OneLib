define('testRegDelta1', function (require, exports, module) {
    var Animation = require("OneLib.Animation");

    var linear = Animation.regDelta("linear", function (progress) {
        return progress; //这里注册了一个自己的线性delta函数
    });

    var a1 = Animation.createAnimation({
        duration: 3000,
        delta: Animation.builtInDelta("linear"), //这里使用的就是最新的
        step: function (deltaProgress) {
            //make some change to animate objects here
        },
        delay: 20,
        totalFrame: 300
    });
});