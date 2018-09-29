/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-19 02:07:55
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 
    'backbone', 
    'underscore',
    'elementsStore',
    'HomePageModel',
    'text!indexTmpl.html',
    'HeaderCom',
    'DisplayCom',
    'EditElementCom'
    ],
    function (
        Bb, 
        _, 
        elementsStore,
        HomePageModel,
        tmpl, 
        HeaderCom, 
        DisplayCom, 
        EditElementCom
    ) {
        return Bb.View.extend({
            initialize: function (options) {
                this.$parent = Bb.$(options.parent || document.body);
                this.editElementCom = null;
                this.updateEditElementHandle = _.bind(this.updateEditElementHandle, this);
                this.renderEditElement = _.bind(this.renderEditElement, this);
                this.removeEditElement = _.bind(this.removeEditElement, this);
                this.updateWidthPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$('.w').val(value); }), this);
                this.updateHeightPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$('.h').val(value); }), this);
                this.updateLeftPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$('.x').val(value); }), this);
                this.updateTopPropHandle = _.bind(this.updatePropHandle(function (elementCom, value) { elementCom.$('.y').val(value); }), this);
                this.homePageModel = new HomePageModel();
                this.homePageModel.onElementPropPanelChange(this.updateEditElementHandle);

                // 当生成了元素数据，元素数据面板组件也得生成
                elementsStore.onCreate(this.renderEditElement);
                elementsStore.onPropMapChange({
                    'status': this.renderEditElement,
                    'style.width': this.updateWidthPropHandle,
                    'style.height': this.updateHeightPropHandle,
                    'style.left': this.updateLeftPropHandle,
                    'style.top': this.updateTopPropHandle
                });
                elementsStore.onChange(this.removeEditElement);
                // 删除该条元素数据，元素面板也得删除
                elementsStore.onDelete(this.removeEditElement);
            },

            updatePropHandle: function (updateHandle) {
                return function (none, value) {
                   updateHandle(this.editElementCom, value); 
                };
            },

            updateEditElementHandle: function (updatedValue) {
                this.editElementCom.$('.tabitem')
                    .removeClass('active')
                    .filter('[data-visibility="'+ updatedValue +'"]')
                    .addClass('active');
                this.editElementCom.$('.props-bd-tab')
                    .children()
                    .hide()
                    .filter('[data-visibility="'+ updatedValue +'"]')
                    .show();
            },

            renderHeader: function () {
                this.headerCom = new HeaderCom({
                    parent: this.$('header')
                });
                this.headerCom.render();            
            },

            renderDisplay: function () {
                this.displayCom = new DisplayCom({
                    parent: this.$('.display')
                });
                this.displayCom.render();
            },

            renderEditElement: function (props) {
                this.removeEditElement();    
                this.editElementCom = new EditElementCom({
                    parent: this.$('.edit-panel'),
                    model: this.homePageModel,
                    props: props
                });

                this.editElementCom.render();
            },

            removeEditElement: function (props) {
                if (props == null && this.editElementCom != null) {
                    this.editElementCom.remove();
                    this.editElementCom = null;
                }
            },

            render: function () {
                this.$el.html(tmpl).appendTo(this.$parent);
                this.renderHeader();
                this.renderDisplay();
            }
        });
    }
);