/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-22 09:35:58
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 
    'backbone', 
    'underscore',
    'text!pictureListTmpl.html',
    'picturesAction',
    'picturesStore'
    ], 
    function (
        Bb, 
        _,
        pictureListTmpl,
        picturesAction,
        picturesStore
    ) {
        return Bb.View.extend({
            initialize: function () {
                // 绑定store
                picturesStore.onInit(_.bind(this.render, this));
                picturesStore.onChange(_.bind(this.render, this));
                // 加载图片
                picturesAction.loadPictures(0);
            },

            className: 'picture-list',

            events: {
                'click li': 'selectedHandle'
            },

            templateFunc: _.template(pictureListTmpl),

            selectedHandle: function (e) {
                picturesAction.selectedPicture(Bb.$(e.target).attr('data-pid'));
                e.stopPropagation();
            },

            render: function (pictures) {
                this.$el.html(this.templateFunc({ pictures: pictures }));
            }
        });
});