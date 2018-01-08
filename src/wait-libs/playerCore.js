/**
 * Created by cuikai on 2015/9/22.
 * @alia playerCore
 * 功能：播放器内核，用于控制播放过程，提供事件通知。具体业务无关
 */



//获取soundManager2对象
var SM2 = require("SM2");
var log = require("../libs/onelib/OneLib.Log.js");
var event = require("OneLib.EventEmitter");

//开启日志
var logger = new OneLib.Log.Logger(true);

var allEvents=[
    "onbufferchange",
    "onfinish",
    "onload",
    "onpause",
    "onplay",
    "onresume",
    "onsuspend",
    "onstop",
    "whileloading",
    "whileplaying"
];

//定义状态字段(局部变量混淆时会缩短，减少成本)
var
    STATUS_STOP = 'stop',
    STATUS_PAUSE = 'pause',
    STATUS_PLAYING = 'playing',
    STATUS_BUFFERING = 'buffering'
    ;
/**
 * 播放条目构造函数
 * 表示一个播放的条目，一首歌。
 * 一个player里面，可以含有多个playItem
 *
 * 注意：
 * 1、playItem是和外部沟通最多的部分，因为在大多数业务场景下，条目的展现和控制是定制的。
 * 2、playItem提供很多外部可以获知状态的接口和事件
 * 3、业务场景下，应该多利用playItem的事件来做展示
 * 4、对playItem的控制，比如点击、播放、暂停等，应该调用Player的接口而不是Item的，因为，在一个场景下播放一个资源，往往和你的播放模式有关。
 * @constructor
 */
function PlayItem(name,url,sm2SongObj){
    var self = this;

    event.mixin(self);//注入事件通知能力


    self.name = name;
    self.url = url;
    self.status = STATUS_STOP;
    var sm2 = self.sm2SongObj = sm2SongObj;//soundManager2 里的songObject,用于实际的播放控制

    //songObj在创建的时候，已经被代理了事件通知，所以通过on可以订阅到事件
    //状态跟踪1：通过soundManager2内部的状态通知更新状态
    sm2.on("onplay",function () {
        //onplay表示有play方法被调用，这时候设置状态为缓冲中
        self.refreshStatus(STATUS_BUFFERING);
    });
    sm2.on("whileplaying",function () {
        self.refreshStatus(STATUS_PLAYING);
    });
    sm2.on("onpause",function () {
        self.refreshStatus(STATUS_PAUSE);
    });
    sm2.on("onstop",function () {
        self.refreshStatus(STATUS_STOP);
    });
    sm2.on("onfinish",function () {
        self.refreshStatus(STATUS_STOP);
    });
    sm2.on("onbufferchange",function () {
        if(sm2.isBuffering){
            self.refreshStatus(STATUS_BUFFERING);
        }
    });


    self.checkBufferedTimer = null;//一个定时器，用于检测播放item的loading状态
    self.delayTimer = null;//一个定时器，用于控制检测逻辑的延迟开启
}
/**
 * 停止播放这个item
 */
PlayItem.prototype.stop = function(){
    var self = this;//save the this ref
    self.sm2SongObj.stop();
    self.refreshStatus(STATUS_STOP);
};
PlayItem.prototype.play = function(){
    var self = this;//save the this ref
    self.sm2SongObj.play();
    //每次播放的时候，更新状态为缓冲中
    self.refreshStatus(STATUS_BUFFERING);
};
PlayItem.prototype.pause = function(){
    var self = this;//save the this ref
    self.sm2SongObj.pause();
    self.refreshStatus(STATUS_PAUSE);
};
PlayItem.prototype.togglePause = function(){
    var self = this;//save the this ref

    //对于togglePause的情况，依赖soundManager2的事件回调
    self.sm2SongObj.togglePause();
};
/**
 * 负责更新当前状态
 */
PlayItem.prototype.refreshStatus = function(newStatus){
    var self = this;//save the this ref
    if(newStatus != self.status){
        if(newStatus == STATUS_PAUSE || newStatus == STATUS_STOP){
            //如果当前是想关闭播放，则停止检测
            self.disableBuffChecking();
        }else if(newStatus == STATUS_PLAYING){
            //如果当前播放器状态切换为播放中，则表示播放器内部认为当前正播放，为了避免check过程中的数据干扰状态显示：
            //延迟500ms进行播放检测
            self.disableBuffChecking();
            self.activateBuffChecking(500);
        }
        else{
            //如果是缓冲状态，则直接开始缓冲检测
            self.activateBuffChecking();
        }
        //向外部转发事件:状态变化(老状态，新状态)
        self.emit("statusChange",self.status,newStatus);
        self.status = newStatus;
    }
};


