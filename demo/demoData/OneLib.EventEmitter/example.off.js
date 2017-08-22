
aDog.off('shouted',callback);//把shouted的处理函数callback移除

//或者使用on返回的SubscribeId
var SubscribeId = aDog.on("shout",function(){});

aDog.off("shout",SubscribeId);//这样也可以