/**
 * 基于css3的纯js实现的弹框插件
 * 使用时直接在页面引用当前js文件，注意要把script标签放在body标签中
 * 然后就可以在全局中使用该插件了
 * alertMsg(msg, callback);
 *      msg是弹框显示的信息，callback是一回调函数，表示点击弹框中的确定按钮后需要执行的事件，可为空
 * confirmMsg(msg, callback);
 *      同上
 */
(function(){
    //提供操作dom节点的统一方法
    var domOperate = {};
    domOperate = {
        //创建element对象，
        create: function(ele, cns){
            var eleObj = document.createElement(ele);
            if(cns){
                this.addClass(eleObj, cns);
            }
            return eleObj;
        },
        //添加class，可以添加多个class，以空格为分隔符
        addClass: function(ele, cn){
            if(ele.className){
                ele.className += ' ' + cn;
            }else{
                ele.className += cn;
            }
        },
        //移除class，可以移除多个class，以空格为分隔符
        removeClass: function(ele, cn){
            var cns = cn.split(' ');
            for(var i in cns){
                if(cns[i] && this.hasClass(ele, cns[i])){
                    ele.className = ele.className.replace( new RegExp( "(\\s|^)" + cns[i] + "(\\s|$)" )," " );
                }
            }
            ele.className = ele.className.replace(/^\s(.*)\s$/, '$1');
        },
        //是否包含某个class
        hasClass: function(ele, cn){
            return !!ele.className.match( new RegExp( "(\\s|^)" + cn + "(\\s|$)") );
        },
        //添加css，style是一个对象，对象中的字段名是样式名，字段值是样式值
        addCss: function(ele, style){
            for(var i in style){
                ele.style[i] = style[i];
            }
        }
    }
    //事件处理
    var EventUtil = {
        //绑定事件
        addHandler: function(element, type, handler){
            if(element.addEventListener){
                element.addEventListener(type, handler, false);
            }else if(element.attachEvent){
                element.attachEvent("on"+type, handler);
            }else{
                element["on"+type] = handler;
            }
        }
    }
    //更改函数内部的this指向
    Function.prototype.bind = function(context){
        var self = this;
        return function () {
            return self.apply(context, arguments);
        }
    }
    //var setting = {};
    //对话框
    function Dialog(){
        this.mask= '';//遮罩层
        this.title= '';//弹框标题
        this.content= '';//弹框提示内容
        this.buttonClose= '';//弹框关闭按钮
        this.buttonOk= '';//弹框确定按钮
        this.buttonOkEvent= '';//弹框确定按钮绑定的事件
        this.width= 300;//弹框的初始宽度
        this.height= 200;//弹框的初始高度
        this.screenWid= window.innerWidth;//浏览器文档部分的宽度
        this.screenHei= window.innerHeight;//浏览器文档部分的高度
        //初始化弹框html
        this.init= function(){
            //setting = extend(setting, option);
            this.mask = domOperate.create('div', 'dialog-mask');
            domOperate.addCss(this.mask, {'transition': 'all 0.5s'});
            this.dialogContainer = domOperate.create('div', 'dialog-container');

            //对话框头部
            this.dialogHead = domOperate.create('div', 'dialog-head');
            this.title = domOperate.create('p');
            this.title.innerHTML = '提示';
            this.buttonClose = domOperate.create('span', 'btn-close');
            this.buttonClose.innerHTML = '×';
            this.dialogHead.appendChild(this.title);
            this.dialogHead.appendChild(this.buttonClose);
            this.dialogContainer.appendChild(this.dialogHead);

            //对话框内容
            this.dialogContent = domOperate.create('div', 'dialog-content');
            this.content = domOperate.create('p');
            this.dialogContent.appendChild(this.content);
            this.dialogContainer.appendChild(this.dialogContent);

            //对话框底部
            this.dialogFoot = domOperate.create('div', 'dialog-foot');
            this.buttonOk = domOperate.create('button', 'btn-ok');
            this.buttonOk.innerHTML = '确定';
            this.dialogFoot.appendChild(this.buttonOk);
            this.dialogContainer.appendChild(this.dialogFoot);

            var body = document.getElementsByTagName('body')[0];
            this.mask.style.visibility = 'hidden';
            this.dialogContainer.style.visibility = 'hidden';
            body.appendChild(this.mask);
            body.appendChild(this.dialogContainer);
            domOperate.addCss(this.dialogContainer, {
                'left': (this.screenWid - this.width) / 2 + 'px',
                'top': '0px',
                'opacity': 1,
                'transition': 'all 0.3s'
            });
        };
        //根据弹框内容重置弹框大小
        this.setSize= function(){
            domOperate.addCss(this.mask, { 'height': document.body.scrollHeight + 'px'});
            var contentHei = this.content.offsetHeight;
            //123是对话框中间部分的高度，77是头部和
            if(contentHei>123){
                this.dialogContainer.style.height = (contentHei + 77) + "px";
            }

        };
        //给弹框上的按钮绑定响应事件
        this.attachEvent= function(){
            //var dialogObj = this;//取到当前弹框对象，在click响应事件中无法使用this得到当前弹框对象
            /*EventUtil.addHandler(this.buttonClose, 'click', function () {
                dialogObj.hide();
            });
            EventUtil.addHandler(this.buttonOk, 'click', function(){
             if(typeof dialogObj.buttonOkEvent == 'function'){
             dialogObj.buttonOkEvent();
             }
             dialogObj.hide();
             });*/
            //绑定事件响应函数的时候更改函数内部的this指向
            EventUtil.addHandler(this.buttonClose, 'click', function () {
                this.hide();
            }.bind(this));
            EventUtil.addHandler(this.buttonOk, 'click', function(){
                if(typeof this.buttonOkEvent == 'function'){
                    this.buttonOkEvent();
                }
                this.hide();
            }.bind(this));

        };
        //弹框显示方法
        this.show= function(msg, callback){
            this.content.innerHTML = msg;
            this.buttonOkEvent = callback;
            this.setSize();
            domOperate.addCss(this.mask, {'opacity': 0.5, 'visibility': 'visible'});
            domOperate.addCss(this.dialogContainer, {
                'left': (this.screenWid - this.width) / 2 + 'px',
                'top': '40px',
                'opacity': 1,
                'visibility': 'visible'
            });
            //domOperate.addClass(this.dialogContainer, 'elastic');
        };
        //弹框隐藏方法
        this.hide= function(){
            domOperate.addCss(this.mask, {'opacity': 0, 'visibility': 'hidden'});
            domOperate.addCss(this.dialogContainer, { 'top': "0", 'opacity': 0, 'visibility': 'hidden'});
            //domOperate.removeClass(this.dialogContainer, 'elastic');
        }
    }
    //alert弹框，继承于Dialog
    Dialog.prototype.alertDialog = function () {
        this.init();
        this.attachEvent();
    }
    //confirm弹框，继承于Dialog，有自己独立的方法
    Dialog.prototype.confirmDialog = function () {
        this.buttonCancel= '';//弹框取消按钮
        this.initCancel= function () {
            this.buttonCancel = domOperate.create('button', 'btn-cancel');
            this.buttonCancel.innerHTML = '取消';
            this.dialogFoot.appendChild(this.buttonCancel);
            //var dialogObj = this;//取到当前弹框对象
            EventUtil.addHandler(this.buttonCancel, 'click', function () {
                this.hide();
            }.bind(this));
        }
        this.init();
        this.initCancel();
        this.attachEvent();
    }

    //alert对话框
    var dialogA = new Dialog();
    dialogA.alertDialog();
    window.alertMsg = function(msg, callback){
        dialogA.show(msg, callback);
    }

    //confirm对话框
    var dialogC = new Dialog();
    dialogC.confirmDialog();
    window.confirmMsg = function (msg, callback) {
        dialogC.show(msg, callback);
    }

    //当浏览器大小变化时，重新计算弹框的位置
    window.onresize = function () {
        dialogA.screenWid = window.innerWidth;
        domOperate.addCss(dialogA.dialogContainer, {
            'left': (dialogA.screenWid - dialogA.width) / 2 + 'px'
        });
        dialogC.screenWid = window.innerWidth;
        domOperate.addCss(dialogC.dialogContainer, {
            'left': (dialogC.screenWid - dialogC.width) / 2 + 'px'
        });
    }

    function extend(des, src, override){
        if(src instanceof Array){
            for(var i = 0, len = src.length; i < len; i++){
                extend(des, src[i], override);
            }
        }
        for( var i in src){
            if(override || !(i in des)){
                des[i] = src[i];
            }
        }
        return des;
    }
})();