/**
 * 取消缓冲检测
 */
PlayItem.prototype.disableBuffChecking = function(){
    var self = this;//save the this ref
    if(self.checkBufferedTimer){
        clearInterval(self.checkBufferedTimer);
        self.checkBufferedTimer = null;
    }
    if(self.delayTimer){
        clearTimeout(self.delayTimer);
        self.delayTimer = null;
    }
}
/**
 * 开启缓冲检测
 * @param delay:是否延迟一定时间再开始检测
 */
PlayItem.prototype.activateBuffChecking = function(delay){
    var self = this;//save the this ref

    var lastPosition=  self.sm2SongObj.position;

    function _start(){
        if(!self.checkBufferedTimer){
            self.checkBufferedTimer = setInterval(function () {
                var currentPos = self.sm2SongObj.position;
                //计时器1000ms计算一次，所以下一次播放进度应该比上一次有所提前
                if(currentPos<lastPosition+20){
                    self.refreshStatus(STATUS_BUFFERING)
                }
                lastPosition = currentPos;
            },1100);//由于soundManager获取当前position的精度不是很高，所以500ms检测一次
        }
    }

    //如果要延迟开启
    if(delay){
        if(self.delayTimer){
            clearTimeout(self.delayTimer);
            self.delayTimer = null;
        }

        self.delayTimer = setTimeout(_start,delay);
    }else{
        _start();
    }

}






/**
 * 播放器
 *
 * todo:注意，目前Player只支持单个播放，也就是说，一个Player管理一组Item,这些Item必须同时只有一个处于播放状态
 * @constructor
 */
function Player(){
    var self = this;//save the this ref
    event.mixin(self);//注入事件通知能力

    self.itemList = [];//存放播放的音频对象列表[PlayItem]
    self.itemDic = {};//存放播放的音频对象.key:url  value:
    self.currentPlayingItem = undefined;
}
/**
 * 立刻停止正在播放的歌曲
 */
Player.prototype.stop = function(){
    var self = this;//save the this ref

    if(self.currentPlayingItem){
        self.currentPlayingItem.stop();
        self.currentPlayingItem = undefined;
    }
}
/**
 * 立刻暂停正在播放的歌曲
 */
Player.prototype.pause = function(){
    var self = this;//save the this ref

    if(self.currentPlayingItem){
        self.currentPlayingItem.pause();
    }
}

/**
 * 暂停或播放一个音乐项
 * 使用场景：大部分音乐播放的逻辑，反复点击一个项，可以在播放、暂停状态之间切换
 * @param item
 */
Player.prototype.togglePlayItem = function(item){
    var self = this;//save the this ref

    //先停止当前正在播放的音乐
    if(self.currentPlayingItem){
        if(self.currentPlayingItem === item){
            self.currentPlayingItem.togglePause();
        }else{
            self.currentPlayingItem.stop();
            //播放目标音乐
            item && item.play();
        }
    }else{
        //播放目标音乐
        item && item.play();
    }
    //重新设置当前播放音乐
    self.currentPlayingItem  = item;
}
/**
 * 不管当前item是什么状态，强行播放他
 * @param item
 */
Player.prototype.playItem = function(item){
    var self = this;//save the this ref

    //先停止当前正在播放的非目标音乐
    if(self.currentPlayingItem){
        if(self.currentPlayingItem !== item){
            self.currentPlayingItem.stop();
            //播放目标音乐
            item && item.play();
        }else{
            if(item.status !== STATUS_PLAYING){
                item.play();
            }
        }
    }else{
        //播放目标音乐
        item && item.play();
    }
    //重新设置当前播放音乐
    self.currentPlayingItem  = item;
}
/**
 * 直接播放url.
 * 如果该url不在播放器之前的播放记录中，则把url加入播放列表，成为一个item
 * @param url
 */
