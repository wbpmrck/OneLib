#OneLib
<hr/>
##What is this?
这是一个通用代码库，里面包含了日常web开发过程中基类下来的一些类库、使用CMD语法规范进行重新定义、整合.项目demo地址：<a href="http://justapp.sinaapp.com/static/OneLib/demo/html/index.html" target="_blank">点击打开</a>
<hr/>

##Todos
<hr/>

###Done
<ul>
    <li>重构事件触发器部分，使用最新的eventEmitter(支持once等API)</li>
    <li>eventEmitter:增加once功能，可以定义只触发一次的事件(使用ttl实现)</li>
    <li>eventEmitter:去除CMD的包裹，event机制作为做基础的扩展，很可能被CMD模块本身所依赖</li>
   <li>项目中新增静态服务server,使用express实现，方便测试脚本加载等功能.</li>
   <li>新增Secure.MD5,Secure.SHA_1(1,256,512)模块，实现本地进行摘要加密(参考node3.0项目).</li>
 <li>新增Array.map方法到ES5模块.</li>
 <li>重写ModuleSyntax模块.</li>
 <li>使用karma+jasmine完成单元测试.</li>
 <li>修改首页布局，导航部分的模块名称可以左右滚动.</li>
 <li>实现将第三方模块快速包装成OneLib Module(demo中有knockout.js和jquery的例子).</li>
 <li>js生成GUID.</li>
 <li>ok|先实现异步脚本加载库，作为CMDSyntax的一部分.</li>
 <li>ok|修改首页的实现，不在.js里写死所有模块，而是在外部json里维护.</li>
 <li>ok|实现css加载器,用于动态载入demo需要的样式,补充基于Qunit的测试用例</li>
 <li>ok|补充scriptLoader,实现按顺序加载、执行多个js文件,补充基于Qunit的测试用例.(可以新建下载队列，每个队列一个个挨着下。)</li>
 <li>ok|补充scriptLoader,对外部提供更加友好的API(loader.beginQueue("queue1").load(xxx.js).load(yyy.js).start();)来描述脚本的加载顺序。然后内部使用多个队列执行</li>
 <li>所有demo页面使用一个html,通过不同的queryString加载不同的demo.js,然后示例代码、html都通过静态html+ajax的方式载入</li>
 <li>页面执行的顺序:
    <ul>
        <li>分析queryString,得到demo.js,载入。</li>
        <li>ajax获取该demo要演示的group->api的json文件，并载入。</li>
        <li>分析用到的API,以及API指向的若干个demo项目。</li>
        <li>每个demo项目，都有3个属性，指定的代码Html片段地址、js片段地址、最终得到的html文件。demo.js依次下载他们，并显示在页面上</li>
        <li>用户看到所有的示例和代码，并且可以运行</li>
    </ul>
 </li>
 <li>demo页面模板制作.
     <ul>
        <li>实现代码高亮.</li>
        <li>可以实现区分demo的类型，如果是代码，则使用代码高亮。如是demo.则使用html绑定</li>
        <li>左侧为api,点击页面通过锚点定位到右侧某个demo.且实现当前API高亮功能，右侧demo区和左侧slide同时高亮</li>

    </ul>
 </li>
  <li>修改OneLib.CMDSyntax的bug,在模块require的时候，被需要的模块如果本身是一个函数，则需要复制一个函数供外部使用</li>
    <li>增加库：浏览器版本判断.并完善对手机浏览器的支持</li>
    <li>ES5的兼容性实现+demo,包括:
        <ul>
            <li>1、<undefined> Array.prototype.forEach(val,idx,array)</li>
            <li>1、<Array> Array.prototype.filter(val,idx,array)</li>
            <li>1、<bool> Array.isArray</li>
            <li>1、Function.prototype.bind(thisArg [, arg1 [, arg2, …]])</li>
        </ul>
    </li>
  <li>补充EventEmitter模块的testCase和demo.</li>
</ul>

###Doing
<ul>
    <li>将Min heap(小顶堆)的实现加入</li>
  <li>扩展Math.Random功能，实现生成一个范围内随机数功能</li>
  <li>扩充Location模块:将原先Url和Navigation模块里的功能也集成到Location里面</li>
  <li>补充Location模块的testCase</li>
  <li>补充Location模块的Demo</li>
 <li>集成fis环境，发布的文件进行压缩.</li>
</ul>

###To be done
<ul>
  <li>* eventEmitter:修改API和增加once之后，需要补充demo和文档</li>
  <li>新增模块:CPUMonitor:使用setTimeout打点的方式.判断当前cpu繁忙情况</li>
  <li>集成jquery.coffee.</li>
  <li>添加OneLib.IS.(一系列的isXXX方法判断数据类型)</li>
 <li>url、queryString的操作类.</li>
 <li>常用设计模式模块封装.</li>
 <li>Json序(反序)列化模块.</li>
 <li>在ScriptLoader里面增加jsonp功能（需要定义一个接受json string的函数，然后外部json文件通过func(<json>)实现。要用到json反序列化）.</li>
 <li>DOM模块.</li>
 <li>类jQuery选择器实现.</li>
 <li>优化js和css加载器，不仅可以发出下载完成的回调，还可以知道文件是加载成还是失败了</li>
 <li>进行HTML escape和unescape.</li>
 <li>完成OneLib.Scroll的测试用例</li>
  <li>增强scriptLoader
    <ul>
        <li>不用定义moduleName和dependencies,直接使用文件所在路径作为模块名，require的模块作为依赖</li>
        <li>可以使用path配置各种路径的简称，让编写更方便，比如，var ko = require('$common$/tip.js')</li>
    </ul>
 </li>
</ul>


##Features
<ul>
 <li>统一的语法定义(CMD).</li>
 <li>完整的示例.</li>
 <li>完善的测试用例.</li>
</ul>

## License

MIT
##End
