/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-21 07:31:57
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'picturesConstant', 'appDispatcher' ], function (picturesConstant, appDispatcher) {
    return {
        upload: function (url, name) {
            appDispatcher.dispatch({
                type: picturesConstant.UPLOAD,
                payload: {
                    url: url,    
                    name: name
                }
            });
        },

        loadPictures: function (sign) {
            appDispatcher.dispatch({
                type: picturesConstant.LOAD_PICTURES,
                sign: sign,
                payload: {}
            });
        },

        selectedPicture: function (id) {
            appDispatcher.dispatch({
                type: picturesConstant.SELECTED_PICTURE,
                id: id,
                payload: {
                    active: { status: 'active' },
                    pending: { status: 'pending' } 
                }
            });
        }
    };
});