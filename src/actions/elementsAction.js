/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-21 08:08:59
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'elementsConstant', 'appDispatcher' ], function (elementsConstant, appDispatcher) {
    return {
        createElement: function (name, type, url, content, width, height) {
            appDispatcher.dispatch({
                type: elementsConstant.CREATE_ELEMENT,
                payload: {
                    name: name,
                    type: type,
                    url: url,
                    content: content,
                    width: width,
                    height: height
                }
            });
        },

        updateElement: function (id, payload) {
            appDispatcher.dispatch({
                type: elementsConstant.UPDATE_ELEMENT_PROP,
                id: id,
                payload: payload
            });
        },

        selectedElement: function (id) {
            appDispatcher.dispatch({
                type: elementsConstant.SELECTED_ELEMENT,
                id: id,
                payload: {
                    status: 'active'
                }
            });
        },

        unSelectedAllElement: function () {
            appDispatcher.dispatch({
                type: elementsConstant.UNSELECTED_ALL_ELEMENT,
                payload: {
                    status: 'pending'
                }
            });
        },

        deleteElement: function (id) {
            appDispatcher.dispatch({
                type: elementsConstant.DELETE_ELEMENT,
                id: id
            });
        }
    };
});