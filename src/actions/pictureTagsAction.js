/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-21 07:31:35
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'appDispatcher', 'pictureTagsConstant' ], function (appDispatcher, pictureTagsConstant) {
    return {
        loadPictureTags: function () {
            appDispatcher.dispatch({
                type: pictureTagsConstant.LOAD_PICTURE_TAGS,
                payload: {}    
            });
        },

        selectedPictureTag: function (tagId) {
            appDispatcher.dispatch({
                type: pictureTagsConstant.SELECTED_PICTURE_TAG,
                tagId: tagId,
                payload: {
                   active: { status: 'active' },
                   pending: { status: 'pending' } 
                }
            });
        }
    };
});