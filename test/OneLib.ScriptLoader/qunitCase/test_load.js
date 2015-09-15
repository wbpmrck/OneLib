alert("qunit 做异步测试太丑陋，此用例写不下去了，使用jasmine重写")
define('test_jsLoad', ['OneLib.ScriptLoader', '_log'], function (require, exports, _module) {

    var loader = require('OneLib.ScriptLoader'),logger = require('_log');



    module( "group 1:加载外部js,并且有回调", {
        setup: function() {
            // prepare something for all following tests
            $(".__log__").remove();
        },
        teardown: function() {
            // clean up after each test
        }
    });

    asyncTest( "loader.loadScript", function() {
        expect(3);
        var _logger = new OneLib.Log.Logger(true);
        _logger.writeLine('begin load');

        var _loaded=[],
            _toLoad = [
                'http://localhost:19527/src/old/MyCore.ImageLoader.js',
                'http://localhost:19527/src/old/MyCore.Navigation.js',
                'http://localhost:19527/src/old/MyCore.Url.js'
            ];
        var loadOK = function(url){
            for(var i=0,j=_toLoad.length;i<j;i++){
                var _item = _toLoad[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        }

        for(var i=0,j=_toLoad.length;i<j;i++){
            var _item = _toLoad[i];
            loader.loadScript(_item,function(loadedUrl,beginAt,endAt){
                _loaded.push(loadedUrl);
                _logger.writeLine('file:'+loadedUrl+'begin load at:'+beginAt+' end at:'+endAt);

                if(_loaded.length === _toLoad.length){

                    //由于css加载顺序不一定严格，所以要查找在不在
                    for(var m=0,n=_loaded.length;m<n;m++){
                        var _loadedJs = _loaded[m];
                        equal(loadOK(_loadedJs),true,_loadedJs+' must right!');
                    }
                    start();
                }
            });
        }
    });


    module( "group 2:使用Queue来加载多个文件，队列内部可以使用串行、并行下载控制。队列之间并行下载(通过console查看文件并行下载timeline)", {
        setup: function() {
            // prepare something for all following tests
//            $(".__log__").remove();
        },
        teardown: function() {
            // clean up after each test
        }
    });






    asyncTest( "loader.beginQueue.asyncStart", function() {
        expect(3);

        var _logger = new OneLib.Log.Logger(true);
        _logger.writeLine('begin load');

        var _loaded4=[],
            _toLoad4 = [
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_a4.js',
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_b4.js',
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_c4.js'
            ];
        var loadOK4 = function(url){
            for(var i=0,j=_toLoad4.length;i<j;i++){
                var _item = _toLoad4[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        };

        var queue4 = loader.beginQueue('queue4',_toLoad4);
        queue4.on("load",function(url,beginAt,endAt){
            _loaded4.push(url);
            equal(loadOK4(url),true,url+' must right!');
        },3);
        queue4.once("finish",function(){
            //_logger.writeLine('queue4:loaded:'+loaded);
            //由于css加载顺序不一定严格，所以要查找在不在
            //for(var m=0,n=_loaded4.length;m<n;m++){
            //    var _loadedJs = _loaded4[m];
            //}
            start();
        });
        queue4.asyncStart();
    });


    asyncTest( "loader.beginQueue.start", function() {
        expect(16);//kaicui 2015-09-14 增加同样文件重复下载的测试
        var _logger = new OneLib.Log.Logger(true);
        _logger.writeLine('begin load');

        var oneFinish =false,twoFinish =false,threeFinish =false;

        //从博客园下载几个js
        var _loaded=[],
            _toLoad = [
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_a.js',
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_b.js',
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_c.js'
            ];
        var loadOK = function(url){
            for(var i=0,j=_toLoad.length;i<j;i++){
                var _item = _toLoad[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        };
        var _loaded2=[],
            _toLoad2 = [
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_a2.js',
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_b2.js',
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_c2.js'
            ];
        var loadOK2 = function(url){
            for(var i=0,j=_toLoad2.length;i<j;i++){
                var _item = _toLoad2[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        };

        var _loaded3=[],
            _toLoad3 = [
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_a3.js',
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_b3.js',
                'http://localhost:19527/test/OneLib.ScriptLoader/qunitCase/module_c3.js'
            ];
        var loadOK3 = function(url){
            for(var i=0,j=_toLoad3.length;i<j;i++){
                var _item = _toLoad3[i];
                if(url === _item){
                    return true;
                }
            }
            return false;
        };

        //对于相同文件下载测试，其要加载的文件，和计算文件是否下载成功方法，都和2一样
        var _loaded4=[],
            _toLoad4 = _toLoad2;
        var loadOK4 = loadOK2;

        //这个队列先完成一批下载，然后再添加3个任务下载
        var queueOne = loader.beginQueue('queueOne').
            load(_toLoad);
        queueOne.on("load",function(url,beginAt,endAt){
            _loaded.push(url);
            equal(loadOK(url),true,url+' must right!');
        },3);
        queueOne.once("finish",function(loaded){
            //_logger.writeLine('queue1:loaded:'+loaded);
            //equal(loaded,3,'queue1 must loaded 3 scripts!');
            //    //由于css加载顺序不一定严格，所以要查找在不在
            //    for(var m=0,n=_loaded.length;m<n;m++){
            //        var _loadedJs = _loaded[m];
            //        equal(loadOK(_loadedJs),true,_loadedJs+' must right!');
            //    }
            //继续补充几个任务再启动该队列
            loader.theQueue('queueOne').
                load(_toLoad3).
                on("load",function(url,beginAt,endAt){
                    _loaded3.push(url);
                    equal(loadOK3(url),true,url+' must right!');
                },3);
            queueOne.once("finish",function(loaded){
                //_logger.writeLine('queue1:loaded:'+loaded);
                //equal(loaded,3,'queue1 must loaded 3 scripts!');
                //        //由于css加载顺序不一定严格，所以要查找在不在
                //        for(var m=0,n=_loaded3.length;m<n;m++){
                //            var _loadedJs = _loaded3[m];
                //            equal(loadOK3(_loadedJs),true,_loadedJs+' must right!');
                //        }
                oneFinish=true;
                oneFinish&&start();
            });
            queueOne.start();
        });
        queueOne.start();



        var queueTwo = loader.beginQueue('queueTwo').load(_toLoad2);
        queueTwo.on("load",function(url,beginAt,endAt){
            _loaded2.push(url);
            equal(loadOK2(url),true,url+' must right!');
        },3);
        queueTwo.once("finish",function(loaded){
            //_logger.writeLine('queue2:loaded:'+loaded);
            //equal(loaded,3,'queue2 must loaded 3 scripts!');
            //    //由于css加载顺序不一定严格，所以要查找在不在
            //    for(var m=0,n=_loaded2.length;m<n;m++){
            //        var _loadedJs = _loaded2[m];
            //        equal(loadOK2(_loadedJs),true,_loadedJs+' must right!');
            //    }
            twoFinish = true;
            oneFinish&&twoFinish&&start();
        });
        queueTwo.start();



        var queueThree =loader.beginQueue('queueThree').load(_toLoad2);
        queueThree.on("load",function(url,beginAt,endAt){
            _loaded4.push(url);
            equal(loadOK4(url),true,url+' must right!');
        },3);
        queueThree.once("finish",function(loaded){
            //_logger.writeLine('queue3:loaded:'+loaded);
            //equal(loaded,3,'queue3 must loaded 3 scripts!');
            //    //由于css加载顺序不一定严格，所以要查找在不在
            //    for(var m=0,n=_loaded4.length;m<n;m++){
            //        var _loadedJs = _loaded4[m];
            //        equal(loadOK4(_loadedJs),true,_loadedJs+' must right!');
            //    }
            threeFinish = true;
            oneFinish&&twoFinish&&threeFinish&&start();
        });
        queueThree.start();
    });


});
