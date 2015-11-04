/**
 * 提供基础的动画框架
 *
 * ============================
 * Created by cuikai on 2015/10/28.
 */


/**
 * 播放动画
 * @param opts：选项：
 *  opts.delay:     Time between frames (in ms, 1/1000 of second). For example, 10ms
 *  opts.duration:  The full time the animation should take, in ms. For example, 1000ms
 *  opts.step:      The function, which actually does the job.
 It takes the result of delta and applies it.

 For the height example, there would be:
 function step(delta) {
                      elem.style.height = 100*delta + '%'
                    }

 *  opts.delta:     A function, which returns the current animation progress.
 For example, we are animating the height property from 0% to 100%.
 We could do it uniformly, so the progress maps to height linearly
 */

define('OneLib.Animation', ["OneLib.EventEmitter"], function (require, exports, module) {

    var event = require("OneLib.EventEmitter");
    var STATUS={
            STOP:0,
            RUNNING:1,
            PAUSED:2
        },
        DEFAULT_FRAME_SPAN=20;

//add bind to Function
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                            ? this
                            : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    function Animation(opts) {
        event.mixin(Animation);

        var self = this;//save the this ref

        self.startTime = self.endTime = undefined;
        self.lastPausedTime = undefined;
        self.totalPaused = 0;

        self.id = undefined;

        self.duration = opts.duration;
        self.delta = opts.delta;
        self.step = opts.step;
        self.delay = opts.delay;

        self.totalFrame = opts.totalFrame; //当前动画总帧数(可选)
        self.curFrame =0; //当前动画进行到第几帧
        self._frameCount = 0;//记录总共渲染了多少帧。这个字段主要用于统计技术指标：fps,而curFrame可能会被修改(跳帧)
        self.fps = 0;//帧率 frame per second

        self.status =STATUS.STOP

        self.speedMultiple = 1;//默认是1倍速进行 (暂时没用到,mileStone 1.1中使用)

    }

    /**
     * todo：mileStone 1.1
     * 修改速度。
     * 大于0相当于提速，小于0相当于减速
     * @param multiple：相对于原速度的倍数，值在0~无穷之间。比如0.5代表速度减为原来的50%
     * @returns {Animation}
     */
    Animation.prototype.changeSpeed = function(multiple){
        this.speedMultiple = multiple || 1;
        return this;
    }
    /**
     * todo：mileStone 1.1
     * 修改动画当前位置(实现直接跳至：“过去/未来”的“某一帧/某一动画时刻”)
     * @param durationOrCurFrame:该值根据动画的模式，代表不同含义。如果动画设置了duration,则这里应该传动画时间的ms.否则传帧数
     * @returns {Animation}
     */
    Animation.prototype.changeProgress = function(durationOrCurFrame){

        return this;
    }

    /**
     * 获取动画当前的帧率
     * @returns {number}
     */
    Animation.prototype.getFPS = function(){
        return this.fps;
    }
    Animation.prototype.setFPS = function(fps){
        var self = this;//save the this ref

        //保留2位小数
        fps = fps.toFixed(1);

        if(fps != self.fps){
            self.emit("fpsChange",self.fps,fps);//emit old and new fps
            self.fps = fps;
        }
        return this
    }

    /**
     * 动画实际执行体
     * 计算progress的时候，如果设定了duration,则根据时长计算，如果设定了totalFrame,则根据frame计算
     * @private
     */
    Animation.prototype._activateframe = function(){
        var self = this;//save the this ref

        self.curFrame++;//累加一帧
        self._frameCount++;//累加一帧
        var timePassed = new Date - self.startTime - self.totalPaused

        self.setFPS(self._frameCount / (timePassed/1000));

        var progress ;
        if(self.duration){
            progress = timePassed / self.duration
        }else if(self.totalFrame){
            progress = self.curFrame/ self.totalFrame
        }else{
            throw new Error("duration or totalFrame must be set!")
        }


        if (progress > 1) progress = 1

        var delta;
        if(self.delta){
            delta = self.delta(progress)//根据delta函数，得到步进数值
        }
        self.step(delta) //调用处理函数进行动画属性修改

        //动画执行完毕
        if (progress == 1) {
            self.emit("finish");
            self.stop();
        }
    }
    Animation.prototype.pause = function () {
        var self = this;//save the this ref

        //只有进行中的可以暂停
        if(self.status != STATUS.RUNNING){
            return;
        }

        self.status =STATUS.PAUSED;
        if(self.id){
            clearInterval(self.id);
        }
        //记录暂停时间
        self.lastPausedTime = new Date();
        self.emit("pause");
        return self;
    }
    Animation.prototype.resume = function () {
        var self = this;//save the this ref

        //只有暂停的可以继续
        if(self.status != STATUS.PAUSED){
            return;
        }

        //统计暂停了多久
        self.totalPaused += new Date() - self.lastPausedTime;

        self.status = STATUS.RUNNING;
        self.id = setInterval(self._activateframe.bind(self), self.delay || DEFAULT_FRAME_SPAN)
        self.emit("resume");
        return self;
    }
    Animation.prototype.stop = function () {
        var self = this;//save the this ref

        //只有播放或暂停状态可以STOP
        if(self.status == STATUS.STOP){
            return;
        }

        self.startTime= self.endTime = self.lastPausedTime=undefined;
        self.totalPaused = 0;
        self.curFrame =self._frameCount =  0;
        self.setFPS(0);
        self.status = STATUS.STOP;
        if(self.id){
            clearInterval(self.id);
        }
        self.emit("stop");
        return self;
    }
    /**
     * 重新开始一次全新的播放
     */
    Animation.prototype.restart = function () {
        var self = this;//save the this ref

        if(self.status != STATUS.STOP){
            //先全部停止
            self.stop();
        }

        //开始新的动画周期
        self.startTime = new Date();
        self.curFrame =self._frameCount = 0;
        self.setFPS(0);
        self.status = STATUS.RUNNING;
        self.id = setInterval(self._activateframe.bind(self), self.delay || DEFAULT_FRAME_SPAN)
        self.emit("start");
        return self;
    }

    /**
     * 这是一个广义的播放功能，他会检查当前播放状态，如果是暂停，则resume,如果是停止，则start
     */
    Animation.prototype.play = function () {
        var self = this;//save the this ref

        //已经在播放了，就不重复播放了
        if(self.status == STATUS.RUNNING){
            return self;
        }else if(self.status == STATUS.STOP){
            self.restart();
            return self;
        }else{
            self.resume();
            return self;
        }
    }

//这个函数负责根据delta函数,生成对应于delta的easOut函数
    function _makeEaseOut(delta) {
        //如果函数只接收一个参数(只能是progress)
        if(delta&&delta.length<=1){
            return function(progress) {
                return 1 - delta(1 - progress)
            }
        }else{
            //如果接受多个参数，需要对额外参数进行代理
            return function(){
                var args = Array.prototype.slice.call(arguments);
                //修改progress(默认最后一个参数是progress参数)
                args[args.length-1] = 1-args[args.length-1];
                return 1-delta.apply(this,args);
            }
        }
    }
//这个函数负责根据delta函数,生成对应于delta的easInOut函数
    function _makeEaseInOut(delta) {
        //如果函数只接收一个参数(只能是progress)
        if(delta&&delta.length<=1) {
            return function (progress) {
                if (progress < .5)
                    return delta(2 * progress) / 2
                else
                    return (2 - delta(2 * (1 - progress))) / 2
            }
        }else{
            //如果接受多个参数，需要对额外参数进行代理
            return function(){
                var args = Array.prototype.slice.call(arguments);
                //progress(默认最后一个参数是progress参数)
                var progress = args[args.length-1];

                if (progress < .5){
                    args[args.length-1] = progress*2;
                    return delta.apply(this,args) / 2;
                }else{
                    args[args.length-1] = 2 * (1 -progress);
                    return (2 - delta.apply(this,args)) / 2
                }
            }
        }
    }


//内置一些常用的动画函数
    var _builtInDeltas={
        linear:function(progress) {
            return progress
        },
        quad2:function (progress) {
            return Math.pow(progress, 2)
        },
        quad5:function (progress) {
            return Math.pow(progress, 5)
        },
        circle:function (progress) {
            return 1 - Math.sin(Math.acos(progress))
        },
        bow:function (x,progress) {
            return Math.pow(progress, 2) * ((x + 1) * progress - x)
        },
        bounce:function(progress) {
            for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                if (progress >= (7 - 4 * a) / 11) {
                    return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2)
                }
            }
        },
        elastic:function(x,progress) {
            return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress)
        }
    }


    /**
     * 注册一个delta函数到Animation模块里。
     * 注册后的函数可以通过builtInDelta函数获取
     * @param name：注册函数名
     * @param fn：注册函数:function(progress,curFrame,totalFrame) => float (0~1) ，
     *  该函数可以使用progress来计算，
     *  也可以使用curFrame和totalFrame来计算，
     *  返回1个0~1的新progress
     */
    exports.regDelta = function (name,fn) {
        _builtInDeltas[name] = fn
        return this;
    }
    /**
     * 获取内置的 Delta 函数
     * @param deltaName
     * @param paramArr:可选：表示给delta函数输入的额外的参数
     * @param mode:可选：easeIn,easeOut,easeInOut
     */
    exports.builtInDelta = function (deltaName,paramArr,mode) {
        var _d = _builtInDeltas[deltaName];
        var _rawD=_d;

        if(_d){
            if(mode=='easeOut'){
                _d = _makeEaseOut(_d);
            }else if(mode=='easeInOut'){
                _d = _makeEaseInOut(_d);
            }
            //如果外部对delta函数有额外的参数，则对函数进行代理
            //2015-11-04：增加判断，如果delta函数本身定义了超过1个的参数，才允许注入参数，并且最多只能注入length-1个
            if(paramArr&&paramArr.length>0&&_rawD.length>1)
            {

                //2015-11-04：判断注入个数不能超过length-1(因为要给progress留一个位置)
                if (paramArr.length > _rawD.length - 1) {
                    paramArr.splice(paramArr.length - (paramArr.length - _rawD.length + 1))
                }

                //如果截取过后还有参数要传的话，则封装
                if (paramArr.length > 0) {
                    paramArr.unshift(this);
                    _d = _d.bind.apply(_d, paramArr);
                }
                //var _old = _d;
                //_d = function (progress) {
                //    var copyParam = paramArr.slice();
                //    copyParam.unshift(progress);
                //    _old.apply(this,copyParam);
                //}
            }
            return _d;
        }
    }
    /**
     * 创建一个动画
     * 动画可以指定时长，也可以指定帧数。2者有任何一个到达，则表示动画结束
     * @param duration:如果duration是object,那么当作用户传入了一个opts对象
     * @param delta
     * @param step
     * @param delay
     * @param totalFrame:动画总共多少帧
     */
    exports.createAnimation = function (duration/* opts*/, delta, step, delay,totalFrame) {
        if(typeof duration =='object'){
            return new Animation(duration)
        }else{
            return new Animation({
                duration:duration,
                delta:delta,
                step:step,
                delay:delay,
                totalFrame:totalFrame
            })
        }
    }
});
