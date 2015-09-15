//为调试脚本提供server服务


var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

//通用配置
app.configure(function(){
    app.set('port',"19527");
    //app.set('views', __dirname + '/view');
    //app.set('view engine', 'html');
    //app.use(express.logger({stream:accessLogFile}));
//            app.use(express.favicon());
    app.use(express.compress());
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(path.resolve(__dirname, '../../../')));

});

var httpServer=http.createServer(app);
httpServer.listen(app.get('port'), function(){
    console.log('WebSiteServer:成功启动,监听端口:%s ,访问下面链接开始测试 <a href="%s"></a>',app.get('port'),
    "http://localhost:19527/test/OneLib.ScriptLoader/jasmineCase_html/test_scriptLoader.html");
});