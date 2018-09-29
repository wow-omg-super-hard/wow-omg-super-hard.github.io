/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-11 21:49:14
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

// 定义骨架文件的路径
var SKELETON_PATH = '../cores/';
// 定义源文件的路径
var SRC_PATH = 'src/';

// 配置模块工具
requirejs.config({
    baseUrl: '..',
    paths: {
        // 配置骨架模块路径
        'promise': SKELETON_PATH + 'promise',
        'tween': SKELETON_PATH + 'tween',
        'anim': SKELETON_PATH + 'anim',
        'fetch': SKELETON_PATH + 'fetch',
        'flux': SKELETON_PATH + 'flux',
        'text': SKELETON_PATH + 'require.text',
        'jquery': SKELETON_PATH + 'jquery',
        'underscore': SKELETON_PATH + 'underscore',
        'backbone': SKELETON_PATH + 'backbone',

        // router
        'router': SRC_PATH + 'route/router',

        // view
        'IndexView': SRC_PATH + 'views/IndexView',
        'indexTmpl': SRC_PATH + 'templates/index',

        // components
        'DisplayCom': SRC_PATH + 'components/Services/Display/DisplayCom',
        'HeaderCom': SRC_PATH + 'components/Services/Header/HeaderCom',
        'headerTmpl': SRC_PATH + 'components/Services/Header/headerTmpl',
        'DisplayCom': SRC_PATH + 'components/Services/Display/DisplayCom',
        'EditElementCom': SRC_PATH + 'components/Services/EditElement/EditElementCom',
        'editElementTmpl': SRC_PATH + 'components/Services/EditElement/editElementTmpl',
        'PictureListCom': SRC_PATH + 'components/Services/PictureList/PictureListCom',
        'pictureListTmpl': SRC_PATH + 'components/Services/PictureList/pictureListTmpl',
        'PictureTagListCom': SRC_PATH + 'components/Services/PictureTagList/PictureTagListCom',
        'pictureTagListTmpl': SRC_PATH + 'components/Services/PictureTagList/pictureTagListTmpl',
        'ElementCom': SRC_PATH + 'components/Services/Element/ElementCom',
        'PictureElementCom': SRC_PATH + 'components/Services/PictureElement/PictureElementCom',
        'TextElementCom': SRC_PATH + 'components/Services/TextElement/TextElementCom',
        'StylePropCom': SRC_PATH + 'components/Services/StyleProp/StylePropCom',
        'stylePropTmpl': SRC_PATH + 'components/Services/StyleProp/stylePropTmpl',
        'AnimatePropCom': SRC_PATH + 'components/Services/AnimateProp/AnimatePropCom',
        'animatePropTmpl': SRC_PATH + 'components/Services/AnimateProp/animatePropTmpl',
        'DragCom': SRC_PATH + 'components/Ui/Drag/DragCom',
        'ResizeCom': SRC_PATH + 'components/Ui/Resize/ResizeCom',
        'TipCom': SRC_PATH + 'components/Ui/Tip/TipCom',
        'ModalCom': SRC_PATH + 'components/Ui/Modal/ModalCom',
        'modalTmpl': SRC_PATH + 'components/Ui/Modal/modalTmpl',

        // constants
        'elementsConstant': SRC_PATH + 'constants/elementsConstant',
        'picturesConstant': SRC_PATH + 'constants/picturesConstant',
        'pictureTagsConstant': SRC_PATH + 'constants/pictureTagsConstant',

        // actions
        'elementsAction': SRC_PATH + 'actions/elementsAction',
        'picturesAction': SRC_PATH + 'actions/picturesAction',
        'pictureTagsAction': SRC_PATH + 'actions/pictureTagsAction',

        // dispatcher
        'appDispatcher': SRC_PATH + 'dispatcher/appDispatcher',

        // store
        'superStore': SRC_PATH + 'stores/superStore',
        'elementsStore': SRC_PATH + 'stores/elementsStore',
        'picturesStore': SRC_PATH + 'stores/picturesStore',
        'pictureTagsStore': SRC_PATH + 'stores/pictureTagsStore',

        // model
        'HomePageModel': SRC_PATH + 'models/HomePageModel'
    } 
});

// 路由定义
require([ 'backbone', 'router' ], function (Bb, router) {
    new (Bb.Router.extend(router));
    Bb.history.start({ pushState: true });    
}); 