/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-11 22:14:17
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 * 定义路由
 *
 *
 * 前端路由：响应url到函数
 *   Backbone通过Backbone.Router和Backbone.History实现路由功能
 *   Router: 定义路由规则和匹配的函数
 *   History: 检测用户是想通过pushState还是hash方式注册url变化事件，在事件处理程序中，如果是hash方式，则匹配到

  路由规则支持三种
    1、xx/:id
      转换成路由规则 xx/([^/?]+)
    2、xx/(abc)
      转换成xx/(?:abc)
    3、xxx 
    4、*xxx
      转换成 ([^?]*?)
    
  escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
  optionalParam = /\((.*?)\)/g;
  namedParam    = /(\(\?)?:\w+/g;
  splatParam    = /\*\w+/g;

  (?:exp) 不给匹配的exp分组
  (?=exp) 匹配exp前面的字符，不返回exp
  (?!exp) 匹配后面不是exp的字符，不返回exp

  routeToRegExp
    将route字符串转成route正则对象

  实例化Backbone.History类
  在继承Router的子类中为原型对象增加routes对象，里面是路由规则和匹配函数
  遍历routes对象，将key(路由规则字符串转成路由规则正则表达式),和重新定义匹配函数
  注入到Backbone.history的routes属性中
  如果浏览器支持hashchange并且用户没有明确规定禁止hashchange,就绑定hashchange事件
  在hashchange事件中，获取hash（#后面的字符)，去除多余的#和结尾空格
  到history的routes使用路由规则去匹配当前的hash，如果匹配到了，就调用匹配函数

  如果服务器支持url rewrite模式，那么就使用pushState方式，更加友好，那么就拿到pathname和querystring来代替hash进行匹配执行
 */

define([ 'IndexView' ], function (IndexView) {
    return {
        routes: {
            '': 'index',
            'modal': 'modal',
            'resize': 'resize'
        },
        index: function () {
          var indexView = new IndexView({
            className: 'home'
          });    

          indexView.render();
        },
        modal: function () {
          var drag = new DragCom();
          var modal = new ModalCom({
            className: 'modal',
            header: '<span>hd</span>',
            body: '<span>bd</span>',
            parent: drag.$el
          });
          modal.render();
          drag.render();
        },
        resize: function () {
          var resize = new ResizeCom();
          var modal = new ModalCom({
            className: 'modal',
            header: '<span>hd</span>',
            body: '<span>bd</span>',
            parent: resize.$el 
          });
          modal.render();
          resize.render();
        },
        error: function () {
            console.log('error');
        }
    };
});