Player.prototype.togglePlayUrl = function(url){
    var self = this;//save the this ref
    var item;
    if(self.itemDic.hasOwnProperty[url]) {
        item = self.itemDic[url];
    }else{
        item = self.createPlayItem(url);
    }
    self.togglePlayItem(item);
};

//清空所有item
Player.prototype.removeAllItems = function () {
    var self = this;//save the this ref

    self.itemDic={};

    for(var i=0,j=self.itemList.length;i<j;i++){
        var _item = self.itemList[i];
        _item.stop();
    }
    self.currentPlayingItem = undefined;
    self.itemList =[];
}
//删除item
Player.prototype.removeItem = function (item) {
    var self = this;//save the this ref

    if(!item){
        return;
    }
    if(self.currentPlayingItem === item){
        item.stop();
        self.currentPlayingItem = null;
    }
    delete self.itemDic[item.url]


    for(var i=0,j=self.itemList.length;i<j;i++){
        var _item = self.itemList[i];
        if(_item === item){
            self.itemList.splice(i,1)
            break;
        }
    }
    return self
}

/**
 * 创建一首新歌
 * @param url
 * @return SM2 sound object
 */
Player.prototype.createPlayItem = function (name,url,isAutoLoad,isAutoPlay) {
    var self = this;//save the this ref
    if(self.itemDic.hasOwnProperty[url]){
        return self.itemDic[url];
    }else{
        //创建新的sound object
        var soundOption ={
            multiShotEvents: true,
            multiShot: false,
            autoLoad: !!isAutoLoad,        // enable automatic loading (otherwise .load() will call with .play())
            autoPlay: !!isAutoPlay,        // enable playing of file ASAP (much faster if "stream" is true)
            //id: id,
            url: url
        };
        for(var i=0;i<allEvents.length;i++){
            soundOption[allEvents[i]] = (function(ename){
                return function(){
                    this.emit.apply(this,[ename].concat([].slice.call(arguments)));
                }
            })(allEvents[i])
        }

        var sound = SM2.soundManager.createSound(soundOption);
        event.mixin(sound);//注入事件通知能力给soundManager对象
        var item = self.itemDic[url] = new PlayItem(name,url,sound);
        self.itemList.push(item);
        return item;
    }
};


//存储在初始化完成后，要调用的回调
var _afterInitCb = [],
    _inited = false,//sm2有没有初始化过
    _isIniting = false;

/**
 * 初始化SM2
 * @param flashPath
 * @cb 创建成功的回调
 */
exports.init = function(cb){
    //如果正在初始化，则回调入队列，返回
    if(_isIniting){
        _afterInitCb.push(cb);
        return;
    }else if(_inited){
        //如果已经初始化完了
        cb && cb();
    }else{
        _isIniting = true;
        _afterInitCb.push(cb);
        var flashDirPath = __uri('../libs/soundmanager/swf/soundmanager2.swf');
        flashDirPath = flashDirPath.split('/');
        flashDirPath.splice(-1);
        var flashPath = flashDirPath.join('/');
        SM2.soundManager.setup({
            onready: function() {
                logger.writeLine("init success!");

                _isIniting = false;
                _inited = true;
                for(var i=0,j=_afterInitCb.length;i<j;i++){
                    var callbacks = _afterInitCb[i];
                    callbacks && callbacks()
                }
            },
            // where to find the SWF files, if needed
            url: flashPath, // 比如  '/soundmanager/swf/'
        });
    }
};

/**
 * 创建一个播放器。
 * 如果当前sm2还没有初始化，则初始化并创建一个播放器
 * @returns {Player}
 */
exports.newPlayer = function (cb) {
    if(_inited){
        cb(new Player());
    }else{
        exports.init(function () {
            cb(new Player());
        })
    }
}


//add by kaicui 20160524 添加多个播放组管理器
//PS:一个Player可以理解为一个互斥播放的group.


/**
 * 判断1个参数是否undefined/null/空字符串
 * @param str
 * @private
 */
function _isEmptyOrNull(str){
    return str=== undefined || str === null || ( typeof str =="string" && str.trim() =="")

}
/**
 * 播放器组管理器
 * @constructor
 */
function PlayerGroupManager() {
    var self = this;

    event.mixin(self);

    self.defaultGroupKey = "__default__"; //如果用户创建播放条目不指定group,那么就放在这个key存放的默认Player内
    self.groups ={}; //key:groupId,value: {Player}
    self.itemDic ={}; //key: itemId,value:{PlayItem}

}
/**
 * 初始化播放器组管理器
 * @param cb:成功回调
 */
