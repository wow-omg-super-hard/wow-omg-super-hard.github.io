/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-22 09:36:24
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 
    'backbone', 
    'underscore',
    'text!pictureTagListTmpl.html', 
    'pictureTagsAction',
    'picturesAction',
    'pictureTagsStore' 
    ], 
    function (
        Bb, 
        _,
        pictureTagListTmpl, 
        pictureTagsAction,
        picturesAction,
        pictureTagsStore
    ) {
        return Bb.View.extend({
            initialize: function () {
                // 绑定store change事件
                pictureTagsStore.onChange(_.bind(this.render, this));
                // 绑定store init事件
                pictureTagsStore.onInit(_.bind(this.render, this));
                // 取得所有图片标签
                pictureTagsAction.loadPictureTags();
            },

            className: 'picture-tag-list flex-row',

            tagName: 'ul',

            templateFunc: _.template(pictureTagListTmpl),

            events: {
                'click a': 'selectedTagHandle'
            },

            selectedTagHandle: function (e) {
                // 选中图片标签
                pictureTagsAction.selectedPictureTag(Bb.$(e.target).attr('data-tagid'));
                picturesAction.loadPictures(Bb.$(e.target).data('sign'));
                // 显示对应的图片列表
                e.stopPropagation();
            },

            render: function (tags) {
                this.$el.html(this.templateFunc({ tags: tags }));
            }
        });
    }
);