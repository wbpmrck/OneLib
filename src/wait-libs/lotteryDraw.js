/**@alia lottery
 * Created by kaicui on 16/6/26.
 */
var
    event = require("OneLib.EventEmitter");

function Lottery() {
    var self = this;
    event.mixin(self);

    self.index = -1;
    self.rollItemId = undefined;
    self.distance = -1;//距离最终奖品剩余移动次数

    self.prices={};//奖品列表 ,key:itemId, value:[index] (1个奖品id,可能在转盘里对应有多个index)
    self.pricesList=[]; //奖品下标:id
    self.pricesData={};//奖品数据(纯粹查询使用):key:itemId, value:obj

    self.ing = false;//是否正在抽奖
    self.count=0;	//总共有多少个位置
    self.timer=0;	//setTimeout的ID，用clearTimeout清除
    self.speed=0;	//当前转动速度
    self.times=0;	//已经转动次数
    self.prizeId=undefined;	//中奖物品id
    self.prizeIndex=undefined;	//中奖物品的index

    //(答案出现之前的轮询速度)配置:配置不同转动圈数内,转动间隔
    self.rollSpeedConfig=[
        {timesFrom:0,timesTo:3,wait:300}, //固定300ms
        {timesFrom:4,timesTo:14,step:-20}, //step阶梯变化
        {timesFrom:15,timesTo:9999,step:-30}
    ];
    self.minRollWait = 40;//最少的等待间隔
    self.maxRollWait = 500;//最大的等待间隔

    //(答案出现之后的速度)配置:配置在指向目标位置过程中,转动间隔
    //这里最大的distanceFrom,决定了抽奖结果确定后,最少还需要执行的转动次数
    self.targetSpeedConfig=[
        {distanceFrom:30,distanceTo:15,step:5}, //step阶梯变化
        {distanceFrom:14,distanceTo:7,step:20}, //step阶梯变化
        {distanceFrom:7,distanceTo:0,step:50}
    ]
}
/**
 * 添加奖品条目
 * @param id:奖品在业务系统里的id
 * @param data:奖品数据,可不传
 */
Lottery.prototype.addPriceItem = function(id,data){

    this.pricesData[id] = data;

    var list = this.prices[id];
    if(!list){
        list = this.prices[id] =[];
    }
    list.push(this.count);
    this.pricesList.push(id);
    this.count++;
    return this.count-1;
}
/**
 * 停止抽奖,设置中奖物品编号
 * @param id:中奖id
 * @returns {boolean}:该奖品是否在奖池
 */
Lottery.prototype.setPriceItem = function(id){
    var self = this;
    this.prizeId=this.prices[id];

    if(this.prizeId){

        //从该奖品的下表列表中,随机取一个(因为界面上,任何一个中奖位置,代表的该奖品都是一样的)
        this.prizeIndex = this.prizeId[parseInt(Math.random()*10)%(this.prizeId.length)]

        //计算剩余移动次数
        //如果抽奖结果已经出现,则计算当前位置距离目标奖品位置的距离
        var targetIndex = self.prizeIndex,
            maxDis;

        //获取当前位置举例目标位置的一圈内距离
        var dis = self.index<targetIndex?(targetIndex - self.index):(  (self.count-self.index)+targetIndex );

        //获取配置的最小多转动的次数
        self.targetSpeedConfig.forEach(function (item,index) {
            if(maxDis===undefined){
                maxDis = item.distanceFrom;
            }else{
                maxDis = maxDis <item.distanceFrom?item.distanceFrom:maxDis;
            }
        })
        //如果距离不足 targetSpeedConfig里的最大的from+所有奖品数量的整数倍
        while(dis<maxDis){
            dis+=self.count; //多走一圈
        }
        self.distance = dis; //得到真实还需要走多少步

        return true;
    }else{
        return false;
    }

}

/**
 * 重新开始抽奖
 */
Lottery.prototype.start = function(){
    var self = this;

    if(self.ing){
        return;
    }else{
        self.ing = true;

        self.speed=0;	//当前转动速度
        self.rollItemId = undefined;
        self.distance = -1;//距离最终奖品剩余移动次数
        self.times=0;	//已经转动次数
        self.prizeId=undefined;	//中奖物品id
        self.prizeIndex=undefined;	//中奖物品的index

        self.roll();
    }

}
Lottery.prototype.clear = function(){
    var self = this;

        self.ing = false;

        self.speed=0;	//当前转动速度
        self.rollItemId = undefined;
        self.distance = -1;//距离最终奖品剩余移动次数
        self.times=0;	//已经转动次数
        self.prizeId=undefined;	//中奖物品id
        self.prizeIndex=undefined;	//中奖物品的index

        clearTimeout(self.timer);
        self.timer = undefined;
}

/**
 * 获取当前应该使用的转动速度
 */
Lottery.prototype.getCurrentSpeed = function(){
    var self = this;

    //获取当前速度
    var speed=self.speed;

    //如果当前抽奖结果没有出来,则使用配置的速度区间
    if(!self.prizeId){
        for(var i=0,j=self.rollSpeedConfig.length;i<j;i++){
            var conf = self.rollSpeedConfig[i];
            if(self.times<= conf.timesTo && self.times >= conf.timesFrom){
                speed = ( conf.wait===undefined?(self.speed+conf.step):conf.wait )
                break;
            }
        }

    }else{
        self.targetSpeedConfig=[
            {distanceFrom:30,distanceTo:15,step:5}, //step阶梯变化
            {distanceFrom:14,distanceTo:7,step:20}, //step阶梯变化
            {distanceFrom:7,distanceTo:0,step:50}
        ]

        //如果抽奖结果已经出现,则根据当前剩余步骤获取速度
        for(var i=0,j=self.targetSpeedConfig.length;i<j;i++){
            var conf = self.targetSpeedConfig[i];
            if(self.distance<= conf.distanceFrom && self.distance >= conf.distanceTo){
                speed = ( conf.wait===undefined?(self.speed+conf.step):conf.wait )
                break;
            }
        }
    }

    if(speed<self.minRollWait){
        speed = self.minRollWait;
    }
    if(speed>self.maxRollWait){
        speed = self.maxRollWait;
    }
    return speed;
}

/**
 * 处理滚动过程
 */
Lottery.prototype.roll = function () {
    var self = this;
    self.times++; //转动一次
    self.index = (self.index+1) % self.count;

    self.rollItemId = self.pricesList[self.index];

    self.emit("roll",self.index,self.pricesData[self.rollItemId]); //滚动事件

    //如果抽奖结果已经出现,则更新剩余滚动次数
    if(self.prizeId){
        self.distance--;
    }
    //决定当前速度
    self.speed = self.getCurrentSpeed();

    //如果还未结束
    if(!self.prizeId || self.distance !== 0){
        self.timer = setTimeout(function () {
            self.roll();
        },self.speed);
    }else{
        //已经结束
        clearTimeout(self.timer);
        self.timer = undefined;

        self.emit("end",self.index,self.pricesData[self.rollItemId]); //滚动事件
    }
}

exports.newLottery = function () {
    return new Lottery();
}