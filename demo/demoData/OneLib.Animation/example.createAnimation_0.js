define('test', function (require, exports, module) {
    var Animation = require("OneLib.Animation");

    //这里创建了一个总时长3s的、delta函数为一个线性函数的、帧间隔50ms(fps约为20)的动画
    var a1 = Animation.createAnimation(3000, function (progress) {
        return progress;
    }, function (deltaProgress) {
        //make some change to animate objects here
    },50);
});