/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-25 17:30:02
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

 define([ 'backbone', 'underscore' ], function (Bb, _) {
    return _.extend({}, Bb.Events, {
        items: [],

        delete: function (id) {
            var prediate = typeof id !== 'function' ? function (item) { return item.id === id } : id;
            var deleteIndex = _.findIndex(this.items, prediate);
            var deleted = this.items[ deleteIndex ];

            this.items = _.union(this.items.slice(0, deleteIndex), this.items.slice(deleteIndex));
            this.trigger('delete', deleted);
        },

        merge: function (target, source) {
            var res = {}, original;

            _.each(target, _.bind(function (value, key) {
                original = source[ key ];

                if (typeof value === 'object' && typeof original === 'object') {
                    res[ key ] = this.merge(value, original);
                } else if (key in source) {
                    res[ key ] = original;
                } else {
                    res[ key ] = value;
                }
            }, this));

            return res;
        },

        update: function (id, payload) {
            var updateIndex, updated, original, changes, keys, value;

            // 修改数组中的全部
            if (typeof id === 'object') {
                payload = id;
                id = void 0;
            }

            if (id == null) {
                this.items = _.map(this.items, function (item) {
                    return _.extend({}, item, payload);
                });
                this.trigger('change', updated, this.items);
            } else {
                updateIndex = _.findIndex(this.items, function (item) { return item.id === id });
     
                if (updateIndex < 0) {
                    return;
                }

                original = this.items[ updateIndex ];
                updated = this.merge(original, payload);
                changes = this.setChanges(original, updated);

                this.items = _.union(this.items.slice(0, updateIndex), [ updated ], this.items.slice(updateIndex + 1));

                _.each(changes, _.bind(function (changeKey) {
                    keys = changeKey.split('.');
                    value = _.reduce(keys, function (memo, curr) {
                        return memo[ curr ]; 
                    }, updated);
                    
                    this.trigger('change:' + changeKey, updated, value, changeKey);
                }, this));
            }
        },

        find: function (where) {
            return _.findWhere(this.items, where);
        },

        setChanges: function (original, updated, changes, parent) {
            changes || (changes = []);
            parent || (parent = '');

            _.each(updated, _.bind(function (value, key) {
                if (typeof value !== 'object') {
                    if ((key in original) && value === value && value !== original[ key ]) {
                        if (parent !== '') {
                            key = parent + '.' + key;
                        }

                        changes.push(key);
                    }
                } else {
                    this.setChanges(original[ key ], value, changes, key);
                }
            }, this));

            return changes;
        },

        onCreate: function (cb) {
            this.on('create', cb)
        },

        onChange: function (cb) {
            this.on('change', cb);
        },

        onPropMapChange: function (propMap) {
            _.each(propMap, _.bind(function (propValue, propKey) {
                this.on('change:' + propKey, propValue);
            }, this));
        },

        offPropMapChange: function (propMap) {
            _.each(propMap, _.bind(function (propValue, propKey) {
                this.off('change:' + propValue, propKey);
            }, this));
        },

        onDelete: function (cb) {
            this.on('delete', cb);
        }
    });
 });

