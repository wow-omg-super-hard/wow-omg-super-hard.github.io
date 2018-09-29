/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-19 12:14:59
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 
    'backbone',
    'underscore',
    'elementsAction',
    'elementsStore',
    'PictureElementCom',
    'TextElementCom',
    'ResizeCom'
    ], 
    function (
        Bb, 
        _,
        elementsAction,
        elementsStore,
        PictureElementCom,
        TextElementCom,
        ResizeCom
    ) {
        return Bb.View.extend({
            initialize: function (options) {
                options || (options = {});

                this.$parent = Bb.$(options.parent || document.body);
                this.elementsCom = [];
                this.renderElementHandle = _.bind(this.renderElementHandle, this);
                this.removeElementHandle = _.bind(this.removeElementHandle, this);
                this.keyupHandle = _.bind(this.keyupHandle, this);
                this.cancelAllElementSelectedHandle = _.bind(this.cancelAllElementSelectedHandle, this);
                this.updateWidthPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$el.width(value); }), this);
                this.updateHeightPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$el.height(value); }), this);
                this.updateLeftPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$el.css('left', value); }), this);
                this.updateTopPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$el.css('top', value); }), this);
                this.updateVisibilityPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$el.css('visibility', value); }), this);
                this.updateOpacityPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$el.css('opacity', value);  }), this);
                this.updateRotatePropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { 
                    var transforms = elementCom.el.style.transform.trim().split(' ');
                    var index = _.findIndex(transforms, function (item) { return item.indexOf('rotate') >= 0 });

                    if (index < 0) {
                        transforms.push('rotate('+ value +'deg)');
                    } else {
                        transforms[ index ] = 'rotate('+ value +'deg)';    
                    }

                    elementCom.el.style.transform = transforms.join(' ');
                }), this);

                elementsStore.onPropMapChange({
                    'style.width': this.updateWidthPropHandle,
                    'style.height': this.updateHeightPropHandle,
                    'style.left': this.updateLeftPropHandle,
                    'style.top': this.updateTopPropHandle,
                    'style.visibility': this.updateVisibilityPropHandle,
                    'style.opacity': this.updateOpacityPropHandle,
                    'style.rotate': this.updateRotatePropHandle,
                });
                // 监听elementsStore create事件
                elementsStore.onCreate(this.renderElementHandle);                
                // 监听elementsStore delete事件
                elementsStore.onDelete(this.removeElementHandle);
                
                Bb.$(document).bind('keyup', this.keyupHandle);
            },

            className: 'display-actual-canvas',

            events: {
                'click': 'cancelAllElementSelectedHandle'
            },

            updatePropHandle: function (updateHandle) {
                return function (updated, value) {
                   var elementCom = _.findWhere(this.elementsCom, { id: updated.id });
                   updateHandle(elementCom, value); 
                };
            },

            cancelAllElementSelectedHandle: function () {
                elementsAction.unSelectedAllElement();
                ResizeCom.removeAnchors('.element-pitch');
            },  

            keyupHandle: function (e) {
                var pictureElementCom;

                // 按下了del键
                if (e.keyCode == 46) {
                    // 到elementsStore查找status=active的，如果存在，则证明选中了某个pictureElement
                    this.removeElement();
                }
            },

            renderElementHandle: function (created) {
                var elementCom = null;

                if (created.type === 'text') {
                    elementCom = new TextElementCom({
                        parent: this.$el,
                        props: created
                    });
                } else {
                    elementCom = new PictureElementCom({
                        parent: this.$el,
                        props: created
                    });
                }
 
                elementCom.render();
                this.elementsCom.push(elementCom);
            },

            removeElementHandle: function (deleted) {
                var deletedIndex = _.findIndex(this.elementsCom, function (elementCom) { return elementCom.id === deleted.id });
                var deletedCom = this.elementsCom[ deletedIndex ];
                
                deletedCom.remove();
                this.elementsCom.splice(deletedIndex, 1);
            },

            remove: function () {
                var originalRemove = this.constructor.__super__.remove;

                originalRemove.call(this);
                Bb.$(document).unbind('keyup', this.keyupHandle)
            },

            render: function () {
                this.$el.appendTo(this.$parent);
            },

            removeElement: function () {
                var elementStore = elementsStore.find({ status: 'active' });

                if (elementStore) {
                    elementsAction.deleteElement(elementStore.id);
                }
            }
        });
});