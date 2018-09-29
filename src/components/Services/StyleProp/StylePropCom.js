/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-25 23:42:27
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define([ 
    'backbone', 
    'underscore',
    'elementsStore', 
    'elementsAction',
    'text!stylePropTmpl.html'
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
                var validateNumber;
                options || (options = {});

                validateNumber = function (value) {
                    return !isNaN(parseFloat(value));
                };
                _.extend(this, _.pick(options.props, [ 'id', 'name', 'style' ]));
                
                this.events = {
                    'blur .props-element-value': this.updateGeneralInputHandle('name'),
                    'blur .w': this.updateGeneralInputHandle(function (store, updating, value) {
                        // 获取store的值
                        if (!updating) {
                            return store.style.width;
                        }

                        // 设置
                        return _.extend(
                            {}, 
                            updating, 
                            { style: _.extend({}, store.style, { width: parseInt(value) }) }
                        );
                    }, validateNumber),
                    'blur .h': this.updateGeneralInputHandle(function (store, updating, value) {
                        // 获取store的值
                        if (!updating) {
                            return store.style.height;
                        }

                        // 设置
                        return _.extend(
                            {}, 
                            updating, 
                            { style: _.extend({}, store.style, { height: parseInt(value) }) }
                        );
                    }, validateNumber),
                    'blur .x': this.updateGeneralInputHandle(function (store, updating, value) {
                        // 获取store的值
                        if (!updating) {
                            return store.style.left;
                        }

                        // 设置
                        return _.extend(
                            {}, 
                            updating, 
                            { style: _.extend({}, store.style, { left: parseInt(value) }) }
                        );
                    }, validateNumber),
                    'blur .y': this.updateGeneralInputHandle(function (store, updating, value) {
                        // 获取store的值
                        if (!updating) {
                            return store.style.top;
                        }

                        // 设置
                        return _.extend(
                            {}, 
                            updating, 
                            { style: _.extend({}, store.style, { top: parseInt(value) }) }
                        );
                    }, validateNumber),
                    'change .visibility': this.updateGeneralInputHandle(function (store, updating, value) {
                        // 获取store的值
                        if (!updating) {
                            return store.style.visibility;
                        }

                        // 设置
                        return _.extend(
                            {}, 
                            updating, 
                            { style: _.extend({}, store.style, { visibility: value }) }
                        );
                    }),
                    'change .opacity-number': this.updateSepecialInputHandle(function (store, updating, value) {
                        // 获取store的值
                        if (!updating) {
                            return store.style.opacity;
                        }

                        // 设置
                        return _.extend(
                            {}, 
                            updating, 
                            { style: _.extend({}, store.style, { opacity: parseFloat(value) }) }
                        );
                    }, '.opacity-range'),
                    'change .rotate-number': this.updateSepecialInputHandle(function (store, updating, value) {
                        // 获取store的值
                        if (!updating) {
                            return store.style.rotate;
                        }

                        // 设置
                        return _.extend(
                            {}, 
                            updating, 
                            { style: _.extend({}, store.style, { rotate: parseInt(value) }) }
                        );
                    }, '.rotate-range'),
                    'input .opacity-range': this.updateSepecialInputHandle(function (store, updating, value) {
                        // 获取store的值
                        if (!updating) {
                            return store.style.opacity;
                        }

                        // 设置
                        return _.extend(
                            {}, 
                            updating, 
                            { style: _.extend({}, store.style, { opacity: parseFloat(value) }) }
                        );
                    }, '.opacity-number'),
                    'input .rotate-range': this.updateSepecialInputHandle(function (store, updating, value) {
                        // 获取store的值
                        if (!updating) {
                            return store.style.rotate;
                        }

                        // 设置
                        return _.extend(
                            {}, 
                            updating, 
                            { style: _.extend({}, store.style, { rotate: parseInt(value) }) }
                        );
                    }, '.rotate-number')
                };
                this._ensureElement();
                this.$parent = Bb.$(options.parent || document.body);
                this.render();
            },

            className: 'props-style-setting-panel',

            templateFunc: _.template(tmpl),

            updateSepecialInputHandle: function (prop, selector) {
                var updating = {}, isMethod = typeof prop === 'function', original;

                return function (e) {
                    var value = e.target.value.trim();
                    var store = elementsStore.find({ id: this.id });
 
                    if (isMethod) {
                        original = prop(store);
                    } else {
                        original = store[ prop ];
                    }

                    if (original != value) {
                        if (isMethod) {
                            updating = prop(store, updating, value);
                        } else {
                            (updating = {})[ prop ] = value;       
                        }

                        elementsAction.updateElement(this.id, updating);
                        this.$(selector).val(value);
                    }
                }
            },

            updateGeneralInputHandle: function (prop, validate) {
                var updating = {}, isMethod = typeof prop === 'function', original;

                return function (e) {
                    var value = e.target.value.trim();
                    var store = elementsStore.find({ id: this.id });

                    // 验证类型、规则、值是否改变
                    if (value !== '' && value.length) {
                        if (!validate || validate(value)) {
                            if (isMethod) {
                                original = prop(store);
                            } else {
                                original = store[ prop ];
                            }

                            if (original != value) {
                                if (isMethod) {
                                    updating = prop(store, updating, value);
                                } else {
                                    (updating = {})[ prop ] = value;       
                                }

                                elementsAction.updateElement(this.id, updating);
                            }
                        }
                    } else {
                        e.target.value = isMethod ? prop(store) : store[ prop ];
                    }
                }
            },

            render: function () {
                this.$el
                    .attr('data-visibility', 'style')
                    .html(this.templateFunc(this.resetProps()))
                    .appendTo(this.$parent);
            },

            resetProps: function (props) {
                return {
                    name: this.name,
                    width: this.style.width,
                    height: this.style.height,
                    left: this.style.left,
                    top: this.style.top,
                    visibility: this.style.visibility,
                    opacity: this.style.opacity,
                    rotate: this.style.rotate 
                };
            }
        });
    }
);