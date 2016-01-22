function APIrequestor(apiOpt){
    //=========私有方法===========
    var utils = {
        defaultOption :{
            data : "",  // json or string
            method : "POST",
            receiveType : "html",  // html json or xml
            async : true,
            success : function(){alert("define your success function");},
            error : function(xmlhttp){}
        },
        config : {
            '_curd': 'get,add,edit,del',
            '_mul': 'query,muladd,muldel,muledit',
            '_normal': 'get,query,add,edit,del',
        },

        //========通用方法===========
        // 对象继承方法
        extend : function(destination, source, override) {
            if(undefined == override) override = true;
            if(typeof destination != "object" && typeof destination != "function") {
                if(!override)
                    return destination;
                else
                    destination = {};
            }
            var property = '';
            for(property in source) {
                if(override || !(property in destination)) {
                    destination[property] = source[property];
                }
            }

            return destination;
        },


        // 判断数组
        isArray : function(v) {
            return toString.apply(v) === '[object Array]';
        },


        // json to string {name: 'lisi', age: 10} --> name=lisi&age=10
        json2String : function(obj) {
            var msg;
            for(var item in obj){
                var value = obj[item]
                if(this.isArray(value)){
                    item = item + '[]'
                    var len = value.length
                    for(var i = len - 1; i >= 0; i--){
                        var data = data ? data + '&' + item + '=' + value[i] : item + '=' + value[i]
                    }
                }else{
                    var datas = item + '=' + value
                }
                var Data = data || datas
                msg = msg ? msg + '&' + Data : Data
                data = null
            }
            return msg
        },


        //=========Ajax方法==========
        // 初始化xmlhttpRequest
        init : function() {
            var xmlhttp = null;

            // 针对不同浏览器建立这个对象的不同方式写不同代码
            if(window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
                //针对某些特定版本的Mozillar浏览器的BUG进行修正
                if(xmlhttp.overrideMimeType) {
                    xmlhttp.overrideMimeType("text/xml");
                }

            } else if (window.ActiveXObject) {
                var activexName = ['MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
                for (var i=0; i<activexName.length; i++) {
                    try {
                        xmlhttp = new ActiveXObject(activexName[i]);
                        break;
                    } catch(e) {}
                }
            }
            return xmlhttp;
        },

        // 发送http 请求  opt = {url:'',data:''}
        ajax : function(opt) {
            this.xmlhttp = this.init()
            var _self = this,
            isTimeout = false,
            options = {
                url : "",   // string
                data : "",  // json or string
                method : "POST",
                receiveType : "html",  // html json or xml
                timeout : 7000,
                async : true,
                success : function(){},
                error : function(xmlhttp){}
            };
            if("data" in opt) {
                if(typeof opt.data == "string"){} else {opt.data = this.json2String(opt.data); }
            }
            options = this.extend(options, opt);

            this.xmlhttp.onreadystatechange = function(){
                if(_self.xmlhttp.readyState == 4) {
                    if(!isTimeout && _self.xmlhttp.status == 200) {
                        var t = options.receiveType.toLowerCase();
                        if(t == "html") {
                            options.success(_self.xmlhttp.responseText);

                        } else if(t == "xml") {
                            options.success(_self.xmlhttp.responseXML);

                        } else if(t == 'json') {
                            try {
                                var obj = JSON.parse(_self.xmlhttp.responseText);
                                options.success(obj);
                            } catch(e) {
                                var str = '(' + _self.xmlhttp.responseText + ')';  //json字符串
                                options.success(eval(str));
                            }
                        } else {}

                    } else {
                        options.error(_self.xmlhttp);
                    }
                }
            };



            this.xmlhttp.open(options.method.toUpperCase(), options.url, options.async);  //打开与服务器连接
            if(options.method.toUpperCase() == "POST") {
                this.xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  //post方式要设置请求类型
                this.xmlhttp.send(options.data);  //发送内容到服务器

            } else {
                this.xmlhttp.send(null);
            }
        },
    }

    //=========主要方法===========
    var main = {
        //== 解析apiOpt的配置
        nameSpace : function(name) {
            var obj = {};
            if (utils.isArray(name)) {
                for (var i = name.length - 1; i >= 0; i--) {
                    var item = name[i];
                    if (item.match(/\w+\((\S+[,]?)+\)/) && !item.match(/\(,|,\)/)) {   // xxxx(xx,xx)
                        var act = item.substring(item.indexOf('(') + 1, item.length - 1)  // @,shop
                        for (def in utils.config) {
                            var defAct = utils.config[def]; //get,add,edit,del
                            var reg = new RegExp(',' + def, "g"); //不允许重复多个标示，重复则去掉多余的
                            act = act.replace(def, defAct).replace(reg, ""); //[get,add,edit,del,shop]
                        }
                        var actArr = act.split(',')
                        var mod = item.substring(0, item.indexOf('('));
                        obj[mod] = {}

                        for (var a = actArr.length - 1; a >= 0; a--) {
                            (function (action, fun, mod) {
                                obj[mod][action] = function (option) {
                                    fun(mod, action, option || utils.defaultOption);
                                }
                            })(actArr[a], main.apiHandle, mod);
                        }
                    } else {
                        console.log(item + '格式不对，无法编译')
                    }
                }
            } else {
                console.log('传的不是数组哦')
            }
            return obj;
        },

        //== 获取到解析后的接口名称和方法进行ajax请求
        apiHandle : function(mod,act,option){
            if(option){
                option = utils.extend(utils.defaultOption,option,true);
            }else{
                option = utils.defaultOption;
            }

            var url = apiOpt.url || 'https://github.com/lipten/';       //哈哈默认url是我的github主页,捧个star呗!

            utils.ajax({
                url: url+mod+'/'+act,
                method: option.method,
                data:option.msg,
                success:function(res){
                    try{
                        res = $.parseJSON(res);
                    }catch(e){
                        alert('返回数据格式不为Json');
                        return;
                    }
                    option.success(res);
                },
                error:function(res){
                    option.error(res);
                }

            })
        }
    }

    //  转换apiArr为方法调用的形式
    return main.nameSpace(apiOpt.apiArr)
}