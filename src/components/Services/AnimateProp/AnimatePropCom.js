/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-25 23:42:48
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 
    'backbone', 
    'underscore',
    'elementsStore', 
    'elementsAction',
    'text!animatePropTmpl.html'
    ], 
    function (
        Bb,
        _,
        elementsStore,
        elementsAction,
        tmpl
    ) {
        return Bb.View.extend({
            initialize: function (options) {
                options || (options = {});

                _.extend(this, _.pick(options.props, [ 'id', 'animate' ]));
                this.$parent = Bb.$(options.parent || document.body);
                this.render();
            },

            className: 'props-animate-setting-panel',

            templateFunc: _.template(tmpl),

            render: function () {
                this.$el
                    .attr('data-visibility', 'animate')
                    .css('display', 'none')
                    .html(this.templateFunc({ 
                        duration: this.animate.animate_duration,
                        delay: this.animate.animate_delay,
                        count: this.animate.animate_count
                    }))
                    .appendTo(this.$parent);
            }
        });
    }
);