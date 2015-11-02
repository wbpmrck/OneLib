define('test', function (require, exports, module) {
    var Animation = require("OneLib.Animation");

    //这里创建了一个总时长3s的、delta函数为一个线性函数的、帧间隔50ms(fps约为20)的动画
    var a1 = Animation.createAnimation({
        duration: 3000,
        delta: function (progress) {
            return progress;
        },
        step: function (deltaProgress) {
            //make some change to animate objects here
        },
        delay: 20,
        totalFrame: 300
    });
});