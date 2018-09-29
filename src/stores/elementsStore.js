/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-21 07:54:22
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 'underscore', 'superStore' ], function (_, superStore) {
    return _.extend({}, superStore, {
        create: function (name, type, url, content, width, height) {
            var id = _.uniqueId();
            var created = {
                id: id,
                name: name + '_' + id,
                type: type,
                url: url,
                content: content,
                status: 'active',
                style: {
                    width: width,
                    height: height,
                    left: 100,
                    top: 100,
                    visibility: 'visible',
                    opacity: 1,
                    rotate: 0
                },
                animate: {
                    animate_entrance: 'fadeIn',
                    animate_appearance: 'fadeOut',
                    animate_duration: 0.1,
                    animate_delay: 0,
                    animate_count: 2
                }
            };

            this.items.push(created);
            this.trigger('create', created);
        }
    });
});