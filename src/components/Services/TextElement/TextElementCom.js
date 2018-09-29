/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-23 21:09:18
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'ElementCom', 'elementsAction' ], function (ElementCom, elementsAction) {
    return ElementCom.extend({
        className: ElementCom.prototype.className + ' ' + 'text-element-pitch'
    });
});