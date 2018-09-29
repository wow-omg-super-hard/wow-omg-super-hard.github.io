/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-19 16:57:17
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 
    'backbone', 
    'elementsStore',
    'StylePropCom', 
    'AnimatePropCom',
    'text!editElementTmpl.html'
    ], 
    function (
        Bb,
        elementsStore,
        StylePropCom,
        AnimatePropCom,
        tmpl
    ) {
        return Bb.View.extend({
            initialize: function (options) {
                options || (options = {});

                _.extend(this, _.pick(options.props, [ 'id', 'name', 'type', 'url', 'content', 'style', 'animate' ]));
                this.$parent = Bb.$(options.parent || document.body);
                this.stylePropCom = this.animatePropCom = null;
            },

            className: 'edit-element-inner',

            events: {
                'click .tabitem': 'switchTabHandle'
            },

            templateFunc: _.template(tmpl),

            remove: function () {
                var originalRemove = this.constructor.__super__.remove;

                originalRemove.call(this);
                this.stylePropCom = this.animatePropCom = null;
            },

            switchTabHandle: function (e) {
                var visibility = Bb.$(e.target).data('visibility');

                this.model.set('element_prop_panel_visibility', visibility);
                e.stopPropagation();
            },

            render: function () {
                this.$el.html(tmpl).appendTo(this.$parent);
                this.stylePropCom = new StylePropCom({ 
                    parent: this.$('.props-bd-tab'),
                    props: { 
                        id: this.id,
                        name: this.name,
                        style: this.style
                    }
                });
                this.animatePropCom = new AnimatePropCom({ 
                    parent: this.$('.props-bd-tab'),
                    props: { 
                        id: this.id,
                        animate: this.animate 
                    }
                });
            }
        });
});