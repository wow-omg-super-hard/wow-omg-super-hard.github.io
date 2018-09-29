/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-17 17:29:26
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'backbone' ], function (Bb) {
    var noop = function () {};

    return Bb.View.extend({
        initialize: function (options) {
            options || (options = {});

            this.$parent = options.parent ? Bb.$(options.parent) || $(document.body);
            this.onToBottomCb = options.onToBottomCb || noop;
        },

        events: {
            'scroll': 'scrollHandle'
        },

        scrollHandle: function () {
            if (this.checkToBottom()) {
                this.onToBottomCb();
            }
        },

        render: function () {
            // 得到子元素的高度
            var $temp, height;

            $temp = this.$el.children().first().clone();
            Bb.$(document.body).append($temp);
            height = $temp.outerHeight();
            $temp.remove();

            // 设置height和overflow:hidden等CSS属性
            this.$el.css({
                height: height,
                overflow: 'auto'
            });
        },

        checkToBottom: function () {
            return this.$el.scrollTop() + height >= this.$el.prop('scrollHeight');
        }
    });    
});