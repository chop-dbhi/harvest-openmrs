var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core'], function(c) {
  var Control, ControlError, ControlViewMixin, bindContext, controlOptions, unbindContext, _ref;
  ControlError = (function(_super) {
    __extends(ControlError, _super);

    function ControlError() {
      _ref = ControlError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ControlError;

  })(Error);
  controlOptions = ['attrNames', 'dataAttrs', 'dataSelectors', 'regions', 'regionViews', 'regionOptions', 'attrGetters', 'attrSetters'];
  unbindContext = function(view) {
    var model;
    if ((model = view.context)) {
      delete view.context;
      model.stopListening(view);
      view.stopListening(model);
    }
  };
  bindContext = function(view, model) {
    unbindContext(view);
    if (model == null) {
      return;
    }
    model.listenTo(view, 'change', function(view, attrs) {
      return model.set(attrs);
    });
    view.listenTo(model, 'change', function(model, options) {
      return view.set(model.changedAttributes());
    });
    view.context = model;
  };
  ControlViewMixin = {
    attrNames: ['field', 'operator', 'value', 'nulls'],
    attrGetters: {
      field: 'getField',
      operator: 'getOperator',
      value: 'getValue',
      nulls: 'getNulls'
    },
    attrSetters: {
      field: 'setField',
      operator: 'setOperator',
      value: 'setValue',
      nulls: 'setNulls'
    },
    mergeOptions: function(options) {
      var option, optionKey, _i, _len;
      for (_i = 0, _len = controlOptions.length; _i < _len; _i++) {
        optionKey = controlOptions[_i];
        if ((option = c._.result(options, optionKey)) != null) {
          if (c._.isArray(option)) {
            this[optionKey] = option;
          } else if (c._.isObject(option)) {
            this[optionKey] = c._.extend({}, this[optionKey], option);
          } else {
            this[optionKey] = option;
          }
        }
      }
    },
    getContext: function() {
      return this.context;
    },
    hasBoundContext: function() {
      return this.getContext() != null;
    },
    bindContext: function(context) {
      return bindContext(this, context);
    },
    unbindContext: function() {
      return unbindContext(this);
    },
    onRender: function() {
      return this.set(this.context);
    },
    _get: function(key, options) {
      var func, method;
      if (!(method = this.attrGetters[key])) {
        return;
      }
      if ((func = this[method]) != null) {
        return func.call(this, options);
      }
      throw new ControlError('Getter declared, but not defined');
    },
    _set: function(key, value, options) {
      var func, method;
      if (!(method = this.attrSetters[key])) {
        return;
      }
      if ((func = this[method]) != null) {
        return func.call(this, value, options);
      }
      throw new ControlError('Setter declared, but not defined');
    },
    get: function(key, options) {
      var attrs, value, _i, _len, _ref1;
      if (typeof key === 'object') {
        options = key;
        key = null;
      }
      if (key != null) {
        return this._get(key, options);
      } else {
        attrs = {};
        _ref1 = this.attrNames;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          key = _ref1[_i];
          if ((value = this._get(key, options)) != null) {
            attrs[key] = value;
          }
        }
        return attrs;
      }
    },
    set: function(key, value, options) {
      var attrs;
      if ((key != null) && typeof key === 'object') {
        if (key instanceof c.Backbone.Model) {
          attrs = key.toJSON();
        } else {
          attrs = key;
        }
        options = value;
      } else {
        (attrs = {})[key] = value;
      }
      for (key in attrs) {
        value = attrs[key];
        this._set(key, value, options);
      }
    },
    clear: function(key, options) {
      var _i, _len, _ref1;
      if (typeof key === 'object') {
        options = key;
        key = null;
      }
      if (key != null) {
        this._set(key, null, options);
      } else {
        _ref1 = this.attrNames;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          key = _ref1[_i];
          this._set(key, null, options);
        }
      }
    },
    change: function(event) {
      return this.trigger('change', this, this.get());
    },
    getField: function() {},
    getOperator: function() {},
    getValue: function() {},
    getNulls: function() {},
    setField: function() {},
    setOperator: function() {},
    setValue: function() {},
    setNulls: function() {}
  };
  Control = (function(_super) {
    __extends(Control, _super);

    Control.prototype.className = 'control';

    Control.prototype.regions = {
      field: '.control-field',
      operator: '.control-operator',
      value: '.control-value',
      nulls: '.control-nulls'
    };

    Control.prototype.regionViews = {};

    Control.prototype.regionOptions = {};

    Control.prototype.dataAttrs = {
      field: 'data-field',
      operator: 'data-operator',
      value: 'data-value',
      nulls: 'data-nulls'
    };

    Control.prototype.dataSelectors = {
      field: '[data-field]',
      operator: '[data-operator]',
      value: '[data-value]',
      nulls: '[data-nulls]'
    };

    function Control() {
      Control.__super__.constructor.apply(this, arguments);
      this.mergeOptions(this.options);
      this.bindContext(this.options.context);
    }

    Control.prototype.onRender = function() {
      var inputAttrs, key, klass, options, _ref1;
      _ref1 = c._.result(this, 'regionViews');
      for (key in _ref1) {
        klass = _ref1[key];
        inputAttrs = {};
        inputAttrs[this.dataAttrs[key]] = '';
        options = c._.extend({}, c._.result(this.regionOptions, key), {
          inputAttrs: inputAttrs,
          model: this.model
        });
        this[key].show(new klass(options));
      }
      return this.set(this.context);
    };

    return Control;

  })(c.Marionette.Layout);
  c._.defaults(Control.prototype, ControlViewMixin);
  return {
    Control: Control,
    ControlViewMixin: ControlViewMixin
  };
});

/*
//@ sourceMappingURL=base.js.map
*/