
define('Demo.Index', ['jQuery','ko','MT'], function (require, exports, module) {

    var $ = require('jQuery'),ko = require('ko'),_viewModel,mt = require('MT'),
        wnd = window;

    function Module(moduleName,desc,linkEnable,isCur){
        var self = this;//save the this ref

        self.moduleName=moduleName;
        self.desc=desc;
        self.linkEnable=linkEnable;
        self.isCur=ko.observable(isCur);
    }
    function ViewModel(){
        var self = this;//save the this ref

        self.projectName='OneLib 演示站点';

        self.firstVisibleIndex=ko.observable(-1);

        self.demos=[];

        self.showCount=5;

        self.demosVisible = ko.computed(function(){
            var idx = this.firstVisibleIndex();
            var r =[],s=self.showCount;
            while(s--){
                r.push(this.demos[idx+ r.length]);
            }
            return r;
        },self);

        self.curDemo=ko.observable(self.demos[0]);

        self.demoClick = function(demo){
            self.curDemo().isCur(false);
            demo.isCur(true);
            self.curDemo(demo);
        };

        self.canRollLeft = ko.computed(function(){
            return self.firstVisibleIndex()>0;
        },self);

        self.canRollRight = ko.computed(function(){
            return self.demos.length-self.firstVisibleIndex()-self.showCount>0;
        },self);

        self.rollLeft = function(){
            self.canRollLeft()&& self.firstVisibleIndex(self.firstVisibleIndex()-1);
        };
        self.rollRight = function(){
            self.canRollRight()&& self.firstVisibleIndex(self.firstVisibleIndex()+1);
        };
        self.findChosenDemo = function(){
            for(var i in self.demos){
                if(self.demos[i].isCur()){
                    return {
                        index:parseInt(i,10),
                        demo:self.demos[i]
                    }
                }
            }
        };
        self.chooseLeft = function(){
            var chosen = self.findChosenDemo();
            if(chosen&&chosen.index>0){
                var leftDemo = self.demos[chosen.index-1];
                self.demoClick(leftDemo);
                //如果当前达到可视部分的左侧，则向左移动一次
                if(chosen.demo === self.demosVisible()[0]){
                    self.rollLeft();
                }
            }
        };
        self.gotoDemo = function(){
            wnd.location.href =$("#goToDemo").attr('href');
        };
        self.chooseRight = function(){
            var chosen = self.findChosenDemo();
            if(chosen&&chosen.index<self.demos.length-1){
                var leftDemo = self.demos[chosen.index+1];
                self.demoClick(leftDemo);
                //如果当前达到可视部分的右侧，则向右移动一次
                if(chosen.demo === self.demosVisible()[self.demosVisible().length-1]){
                    self.rollRight();
                }
            }
        };
    }

    exports.vm = _viewModel=new ViewModel();

    //获取模块列表数据，并开始页面绑定
    $.ajax({
        url: __subdomain__+"/demo/demoData/modules.json?_="+Math.floor(Math.random()*100000),
        cache: false,
        dataType:'json',
        success: function(data){
            for(var i=0,j=data.length;i<j;i++){
                var _item = data[i];
                //设置viewModel
                _viewModel.demos.push(new Module(_item.moduleName,_item.desc,_item.linkEnable,i===0));
            }

            _viewModel.curDemo(_viewModel.demos[0]);
            _viewModel.firstVisibleIndex(0);
            //页面绑定
            ko.applyBindings(exports.vm,document.getElementById("root"));
            //键盘
            mt.bind('left', _viewModel.chooseLeft);
            mt.bind('right', _viewModel.chooseRight);
            mt.bind('enter', _viewModel.gotoDemo);

        }
    });

});