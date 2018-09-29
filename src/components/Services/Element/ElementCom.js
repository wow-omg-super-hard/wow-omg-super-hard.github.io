/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-25 18:46:13
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define(
    [
        'backbone',
        'underscore',
        'elementsAction',
        'elementsStore',
        'DragCom',
        'ResizeCom'
    ],
    function (
        Bb,
        _,
        elementsAction,
        elementsStore,
        DragCom,
        ResizeCom
    ) {
        return Bb.View.extend({
            initialize: function (options) {
                options || (options = {});

                this.$parent = Bb.$(options.parent || document.body);
                this.dragCom = this.resizeCom = null;

                _.extend(this, _.pick(options.props, [ 'id', 'name', 'type', 'url', 'content', 'style', 'animate' ]));
            },

            className: 'element-pitch',

            events: {
                'dblclick': 'editHandle'
            },

            editHandle: function () {
                if (this.type === 'text') {
                    this.selectText();
                }  
            },

            renderContent: function () {
                if (this.type === 'text') {
                    Bb.$('<div class="inner"><span contenteditable>'+ this.content +'</span></div>').appendTo(this.$el);
                } else {
                    Bb.$('<div class="inner" title="双击编辑图片"><img src="'+ this.url +'" /></div>').appendTo(this.$el);
                }
            },

            render: function () {
                this.renderContent();
                this.$el
                    .css({
                        width: this.style.width,
                        height: this.style.height,
                        lineHeight: this.style.height + 'px',
                        left: this.style.left,
                        top: this.style.top,
                        opacity: this.style.opacity,
                        transform: 'rotate('+ this.style.rotate +'deg)'
                    })
                    .appendTo(this.$parent);
                
                // 绑定交互组件
                this.dragCom = new DragCom({
                    el: this.$el,
                    onDragStart: _.bind(function () {
                        elementsAction.unSelectedAllElement();
                        elementsAction.selectedElement(this.id);
                    }, this),
                    onDrag: _.bind(function (x, y) {
                        this.setResize(true);
                        elementsAction.updateElement(this.id, { 
                            style: { 
                                left: x, 
                                top: y 
                            } 
                        })
                    }, this),
                    onDragStop: _.bind(function () {
                        this.setResize(false);
                    }, this)
                });

                this.resizeCom = new ResizeCom({
                    el: this.$el,
                    onDrag: _.bind(function (width, height) {
                        this.setDrag(true);

                        elementsAction.updateElement(this.id, { 
                            style: { 
                                width: width, 
                                height: height 
                            } 
                        });
                    }, this),
                    onDragStop: _.bind(function () {
                        this.setDrag(false);
                    }, this)
                });
            },

            setDrag: function (disabled) {
                this.dragCom.disabled = disabled;
            },

            setResize: function (disabled) {
                this.resizeCom.disabled = disabled;
            },

            selectText: function () {
                var selection = getSelection();
                var range = document.createRange();
                range.selectNodeContents(this.$('.inner > span')[0]);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }
)