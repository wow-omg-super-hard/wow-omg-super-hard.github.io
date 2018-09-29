/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-19 02:43:04
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 
    'backbone',
    'underscore',
    'picturesStore',
    'elementsAction',
    'PictureTagListCom',
    'PictureListCom',
    'ModalCom',
    'DragCom',
    'ResizeCom',
    'HomePageModel',
    'text!headerTmpl.html'
    ], 
    function (
        Bb,
        _,
        picturesStore,
        elementsAction,
        PictureTagListCom,
        PictureListCom,
        ModalCom,
        DragCom,
        ResizeCom,
        HomePageModel,
        headerTmpl
    ) {
        return Bb.View.extend({
            initialize: function (options) {
                options || (options = {});

                this.$parent = Bb.$(options.parent || document.body);
                this.headerTmpl = headerTmpl;
                this.pictureTagListCom = this.pictureListCom = this.modalCom = this.dragCom = null;
                // 绑定model
                this.model.onModalChange(_.bind(function (visible) {
                    if (visible) {
                        this.initPictureElementModal();   
                    } else {
                        this.hidePictureElementModal();
                    }
                }, this));
            },

            model: new HomePageModel,

            className: 'header-inner',

            events: {
                'click .element-picture': 'showElementModalHandle',
                'click .element-text': 'createElementHandle',   
                'click .preview': 'previewHandle'
            },

            showElementModalHandle: function (e) {
                this.model.toggleModal(true);
                e.stopPropagation();
            },

            createElementHandle: function (e) {
                elementsAction.unSelectedAllElement();
                ResizeCom.removeAnchors('.element-pitch');
                elementsAction.createElement('文本', 'text', '', '双击编辑文本', 235, 50);
                e.stopPropagation();
            },

            previewHandle: function (e) {
                alert('预览');
                e.stopPropagation();
            },

            sureHandle: function () {
                var picture = picturesStore.find({ status: 'active' });

                // 如果选中了一个图片，那么就创建图片元素
                if (picture) {
                    elementsAction.unSelectedAllElement();
                    ResizeCom.removeAnchors('.element-pitch');
                    elementsAction.createElement('图片', 'picture', picture.thumb, '', 504, 795);
                }

                this._hidePictureElementModal();
            },

            cancelHandle: function () {
                this._hidePictureElementModal();
            },

            render: function () {
                this.$el.html(this.headerTmpl).appendTo(this.$parent);
            },

            _hidePictureElementModal: function (e) {
                this.model.toggleModal(false);
            },

            initPictureElementModal: function () {
                this.pictureTagListCom = new PictureTagListCom;
                this.pictureListCom = new PictureListCom;
                this.modalCom = new ModalCom({
                    sureCb: _.bind(this.sureHandle, this),
                    cancelCb: _.bind(this.cancelHandle, this),
                    header: this.pictureTagListCom.$el,
                    body: this.pictureListCom.$el
                });
                this.modalCom.render();
                this.dragCom = new DragCom({
                    el: this.modalCom.$('.modal-content')
                });
            },

            hidePictureElementModal: function () {
                this.pictureTagListCom.remove();
                this.pictureListCom.remove();
                this.modalCom.remove();
                this.dragCom.remove();
            }
        });
});