PlayerGroupManager.prototype.init = function (cb) {
    var self = this;

    self.initTimeout = setTimeout(function () {
        cb && cb(false)
        self.emit("initFailed")
    },15*1000); //15s 的初始化超时时间

    //创建默认播放组
    if(!self.groups[self.defaultGroupKey]){
        //还未初始化默认Player,则创建
        exports.newPlayer(function (player) {
            self.groups[self.defaultGroupKey] = player;

            clearTimeout(self.initTimeout);
            self.initTimeout = undefined;

            cb && cb(true);
            self.emit("initSuccess"); //触发事件
        });
    }else{
        cb && cb(true);
        //如果已经有默认player了,这说明之前就初始化好了,直接发射事件
        self.emit("initSuccess"); //触发事件
    }
}

PlayerGroupManager.prototype.getPlayItem  = function(id){
    return this.itemDic[id];
}
PlayerGroupManager.prototype.addPlayItem = function (id,name,data,groupId,audioUrl,autoLoad,autoPlay) {
    var self = this;

    groupId = _isEmptyOrNull(groupId)? self.defaultGroupKey:groupId;

    //id不能重
    if(self.itemDic.hasOwnProperty(id)){
       return ;
    }

    //首先看希望加入的组是否已经存在
    var g = self.groups[groupId];
    if(!g){
        g= self.groups[groupId] = new Player();
    }
    var item = g.createPlayItem(name,audioUrl,autoLoad,autoPlay);

    //todo:下面几个属性当初写item的时候没有预留,为了避免对原代码的影响,这里直接插入,以后再统一重构
    item._id = id;
    item._data = data;
    item._groupId = groupId;

    self.itemDic[id] = item;

    //订阅item的事件,做一次代理分发
    item.on("statusChange",function (nowStatus, preStatus) {
        self.emit("statusChange",item._groupId,item._id,item._data,nowStatus, preStatus,item);
    });
    return item;
};

/**
 * 停止所有组的播放
 */
PlayerGroupManager.prototype.stopAll = function () {
    for(var  id in this.groups){
        this.groups[id].stop();
    };
}

/**
 * 停止某一组的播放
 * @param groupId:指定某一组
 */
PlayerGroupManager.prototype.stopGroup = function (groupId) {
    var group = this.groups[groupId];

    group && group.stop();

}

/**
 * 停止某一个条目的播放
 * @param itemId
 */
PlayerGroupManager.prototype.stopItem = function (itemId) {
    var item = this.itemDic[itemId];

    item && item.stop();
}

/**
 * 暂停所有组的播放
 */
PlayerGroupManager.prototype.pauseAll = function () {
    for(var  id in this.groups){
        this.groups[id].pause();
    };
}

/**
 * 暂停某一组的播放
 * @param groupId:指定某一组
 */
PlayerGroupManager.prototype.pauseGroup = function (groupId) {
    var group = this.groups[groupId];

    group && group.pause();

}

/**
 * 暂停某一个条目的播放
 * @param itemId
 */
PlayerGroupManager.prototype.pauseItem = function (itemId) {
    var item = this.itemDic[itemId];

    item && item.pause();
}


/**
 * 播放一个条目
 * @param itemId
 */
PlayerGroupManager.prototype.playItem = function (itemId) {
    var item = this.itemDic[itemId];

    if(item){
        itemGroup = this.groups[item._groupId];
        itemGroup && itemGroup.playItem(item);
    }
}
/**
 * 反复切换1个item的播放状态
 * @param itemId
 */
PlayerGroupManager.prototype.togglePlayItem = function (itemId) {
    var item = this.itemDic[itemId];

    if(item){
        itemGroup = this.groups[item._groupId];
        itemGroup && itemGroup.togglePlayItem(item);
    }
}

/**
 * 删除一个播放条目
 * @param itemId
 */
PlayerGroupManager.prototype.removePlayItem = function (itemId) {
    var item = this.itemDic[itemId];

    if(item){
        itemGroup = this.groups[item._groupId];
        itemGroup && itemGroup.removeItem(item);
    }
}

exports.createGroupManager = function () {
    return new PlayerGroupManager();
}