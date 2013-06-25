var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['../core', '../structs'], function(c, structs) {
  var Value, Values, _ref, _ref1;
  Value = (function(_super) {
    __extends(Value, _super);

    function Value() {
      _ref = Value.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Value.prototype.idAttribute = 'value';

    Value.prototype.defaults = {
      valid: null,
      pending: false
    };

    Value.prototype.fetch = function() {};

    Value.prototype.toJSON = function(options) {
      if (options == null) {
        options = {};
      }
      if (options.flat) {
        return this.pluck('value');
      } else {
        return this.pick('value', 'label');
      }
    };

    Value.prototype.destroy = function(options) {
      return this.trigger('destroy', this, this.collection, options);
    };

    return Value;

  })(c.Backbone.Model);
  Values = (function(_super) {
    __extends(Values, _super);

    function Values() {
      this.check = __bind(this.check, this);
      _ref1 = Values.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Values.prototype.model = Value;

    Values.prototype.comparator = 'index';

    Values.prototype.initialize = function() {
      Values.__super__.initialize.apply(this, arguments);
      this.check = c._.debounce(this.check, 300);
      return this.on('add', this.check);
    };

    Values.prototype.fetch = function() {};

    Values.prototype.create = function(model, options) {
      return this.add(model, options);
    };

    Values.prototype.check = function() {
      var models,
        _this = this;
      models = this.where({
        valid: null,
        pending: false
      });
      c._.each(models, function(model) {
        return model.set('pending', true);
      });
      return c.$.ajax({
        url: this.url(),
        type: 'POST',
        data: JSON.stringify(models),
        contentType: 'application/json',
        success: function(resp) {
          return _this.set(resp, {
            add: false,
            remove: false
          });
        },
        complete: function() {
          return c._.each(models, function(model) {
            return model.set('pending', false);
          });
        }
      });
    };

    return Values;

  })(c.Backbone.Collection);
  return {
    Value: Value,
    Values: Values
  };
});

/*
//@ sourceMappingURL=value.js.map
*/