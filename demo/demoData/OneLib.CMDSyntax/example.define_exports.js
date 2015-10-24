define('moduleName', [], function (require, exports, module) {
    exports.publicMethod1 = function(){
        //bla bla bla...
    };

    // don't do this!
    //    exports={
    //        publicMethod1 : function(){
    //            //bla bla bla...
    //        }
    //    };
});