
# API-requestor
利用API-requestor无需定义请求方法即可调用API请求接口

## Doc
<pre>
    var apiOpt = {
           //配置接口名称和方法
           //格式为'业务名(操作方法1,操作方法2)'
           //如需要构造用户登录接口只需'user(login)'即可
           apiArr :[
               //=================这里只是示例一些常用接口==================
               'user(logout,login,add,verify,lostpass,get)',
               'company(_normal,config,getconfig)',
               'goods(_normal,choose,edit)',
   
               //=================记得帮忙点个star哦！======================
               'slidePage(star)'
           ],
   
           //这里默认预定义一些常用方法(如：get,add,edit,del)
           //前面的示例接口看到的'_normal'，即代表get,query,add,edit,del这五个方法
           //_normal会被解析为get,query,add,edit,del，所以不要把_normal当成方法调用了
           config : {
               '_curd': 'get,add,edit,del',
               '_mul': 'query,muladd,muldel,muledit',
               '_normal': 'get,query,add,edit,del',
           },
   
           //统一的接口地址,暂不支持配置单个接口的url
           url:'https://github.com/lipten/'
   
       }
   
       //== 执行api解析apiOpt的配置
       var API = APIrequestor(apiOpt);
   
   
       //== 调用方法
       //API.user.login(ajaxArg)
       //API.company.getconfig(ajaxArg)
   
   
       //== 调用接口可带参数
       var ajaxArg = {
           method  : "post",       //默认post
           data    : "",           //默认为空，可传string或json对象
           success:function(data){
               console.log('请求成功')
           },
           error:function(res){
               alert('方法成功调用，但是服务器没提供接口')
               console.log('请求失败')
           }
       }
   
       //------对应apiArr里的元素'slidePage(star)'=>API.slidePage.star()
       API.slidePage.star(ajaxArg);
</pre>

