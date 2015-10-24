
//统一配置：为了加载不同demo依赖的js的时候不会报模块重复定义的错误，将模块名冲突的处理方式定为“忽略”
OneLib.CMDSyntax.configDealConflicts({
    moduleNameConflict:'return'
});
