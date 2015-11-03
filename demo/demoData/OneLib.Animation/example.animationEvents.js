define('animationEvents', function (require, exports, module) {
    var Animation = require("OneLib.Animation"),
        $ = require("$"),
        ko = require("ko");

    function ViewModel(){
        var self = this;
        self.events= ko.observableArray([]);
        self.fps = ko.observable(0);
    }
    ViewModel.prototype.addEvent = function(name,param1,param2){
        var self = this;//save the this ref
        var ts = new Date();
        self.events.push({name:ts.toLocaleTimeString()+'-'+name,param:param1!==undefined?(param1+'->'+param2):""});

        if(self.events().length>10){
            self.events.splice(0,1);
        }
    };

    var vm  = new ViewModel();
    ko.applyBindings(vm,document.getElementById("c_animationEvents"));

    var a = Animation.createAnimation({
        //duration:5*1000,
        delta:Animation.builtInDelta("bounce",null,"easeOut"),
        step: function (delta) {
            var to = 500;
            $("#block2").css("left",to*delta + "px")
        },
        delay:50,//20 fps to see event clearly
        totalFrame:100
    });

    //订阅所有事件，并打印出来
    a.on("*", function (evtName,p1,p2) {
        vm.addEvent(evtName,p1,p2)
    });
    //按照事件名称订阅
    a.on("stop", function () {
        alert("animation stoped!");
    })
    a.on("fpsChange", function (old,newVal) {
        vm.fps(newVal);
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