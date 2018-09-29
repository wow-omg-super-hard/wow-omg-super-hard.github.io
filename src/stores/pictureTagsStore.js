/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-21 07:53:50
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'backbone', 'underscore' ], function (Bb, _) {
    return _.extend({}, Bb.Events, {
        items: [],

        findAll: function () {
            var temp = [
                '我的图片',
                '节日',
                '风景',
                '简约',
                '生活',
                '科技',
                '商务',
                '其他'
            ];
            this.items = _.map(temp, function (name, index) {
                return _.extend({
                    id: _.uniqueId(),
                    name: name,
                    sign: index,
                    description: name
                }, { status: !index ? 'active' : 'pending' });
            });
            this.trigger('init');
        },

        update: function (id, payload) {
            var updateIndex, updated;

            // 修改数组中的全部
            if (typeof id === 'object') {
                payload = id;
                id = void 0;
            }

            if (id == null) {
                this.items = _.map(this.items, function (item) {
                    return _.extend({}, item, payload);
                });
            } else {
                updateIndex = _.findIndex(this.items, function (item) { return item.id === id });

                if (updateIndex < 0) {
                    return;
                }

                updated = _.extend({}, this.items[ updateIndex ], payload);

                this.items = _.union(this.items.slice(0, updateIndex), [ updated ], this.items.slice(updateIndex + 1));
            }

            this.triggerChange('change');
        },

        onChange: function (cb) {
            this.on('change', _.bind(function (value) {
                cb(this.items);
            }, this));
        },

        onInit: function (cb) {
            this.on('init', _.bind(function () {
                cb(this.items);
            }, this));
        },

        triggerChange: function (evtName) {
            this.trigger(evtName);
        }
    });
});