/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-21 07:53:10
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'backbone', 'underscore' ], function (Bb, _) { 
    var items = [
                {
                    url: '/statics/imgs/chuan.png',
                    tagName: '我的图片',
                    sign: 0
                },
                {
                    url: '/statics/imgs/dh.png',
                    tagName: '我的图片',
                    sign: 0,
                },
                {
                    url: '/statics/imgs/dq.png',
                    tagName: '我的图片',
                    sign: 0
                },
                {
                    url: '/statics/imgs/fw.png',
                    tagName: '节日',
                    sign: 1
                },
                {
                    url: '/statics/imgs/gw.png',
                    tagName: '节日',
                    sign: 1
                },
                {
                    url: '/statics/imgs/hs.png',
                    tagName: '风景',
                    sign: 2
                },
                {
                    url: '/statics/imgs/hua.png',
                    tagName: '风景',
                    sign: 2
                },
                {
                    url: '/statics/imgs/ks.png',
                    tagName: '简约',
                    sign: 3
                },
                {
                    url: '/statics/imgs/my.png',
                    tagName: '简约',
                    sign: 3
                },
                {
                    url: '/statics/imgs/pgy.png',
                    tagName: '生活',
                    sign: 4
                },
                {
                    url: '/statics/imgs/qiao.png',
                    tagName: '科技',
                    sign: 5
                },
                {
                    url: '/statics/imgs/tk.png',
                    tagName: '商务',
                    sign: 6
                },
                {
                    url: '/statics/imgs/ych.png',
                    tagName: '其他',
                    sign: 7
                }
        ];
    return _.extend({}, Bb.Events, {
        items: [],

        findAll: function (sign) {
            var temp = _.filter(items, function (item) { return item.sign === sign });
            this.items = _.map(temp, function (item, index) {
                return _.extend({
                    id: _.uniqueId(),
                    url: '上传地址',
                    thumb: item.url,
                    tagName: item.tagName,
                    sign: item.sign
                }, { status: 'pending' });
            });
            this.trigger('init', this.items);
        },

        find: function (where) {
            return _.findWhere(this.items, where);
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

            this.trigger('change', this.items, updated);
        },

        onInit: function (cb) {
            this.on('init', _.bind(function (items) {
                cb(items);
            }, this));
        },

        onChange: function (cb) {
            this.on('change', function (items, updated) {
                cb(items, updated);
            });
        }
    });
});