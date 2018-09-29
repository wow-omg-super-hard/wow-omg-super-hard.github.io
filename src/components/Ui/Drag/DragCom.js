/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-15 15:46:14
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'backbone', 'underscore' ], function (Bb, _) {
    var noop = function () {};

    return Bb.View.extend({
        initialize: function (options) {
            options || (options = {});
            this.onDragStart = options.onDragStart || noop;
            this.onDrag = options.onDrag || noop;
            this.onDragStop = options.onDragStop || noop;

            // 重新定义事件处理程序，为了在remove的时候能解绑document的事件
            this.dragStartHandle = _.bind(this.dragStartHandle, this);
            this.dragHandle = _.bind(this.dragHandle, this);
            this.dragStopHandle = _.bind(this.dragStopHandle, this);

            // 当前状态，如果是draging，那么才能触发drag和dragUp，否则只要是移动和mouseup都会执行
            this.status = 'pending';

            // 如果其他交互组件也实现了拖拽，那么如果其他组件注册了document的mousemove事件，调用时也会触发到本组件注册的document的mousemove事件
            this.disabled = false;
            
            // offset代表相对坐标，
            // move代表拖拽坐标
            // 最终坐标 = 相对坐标 + (拖拽时坐标 - 拖拽开始坐标) - native
            this.offsetX = this.offsetY = this.dragStartX = this.dragStartY = this.dragX = this.dragY = 0;

            // 初始化固有css样式
            this.$el.css({ 'position': 'relative', 'display': 'inline-block', 'user-select': 'none', 'cursor': 'move' });

            // document绑定mousemove和mouseup事件
            $(document)
                .bind('mousemove', this.dragHandle)
                .bind('mouseup', this.dragStopHandle);    
        },

        events: {
            mousedown: 'dragStartHandle'
        },

        remove: function () {
            var originalRemove = this.constructor.__super__.remove;
            
            originalRemove.call(this);
            $(document).unbind('mousemove', this.dragHandle).unbind('mouseup', this.dragStopHandle);
        },

        dragStartHandle: function (e) {
            var offset;

            if (this.status === 'pending' && !this.disabled) {
                offset = this.$el.offset();
                
                this.offsetX = isNaN(parseFloat(this.$el.css('left'))) ? 0 : parseFloat(this.$el.css('left'));
                this.offsetY = isNaN(parseFloat(this.$el.css('top'))) ? 0 : parseFloat(this.$el.css('top'));
                this.dragStartX = e.clientX;
                this.dragStartY = e.clientY;
                this.status = 'draging';
                this.onDragStart(offset.left, offset.top);
                e.stopPropagation();
            }
        },

        dragHandle: function (e) {
            var finalX, finalY;

            if (this.status === 'draging' && !this.disabled) {
                this.dragX = e.clientX;
                this.dragY = e.clientY;
                finalX = this.offsetX + (this.dragX - this.dragStartX);
                finalY = this.offsetY + (this.dragY - this.dragStartY);
                
                this.move(finalX, finalY);
                this.onDrag(finalX, finalY);
            }
        },

        dragStopHandle: function (e) {            
            if (this.status === 'draging' && !this.disabled) {

                this.offsetX = parseFloat(this.$el.css('left'));
                this.offsetY = parseFloat(this.$el.css('top'));
                this.status = 'pending';

                this.onDragStop(this.offsetX, this.offsetY);
            }
        },

        move: function (x, y) {
            // var transformStr = this.el.style.transform;
            // var index = transformStr.indexOf('translate');
            // var length, translateStr;

            // if (index >= 0) {
            //     translateStr = transformStr.slice(index);
            //     translateStr = translateStr.slice(0, translateStr.indexOf(')') + 1);
            //     length = translateStr.length;
            //     transformStr = transformStr.slice(0, index) + ' translate('+ x +'px,'+ y +'px) ' + transformStr.slice(index + length);
            // } else {
            //     transformStr += ' ' + 'translate('+ x +'px,'+ y +'px)';
            // }
            this.$el.css({
                left: x,
                top: y
            });
            //this.$el.css('transform', transformStr);
        }
    });
});