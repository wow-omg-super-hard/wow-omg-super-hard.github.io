/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-20 20:00:06
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 
        'flux', 
        'picturesConstant',
        'pictureTagsConstant',
        'elementsConstant',
        'picturesStore', 
        'pictureTagsStore', 
        'elementsStore'
    ], 
    function (
        flux, 
        picturesConstant,
        pictureTagsConstant,
        elementsConstant,
        picturesStore, 
        pictureTagsStore, 
        elementsStore
    )   {
        var dispatcher = new (flux.Dispatcher);

        // 定义dispatcher注册的callbacks
        dispatcher.register(function (action) {
            switch (action.type) {
                // 图片上传
                case picturesConstant.UPLOAD:
                    break;

                // 根据图片标签查找图片列表
                case picturesConstant.LOAD_PICTURES:
                    picturesStore.findAll(action.sign);
                    break; 

                // 选中某张图片
                case picturesConstant.SELECTED_PICTURE:
                    picturesStore.update(action.payload.pending);
                    picturesStore.update(action.id, action.payload.active);
                    break;

                // 查找所有图片标签
                case pictureTagsConstant.LOAD_PICTURE_TAGS:
                    pictureTagsStore.findAll();
                    break;

                // 选中某个图片标签
                case pictureTagsConstant.SELECTED_PICTURE_TAG:
                    pictureTagsStore.update(action.payload.pending);
                    pictureTagsStore.update(action.tagId, action.payload.active);
                    break;

                // 创建元素
                case elementsConstant.CREATE_ELEMENT:
                    elementsStore.create(action.payload.name, action.payload.type, action.payload.url, action.payload.content, action.payload.width, action.payload.height);
                    break;

                // 修改元素
                case elementsConstant.UPDATE_ELEMENT_PROP:
                    elementsStore.update(action.id, action.payload);
                    break;

                // 删除元素
                case elementsConstant.DELETE_ELEMENT:
                    elementsStore.delete(action.id);
                    break; 

                // 选中图片元素
                case elementsConstant.SELECTED_ELEMENT:
                    elementsStore.update(action.id, action.payload);
                    break;

                //取消选中所有元素
                case elementsConstant.UNSELECTED_ALL_ELEMENT:
                    elementsStore.update(action.payload);
                    break;
            }
        });

        return dispatcher;
    }
);