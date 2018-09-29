/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-15 13:02:56
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'backbone', 'underscore', 'text!modalTmpl.html' ], function (Bb, _, modalTmpl) {
    var noop = function () {}, ins;

    return Bb.View.extend({
        constructor: function (options) {
            if (ins) {
                return ins;
            }

            options || (options = {});
            this.constructor.__super__.constructor.call(this, options);
        },

        initialize: function (options) {
            this.$header = Bb.$(options.header || '<div>header</div>');
            this.$body = Bb.$(options.body || '<div>body</div>');
            this.$parent = Bb.$(options.parent || document.body);
            this.sureText = options.sureText != null ? options.sureText : '确定';
            this.cancelText = options.cancelText != null ? options.cancelText : '取消';
            this.sureCb = options.sureCb || noop;
            this.cancelCb = options.cancelCb || noop;
        },

        className: 'modal-wrap',

        events: {
            'click': 'cancelHandle',
            'click .modal-content': 'stopPropagationHandle',
            'click .btn-sure': 'sureHandle',
            'click .btn-cancel': 'cancelHandle'
        },

        // 检测页面中是否存在遮罩层
        checkMaskEl: function () {
            return Bb.$('.mask').length > 0;
        },

        remove: function () {
            var originalRemove = this.constructor.__super__.remove;

            originalRemove.call(this);
            Bb.$('.zask').remove();
            ins = null;
        },

        render: function () {
            var html = _.template(modalTmpl)(_.pick(this, [ 'sureText', 'cancelText' ])), zIndex;

            // 如果存在遮罩元素，则不创建，反之则创建遮罩层元素
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

            this.$el.css({ 'z-index': zIndex + 1 }).html(html).appendTo(this.$parent);
            this.$el.find('.hd').append(this.$header);
            this.$el.find('.bd').append(this.$body);
        },

        stopPropagationHandle(e) {
            e.stopPropagation();
        },

        sureHandle: function (e) {
            this.sureCb();
            this.stopPropagationHandle(e);
        },

        cancelHandle: function (e) {
            this.cancelCb();
            this.stopPropagationHandle(e);
        }
    });
});