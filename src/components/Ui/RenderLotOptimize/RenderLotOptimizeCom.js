/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-18 03:58:18
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'backbone' ], function (Bb) {
    var noop = function () {};

    return Bb.View.extend({
        initialize: function (options) {
            var delta, $firstChild, marginTop, marginBottom;
            options || (options = {});

            this.$parent = options.parent ? Bb.$(options.parent) : $(document.body);
            this.$el = Bb.$(options.el);

            $firstChild = this.$el.children().first();

            this.data = {
                // 显示一个子元素的高度，用来计算当前元素可以放置多少个子元素
                delta: $firstChild.outerHeight() 
                    + (isNaN(marginTop = parseInt($firstChild.css('margin-top'))) ? 0 : marginTop)
                    + (isNaN(marginBottom = parseInt($firstChild.css('margin-bottom'))) ? 0 : marginBottom)
                // 当前元素可以显示多少个子元素的索引
                maxIndex: Math.floor(this.$el.height() / delta),
                // 显示最小元素索引
                minIndex: 0
            };

            if (this.$el.css('position') !== 'relative') {
                this.$el.css('position', 'relative');
            }

            this.$el.children().hide();

            // 开始显示
            this.scrollHandle();
        },

        events: {
            'scroll': 'scrollHandle'
        },

        scrollHandle: function () {
            var currIndex = this.$el.scrollTop() / this.data.delta;

            this.data.minIndex = currIndex;
            this.data.maxIndex += currIndex;

            this.setAreaChilds();
            this.hideAreaChilds();
        },

        render: function () {},

        setAreaChilds: function () {
            var minIndex = this.data.minIndex, maxIndex = this.data.maxIndex, $childs = this.$el.children(), $child; 

            for (; minIndex <= maxIndex; minIndex++)  {
                // 设置子元素的索引属性
                // 设置子元素的top
                // 如果子元素没有定义绝对定位，则设置，否则当隐藏的时候，会出现抖动，

                $child = $childs.eq(minIndex);

                if ($child.attr('data-index') == null) {
                    $child.attr('data-index', minIndex);
                }

                if (isNaN($child.css('top'))) {
                    $child.css('top', minIndex * this.data.delta);
                }

                if ($child.css('position') !== 'absolute') {
                    $child.css('position', 'absolute');
                }
            }
        },

        hideAreaChilds: function () {
            var $childs = this.$el.children(), index;

            Bb.$.each($childs, Bb.proxy(function (none, $el) {
                index = parseInt($el.attr('index'));

                if (index < this.data.minIndex || index > this.data.maxIndex) {
                    $el.hide();
                } else {
                    $el.show();
                }
            }, this));
        }   
    });
});