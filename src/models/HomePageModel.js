/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-21 17:31:23
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'backbone', 'underscore' ], function (Bb, _) {
    return Bb.Model.extend({
        defaults: function () {
            return {
                modal_visible: false,
                tip_visible: false,
                element_prop_panel_visibility: 'style'
            };
        },

        // 验证
        validate: function (props) {
            if (props == null) {
                return true;
            }

            // 判断props的value是否是bool或string
            if (!_.every(_.values(props), function (value) { return typeof value === 'boolean' || typeof value === 'string' })) {
                return true;
            }

            // props的key是否存在于model的attribute中
            if (_.findKey(
                    props, 
                    _.bind(function (none, key) { return _.has(this.toJSON(), key) }, this)
                ) == null) 
            {
                return true;
            }

            return false;
        },

        onModalChange: function (cb) {
            this.on('change', function (model) {
                cb(model.get('modal_visible'));
            });
        },

        onTipChange: function (cb) {
            this.on('change', function (model) {
                cb(model.get('tip_visible'));
            });
        },

        onElementPropPanelChange: function (cb) {
            this.on('change:element_prop_panel_visibility', function (none, updatedValue) {
                cb(updatedValue);
            });
        },

        toggleModal: function (visible) {
            this.set('modal_visible', visible, { validate: true });
        },

        toggleTip: function (visible) {
            this.set('tip_visible', visible, { validate: true });
        }
    });
});