/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-15 19:26:25
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'backbone', 'underscore' ], function (Bb, _) {
    var noop = function () {};

    return Bb.View.extend({
        constructor: function (options) {
            options || (options = {});

            this.anchorStyle = {
                'display': 'none',
                'position': 'absolute',
                'width': '8px',
                'height': '8px',
                'border': '2px solid #1abc9c',
                'box-sizing': 'border-box',
                'z-index': 9999
            };
            this.anchors = {
                // 对角线的4个点
                '.top-left': 'topLeftDragStartHandle',
                '.top-right': 'topRightDragStartHandle',
                '.bottom-left': 'bottomLeftDragStartHandle',
                '.bottom-right': 'bottomRightDragStartHandle',

                // 方向上的中间4个点
                '.top-middle': 'topMiddleDragStartHandle',
                '.bottom-middle': 'bottomMiddleDragStartHandle',
                '.left-middle': 'leftMiddleDragStartHandle',
                '.right-middle': 'rightMiddleDragStartHandle'
            };
            this.status = 'pending';
            // 如果其他交互组件也实现了拖拽，那么如果其他组件注册了document的mousemove事件，调用时也会触发到本组件注册的document的mousemove事件
            this.disabled = false;
            this.action = '';
            this.offsetWidth = this.offsetHeight = this.offsetX = this.offsetY = this.dragStartX = this.dragStartY = this.dragX = this.dragY = 0;
            this.dragHandle = _.bind(this.dragHandle, this);
            this.dragStopHandle = _.bind(this.dragStopHandle, this);

            this.constructor.__super__.constructor.call(this, options);
        },

        initialize: function (options) {
            var left, top;

            this.onDragStart = options.onDragStart || noop;
            this.onDrag = options.onDrag || noop;
            this.onDragStop = options.onDragStop || noop;

            $(document)
                .bind('mousemove', this.dragHandle)
                .bind('mouseup', this.dragStopHandle);

            this.render();
            this.setPos(this.$el.position().left, this.$el.position().top);
        },

        events: function () {
            var res = { click: 'addAnchorsHandle' };

            _.each(this.anchors, function (value, key) {
                res[ 'mousedown ' + key ] = value;
            });

            return res;
        },

        remove: function () {
            var originalRemove = this.constructor.__super.remove;

            originalRemove();
            $(document)
                .unbind('mousemove', this.dragHandle)
                .unbind('mouseup', this.dragStopHandle)
        },

        addAnchorsHandle: function (e) {
            this.constructor.removeAnchors('.' + this.$el.attr('class').split(' ')[ 0 ]);
            this.$el
                .css('border-color', '#1abc9c')
                .find('.anchor')
                .show();
            e && e.stopPropagation();
        },

        dragHandle: function (e) {
            var moveX, moveY;

            if (this.status === 'drag' && !this.disabled) {
                this.dragX = e.clientX;
                this.dragY = e.clientY;
                moveX = this.dragX - this.dragStartX;
                moveY = this.dragY - this.dragStartY;

                if (this.action === 'TOP_LEFT') {
                    this.stretch(this.offsetWidth - moveX, this.offsetHeight - moveY);
                    this.move(this.offsetX + moveX, this.offsetY + moveY);
                    this.onDrag(this.offsetWidth - moveX, this.offsetHeight - moveY);
                } else if (this.action === 'TOP_RIGHT') {
                    this.stretch(this.offsetWidth + moveX, this.offsetHeight - moveY);
                    this.move(this.offsetX, this.offsetY + moveY);
                    this.onDrag(this.offsetWidth + moveX, this.offsetHeight - moveY);
                } else if (this.action === 'BOTTOM_LEFT') {
                    this.stretch(this.offsetWidth - moveX, this.offsetHeight + moveY);
                    this.move(this.offsetX + moveX, this.offsetY);
                    this.onDrag(this.offsetWidth - moveX, this.offsetHeight + moveY);
                } else if (this.action === 'BOTTOM_RIGHT') {
                    this.stretch(this.offsetWidth + moveX, this.offsetHeight + moveY);
                    this.move(this.offsetX, this.offsetY);
                    this.onDrag(this.offsetWidth + moveX, this.offsetHeight + moveY);
                } else if (this.action === 'TOP_MIDDLE') {
                    this.stretch(void 0, this.offsetHeight - moveY);            
                    this.move(this.offsetX, this.offsetY + moveY);
                    this.onDrag(this.offsetWidth, this.offsetHeight - moveY);

                    // 如果是下边的中点，则忽略水平方向
                    // 如果是像上托，就是减小高度，想下托就是增加高度
                } else if (this.action === 'BOTTOM_MIDDLE') {
                    this.stretch(void 0, this.offsetHeight + moveY);
                    this.onDrag(this.offsetWidth, this.offsetHeight + moveY);

                    // 如果是左边的中点，则忽略垂直方向
                    // 如果是向右托，就是减小宽度，向左托就是增加宽度
                } else if (this.action === 'LEFT_MIDDLE') {
                    this.stretch(this.offsetWidth - moveX);
                    this.move(this.offsetX + moveX, this.offsetY);
                    this.onDrag(this.offsetWidth - moveX, this.offsetHeight);

                    // 如果是向左托，就是减小宽度，向右托就是增加宽度
                } else if (this.action === 'RIGHT_MIDDLE') {
                    this.stretch(this.offsetWidth + moveX);
                    this.onDrag(this.offsetWidth + moveX, this.offsetHeight);
                }
            }
        },

        dragStopHandle: function (e) {
            if (this.status === 'drag' && !this.disabled) {
                if (this.action === 'TOP_LEFT' 
                    || this.action === 'TOP_RIGHT'
                    || this.action === 'BOTTOM_LEFT'
                    || this.action === 'BOTTOM_RIGHT') {
                    this.offsetWidth = this.$el.width();
                    this.offsetHeight = this.$el.height();
                } else if (this.action === 'TOP_MIDDLE' || this.action === 'BOTTOM_MIDDLE') {
                    this.offsetHeight = this.$el.height();
                } else if (this.action === 'LEFT_MIDDLE' || this.action === 'RIGHT_MIDDLE') {
                    this.offsetWidth = this.$el.width();
                }

                this.status = 'pending';
                this.setPos(this.$el.position().left, this.$el.position().top);
                this.onDragStop(this.offsetWidth, this.offsetHeight);
            }
        },

        dragStartHandle: function (action, clientX, clientY, e) {
            if (this.status === 'pending' && !this.disabled) {
                this.offsetX = isNaN(parseFloat(this.$el.css('left'))) ? 0 : parseFloat(this.$el.css('left'));
                this.offsetY = isNaN(parseFloat(this.$el.css('top'))) ? 0 : parseFloat(this.$el.css('top'));
                this.offsetWidth = this.$el.width();
                this.offsetHeight = this.$el.height();
                this.dragStartX = clientX;
                this.dragStartY = clientY;
                this.onDragStart(this.offsetWidth, this.offsetHeight);
                this.action = action;
                this.status = 'drag'; 
                e.stopPropagation();
            }
        },

        topLeftDragStartHandle: function (e) {
            this.dragStartHandle('TOP_LEFT', e.clientX, e.clientY, e);
        },

        topRightDragStartHandle: function (e) {
            this.dragStartHandle('TOP_RIGHT', e.clientX, e.clientY, e);
        },

        bottomLeftDragStartHandle: function (e) {
            this.dragStartHandle('BOTTOM_LEFT', e.clientX, e.clientY, e);
        },

        bottomRightDragStartHandle: function (e) {
            this.dragStartHandle('BOTTOM_RIGHT', e.clientX, e.clientY, e);
        },

        topMiddleDragStartHandle: function (e) {
            this.dragStartHandle('TOP_MIDDLE', e.clientX, e.clientY, e);
        },

        bottomMiddleDragStartHandle: function (e) {
            this.dragStartHandle('BOTTOM_MIDDLE', e.clientX, e.clientY, e);
        },

        leftMiddleDragStartHandle: function (e) {    
            this.dragStartHandle('LEFT_MIDDLE', e.clientX, e.clientY, e);
        },

        rightMiddleDragStartHandle: function (e) {
            this.dragStartHandle('RIGHT_MIDDLE', e.clientX, e.clientY, e);
        },

        render: function () {
            var $fragment, $anchor, className, mergedStyle, tempEl;

            this.offsetWidth = this.$el.innerWidth();
            this.offsetHeight = this.$el.innerHeight();
    
            $fragment = $(document.createDocumentFragment());

            _.each(this.anchors, _.bind(function (none, key) {
                className = key.slice(1);
                $anchor = $('<span></span>', { class: 'anchor '+ className +'' });
 
                switch (className) {
                    case 'top-left':
                        mergedStyle = _.extend({}, this.anchorStyle, { left: -5, top: -5, cursor: 'nw-resize' });
                        break;
                    case 'top-right':
                        mergedStyle = _.extend({}, this.anchorStyle, { right: -5, top: -5, cursor: 'ne-resize' });
                        break;
                    case 'bottom-left':
                        mergedStyle = _.extend({}, this.anchorStyle, { left: -5, bottom: -5, cursor: 'sw-resize' });
                        break;
                    case 'bottom-right':
                        mergedStyle = _.extend({}, this.anchorStyle, { right: -5, bottom: -5, cursor: 'se-resize' });
                        break;
                    case 'top-middle':
                        mergedStyle = _.extend({}, this.anchorStyle, { left: '50%', transform: 'translateX(-50%)', top: -5, cursor: 'n-resize' });
                        break;
                    case 'bottom-middle':
                        mergedStyle = _.extend({}, this.anchorStyle, { left: '50%', transform: 'translateX(-50%)', bottom: -5, cursor: 's-resize' });
                        break;
                    case 'left-middle':
                        mergedStyle = _.extend({}, this.anchorStyle, { top: '50%', transform: 'translateY(-50%)', left: -5, cursor: 'w-resize' });
                        break;
                    case 'right-middle':
                        mergedStyle = _.extend({}, this.anchorStyle, { top: '50%', transform: 'translateY(-50%)', right: -5, cursor: 'e-resize' });
                        break;
                }
  
                $fragment.append($anchor.css(mergedStyle));
            }, this));

            this.$el.children().first().css('overflow', 'hidden');
            this.$el.css({ 
                'position': 'absolute', 
                'border': '2px solid transparent', 
                'box-sizing': 'border-box', 
                'display': 'inline-block', 
                'user-select': 'none'
            })
            .append($fragment);
            this.addAnchorsHandle();
        },

        stretch: function (width, height) {
            if (width != null) {
                this.$el.width(width).children().first().width(width);
            }

            if (height != null) {
                this.$el.height(height).children().first().height(height);
            }
        },

        move: function (left, top) {
            this.$el.css({ left: left, top: top });
        },

        setPos: function (x, y) {
            var translate;

            // 如果元素存在translate，因为jquery的position会以translate作为参考，所以最后得去掉
            if (/matrix/i.test(this.$el.css('transform'))) {
                translate = this.$el.css('transform').replace(/[^0-9,.-]/g, '').split(',').slice(-2);
            }

            this.offsetX = !translate ? x : x - parseFloat(translate[ 0 ]);
            this.offsetY = !translate ? y : y - parseFloat(translate[ 1 ]);
        }
    }, {
        removeAnchors: function (selector) {
            Bb.$(selector).css('border-color', 'transparent').find('.anchor').hide();
        }
    });
});