/**
 * 定义所有示例页面公用的js对象、类
 */
define('Demo.Common', ['jQuery', 'ko','OneLib.ScriptLoader','OneLib.CSSLoader','OneLib.DOM','sh'], function (require, exports, module) {
    var $ = require('jQuery'),ko = require('ko'),jsLoader = require('OneLib.ScriptLoader'),
        cssLoader = require('OneLib.CSSLoader'),scroll = require('OneLib.DOM').getScrollManager(window),highlighter = require('sh');
    var viewModel,factory,moduleName;

    var _getQueryString = function(item){
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
        return svalue ? svalue[1] : svalue;
    };

    /**
     * 类:API分组,把需要解释的API按照功能简单分组，每组在左侧的slide里一起显示
     * @param name
     * @constructor
     */
    function APIGroup(name,apis){
        var self = this;//save the this ref

        self.name = name;
//        self.apis = ko.observableArray(apis||[]);
        self.apis = apis||[];
    }

    /**
     * 添加1个或者多个API到组里
     * @param api
     */
    APIGroup.prototype.addAPI = function(api){
        var self = this;//save the this ref
        if(api.constructor === Array){
            for(var i in api){
                self.apis.push(api[i]);
            }
        }
        else{
            self.apis.push(api);
        }
    };

    function DemoCode(name,desc,type,codeUrl,cssUrls,javascriptUrls){
        var self = this;//save the this ref

        self.name = name;
        self.desc = desc;
        self.type = type; //'example'是代码示例(含html和javascript),需要进行代码高亮，和escape处理.'real'是指不需要escape的实时demo
        self.cssUrls=cssUrls;
        self.codeUrl = codeUrl;
        self.codeContent = ko.observable('');//绑定到页面进行展示
        self.javascriptUrls=javascriptUrls; //这是一个数组，数组的元素可以是string,也可以是数组，每个数组内部元素之间按顺序一个个下载。数组之间并行下载
        self.showSample = ko.computed(function(){
            return this.type==='example'&&this.codeContent().length>0;
        },self);
        self.showRealDemo = ko.computed(function(){
            return this.type==='real'&&this.codeContent().length>0;
        },self);
    }
    DemoCode.prototype.getAllContent = function(){
        var self = this;//save the this ref

        //todo:明天早上继续
        //先看有没有要下载的css列表,有的话去下载
        if(self.cssUrls&&self.cssUrls.length>0){
            for(var i=0,j=self.cssUrls.length;i<j;i++){
                var _cssUrl = self.cssUrls[i];
                //cssLoader.loadCSS(__subdomain__+_cssUrl+'?_='+Math.floor(Math.random()*100000),undefined,'utf-8');
                cssLoader.loadCSS(_cssUrl+'?_='+Math.floor(Math.random()*100000),undefined,'utf-8');
            }
        }
        //再看有没有要下载的文件内容，下载后，设置到codeContent
        $.ajax({
            //url:  __subdomain__+self.codeUrl+'?_="'+Math.floor(Math.random()*100000),
            url:  self.codeUrl+'?_="'+Math.floor(Math.random()*100000),
            cache: false,
            dataType:'html',
            success: function(codeContent){
                self.codeContent(codeContent);
                highlighter.highlight();//下载完内容后，设置代码高亮
                //设置完content后，最后看有没有要下载的js列表，有的话按顺序下载
                if(self.javascriptUrls&&self.javascriptUrls.length>0){
                    for(var i in self.javascriptUrls){
                        //self.javascriptUrls[i] = __subdomain__+ self.javascriptUrls[i]+'?_='+Math.floor(Math.random()*100000)
                        self.javascriptUrls[i] =  self.javascriptUrls[i]+'?_='+Math.floor(Math.random()*100000)
                    }

                    //jsLoader.beginQueue('demoScripts',self.javascriptUrls).
                    jsLoader.beginQueue(undefined,self.javascriptUrls).
                        //onFinish(function(st,end){

                        //}).
                        start();
                }
            }
        });

    };
    /**
     * 创建一个API
     * @param name
     * @param typeName
     * @constructor
     */
    function API(name,typeName,returned,desc,params,demoCodes){
        var self = this;//save the this ref

        self.name = name;
        self.type = typeName;
        self.returned = returned;
        self.desc = desc;
        self.params = ko.observableArray(params||[]);
        self.selected = ko.observable(false);
        self.demoCodes=[];

        self.typeAndReturnDesc = ko.computed(function(){
            if(this.type.toLowerCase()==='function'){
                //return ':  ('+this.returned+'<<'+this.type+')';
                return ':  ( => '+this.returned+' )';
            }
            else{
                return ':  ('+this.type+')';
            }

        },self);

        self.apiNameAndParams = ko.computed(function(){
            if(this.type.toLowerCase()==='function'){
                var paramDesc='',array=self.params();
                for(var i in array){
                    paramDesc+=array[i].name+(i<array.length-1?',':'');
                }
                return this.name+'('+paramDesc+')';
            }
            else{
                return this.name;
            }
        },self);

        if(demoCodes&&demoCodes.length>0){
            for(var i=0,j=demoCodes.length;i<j;i++){
                var _item = demoCodes[i];
                var _demo = new DemoCode(_item.name,_item.desc,_item.type,_item.codeUrl,_item.cssUrls,
                _item.javascriptUrls);
                _demo.getAllContent();
                self.demoCodes.push(_demo);
            }
        }
    }



    API.prototype.apiClick = function(api){
        viewModel.selectedAPI()&&viewModel.selectedAPI().selected(false);
        this.selected(true);
        viewModel.selectedAPI(this);
        scroll.scrollDown(1);//fix the chrome bug:http://stackoverflow.com/questions/11258877/fixed-element-disappears-in-chrome
        return true;
    };
    /**
     * 添加一个或者多个参数
     * @param param
     */
    API.prototype.addParam = function(param){
        var self = this;//save the this ref
        if(param.constructor === Array){
            for(var i in param){
                self.params.push(param[i]);
            }
        }
        else{
            self.params.push(param);
        }
    };

    /**
     * 创建一个参数
     * @param name
     * @param typeName
     * @param desc
     * @constructor
     */
    function Param(name,typeName,desc){
        var self = this;//save the this ref

        self.name = name;
        self.type = typeName;
        self.desc = desc;
    }

    /**
     * 头部的viewModel类
     * @constructor
     */
    function ViewModel(projectName){
        var self = this;//save the this ref

        self.projectName=projectName;

        self.leftSliderStyle={
            maxHeight:'400px'
        };

        self.rightDemoStyle={
            minHeight:'450px'
        };

        self.groups=[];
        self.selectedAPI = ko.observable();
    }

    //根据queryString里的module属性,加载指定的APIGroup.json文件，并最终完成页面绑定
    moduleName =_getQueryString('module');
    exports.vm=viewModel=new ViewModel(moduleName);
    exports.factory =factory= {
        createParam:function(name,typeName,desc){
            return new Param(name,typeName,desc);
        },
        createAPI:function(name,typeName,returned,desc,params,demoCodes){
            return new API(name,typeName,returned,desc,params,demoCodes);
        },
        createAPIGroup:function(name,apis){
            return new APIGroup(name,apis);
        }
    };


    //获取模块列表数据，并开始页面绑定
    $.ajax({
        url:  "../demoData/"+moduleName+"/api.json"+'?_="'+Math.floor(Math.random()*100000),
        cache: false,
        dataType:'json',
        success: function(_groups){
            //设置viewModel
            for(var i=0,j=_groups.length;i<j;i++){
                var _g = _groups[i];
                var group = factory.createAPIGroup(_g.name,[]);
                for(var m=0,n=_g.apis.length;m<n;m++){
                    var _a = _g.apis[m];
                    var api = factory.createAPI(_a.name,_a.type,_a.returned,_a.desc,[],_a.demoCodeRefs);
                    i===0&&m===0&&api.apiClick();
                    _a.params||(_a.params=[]);
                    for(var o=0,p=_a.params.length;o<p;o++){
                        var _p = _a.params[o];
                        var param = factory.createParam(_p.name,_p.type,_p.desc);
                        api.addParam(param);
                    }
                    group.addAPI(api);
                }
                viewModel.groups.push(group);
            }

            //页面绑定
            ko.applyBindings(viewModel,document.getElementById("root"));

//            setTimeout(function(){
//                highlighter.highlight();//启动代码高亮（该逻辑应该在所有内容加载完成之后执行，先简单延迟处理）
//            },1000);
        }
    });
});