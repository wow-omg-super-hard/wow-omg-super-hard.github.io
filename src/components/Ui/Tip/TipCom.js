/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-14 13:37:29
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'backbone', 'underscore' ], function (Bb, _) {
    var ins, timeout;

    // 文字提示组件，不能频繁的被调用，应该给定限制时间内，不能被再次创建
    // 采用单例模式
    return Bb.View.extend({
        constructor: function (options) {
            if (ins) {
                return ins;
            }

            ins = this;
            timeout = Date.now();
            options || (options = {});
            this.constructor.__super__.constructor.call(this, options);
        },

        initialize: function (options) {
            // 运行时间，在这段时间中是不允许再次创建
            this.duration = options.duration || 3000;
            this.text = options.text || '';
            this.$parent = options.parent ? Bb.$(options.parent) : Bb.$(document.body);
        },

        // 检测页面中是否存在遮罩层
        checkMaskEl: function () {
            return Bb.$('.mask').length > 0;
        },

        render: function () {
            var zIndex;
            var timer = setTimeout(_.bind(function () {
                clearTimeout(timer);
                ins = null;
                timeout = Date.now();
                this.remove();
            }, this), this.duration);

            if (!this.checkMaskEl()) {
                Bb.$('<div class="zask"></div>').appendTo(document.body);
            }

            zIndex = parseInt(Bb.$('.zask').css('z-index'));

            if (!this.$parent.css('z-index') && this.$parent.get(0).nodeName.toLowerCase() !== 'body') {
                this.$parent.css('z-index', zIndex + 1);
            }

            if (!(/relative|absolute|fixed/.test(this.$parent.css('position'))) && this.$parent.get(0).nodeName.toLowerCase() !== 'body') {
                this.$parent.css('position', 'relative');
            }

            this.$el.css('z-index', zIndex + 1).html(this.text).appendTo(this.$parent);
        }
    });    
});

