define('example.builtInDeltaAll', function (require, exports, module) {

    var ko = require("ko"),
        Animation = require("OneLib.Animation"),
        raphael = require("raphael");

    function getDelta(name,params,mode){
        return {
            name:name,
            fn:Animation.builtInDelta(name,params,mode)
        }
    }

    function Point(t,x,y){
        this.t = t;
        this.x = x;
        this.y = y;
    }
    Point.prototype.toString = function () {
        return [this.t,this.x+','+this.y].join('');
    }
    //一个简易的SVG path string生成类
    function Path(){
        var self = this;//save the this ref

        self.points =[];
    }
    Path.prototype.moveTo = function (x, y) {
        var self = this;//save the this ref
        self.points.push(new Point('M',x,y));
        return self;
    }
    Path.prototype.lineTo = function (x, y) {
        var self = this;//save the this ref
        self.points.push(new Point('L',x,y));
        return self;
    }
    Path.prototype.resolve = function () {
        var self = this;//save the this ref

        var str =[];
        for(var i=0,j=self.points.length;i<j;i++){
            var p = self.points[i];
            str.push(p.toString());
        }
        return str.join('');
    }

    function ViewModel(){
        var self = this;

        self.builtInDeltas = ko.observableArray([
            getDelta("linear"),
            getDelta("quad2"),
            getDelta("quad5"),
            getDelta("circle"),
            getDelta("bow"),
            getDelta("bounce"),
            getDelta("elastic")
        ]);
        self.selectedDelta = ko.observable();//选择的delta函数

        self.modes = ko.observableArray(["easeIn","easeOut","easeInOut"]);
        self.selectedMode = ko.observable("easeIn");//选择的mode

        self.params = ko.observable("");//额外的参数(用,隔开多个参数。比如1,2,3)

        self.finalFnString = ko.observable('');//最终正在绘制的图形函数的toString

        self.paper = undefined;
        self.canvasWidth = 320;
        self.canvasHeight = 320;

        self.selectedDelta.subscribe(function (newVal) {
           self.startPaint();
        });
        self.selectedMode.subscribe(function (newVal) {
           self.startPaint();
        });
        self.params.subscribe(function (newVal) {
           self.startPaint();
        });
    }

    /**
     * 让viewModel回到初始化状态
     */
    ViewModel.prototype.init = function(){
        var self = this;//save the this ref
        if(self.paper){
            self.paper.clear();
        }else{
            self.paper = raphael(document.getElementById("canvas"), self.canvasWidth, self.canvasHeight);
        }
    };
    /**
     * 准备好坐标系
     */
    ViewModel.prototype.prepare = function() {
        var self = this;//save the this ref

        var ctx = self.paper;


        // zero point is 20px from left, middle vertically
        // max is distance to 1 from zero.
        var zeroX = 20, zeroY = self.canvasHeight/2
        var max = self.canvasWidth-zeroX-7

        ctx.lineWidth   = 1

        var style1={
            font :'normal 14px sans-serif',
            stoke:'#000'
        };

        ctx.text(zeroX-15, zeroY+5,'0').attr(style1);
        ctx.text(zeroX+max, zeroY+5,'1').attr(style1);
        ctx.text(zeroX-15, zeroY*2-8,'-1').attr(style1);
        ctx.text(zeroX-15, 15,'1').attr(style1);

        var style1={
            font :'normal 14px sans-serif',
            stoke:'#808080'
        };

        // arrow right
        var pathArrow = new Path();

        pathArrow.moveTo(zeroX, zeroY)
        pathArrow.lineTo(zeroX+max, zeroY)
        pathArrow.lineTo(zeroX+max-5, zeroY-5)
        pathArrow.moveTo(zeroX+max, zeroY)
        pathArrow.lineTo(zeroX+max-5, zeroY+5)

        // arrow up
        pathArrow.moveTo(zeroX, zeroY)
        pathArrow.lineTo(zeroX, zeroY-max)
        pathArrow.lineTo(zeroX+5, zeroY-max+5)
        pathArrow.moveTo(zeroX, zeroY-max)
        pathArrow.lineTo(zeroX-5, zeroY-max+5)

        // arrow down
        pathArrow.moveTo(zeroX, zeroY)
        pathArrow.lineTo(zeroX, zeroY+max)
        pathArrow.lineTo(zeroX+5, zeroY+max-5)
        pathArrow.moveTo(zeroX, zeroY+max)
        pathArrow.lineTo(zeroX-5, zeroY+max-5)

        //paint
        var pth = pathArrow.resolve();
        ctx.path(pth);
    }

    /**
     * 根据选择的delta,mode,和params,绘制图形
     */
    ViewModel.prototype.startPaint = function(){
        var self = this;//save the this ref

        self.init();
        self.prepare();

        var ctx = self.paper;

        var zeroX = 20, zeroY = self.canvasHeight/2
        var max = self.canvasWidth-zeroX-7


        var style={
            'stroke-width' :2
        };

        var pth = new Path();
        pth.moveTo(zeroX,zeroY);
        var  f= Animation.builtInDelta(self.selectedDelta().name,self.params(),self.selectedMode());
        self.finalFnString(f.toString());
        //console.log("height=%d, width=%d", height, width)
        for(var x=0; x<=max; x++) {
            var y = f(x/max)*max
            //console.log("x=%d, f(%d)=%d", x, x/width, f(x/width))
            pth.lineTo(x+zeroX, self.canvasHeight-y-zeroY);
            pth.moveTo(x+zeroX, self.canvasHeight-y-zeroY);
            //ctx[x ? 'lineTo' : 'moveTo'](x+zeroX, canvas.offsetHeight-y-zeroY)
        }
        ctx.path(pth.resolve()).attr(style);
        //ctx.stroke()
    };

    var vm = exports.vm = new ViewModel();

    ko.applyBindings(vm,document.getElementById("builtInDeltaAll"));

    vm.startPaint();
});