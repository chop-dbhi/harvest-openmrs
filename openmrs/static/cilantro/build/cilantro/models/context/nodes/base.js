var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

define(['../../../core', './base'], function(c, base) {
  var ContextNodeError, ContextNodeModel, _ref, _ref1;
  ContextNodeError = (function(_super) {
    __extends(ContextNodeError, _super);

    function ContextNodeError() {
      _ref = ContextNodeError.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ContextNodeError;

  })(Error);
  ContextNodeModel = (function(_super) {
    __extends(ContextNodeModel, _super);

    function ContextNodeModel() {
      _ref1 = ContextNodeModel.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ContextNodeModel.prototype.initialize = function() {
      ContextNodeModel.__super__.initialize.apply(this, arguments);
      return this.save();
    };

    ContextNodeModel.prototype.enable = function() {
      return this.set('enabled', true, {
        save: true
      });
    };

    ContextNodeModel.prototype.disable = function() {
      return this.set('enabled', false, {
        save: true
      });
    };

    ContextNodeModel.prototype.isEnabled = function() {
      return this.get('enabled') !== false;
    };

    ContextNodeModel.prototype.isDirty = function() {
      return !c._.isEqual(this.toJSON(), this.stableAttributes);
    };

    ContextNodeModel.prototype.isSynced = function() {
      return (this.stableAttributes != null) && (this.validate(this.stableAttributes) == null) && !this.get('removed');
    };

    ContextNodeModel.prototype.destroy = function() {
      this.set('removed', true);
      return this.stableAttributes = null;
    };

    ContextNodeModel.prototype.save = function(options) {
      var isValid;
      this.unset('removed');
      if ((isValid = this.isValid(options))) {
        this.stableAttributes = this.toJSON();
      }
      return isValid;
    };

    ContextNodeModel.prototype.set = function(key, value, options) {
      var attrs;
      if (typeof key === 'object') {
        attrs = key;
        options = value;
      } else {
        (attrs = {})[key] = value;
      }
      if (options == null) {
        options = {};
      }
      ContextNodeModel.__super__.set.call(this, attrs, options);
      if (options.save) {
        this.save(options);
      }
      return this;
    };

    ContextNodeModel.prototype.validate = function(attrs, options) {
      var error, model;
      try {
        model = ContextNodeModel.create(attrs, options);
        if (!model.isValid(options)) {
          return model.validationError;
        }
      } catch (_error) {
        error = _error;
        return error.message;
      }
    };

    ContextNodeModel.prototype.clear = function() {
      var ids;
      ids = this.pick('field', 'concept');
      ContextNodeModel.__super__.clear.apply(this, arguments);
      return this.set(ids, {
        silent: true
      });
    };

    ContextNodeModel.prototype.find = function(query, options) {
      var key, match, type, value;
      if (options == null) {
        options = {};
      }
      if (c._.isEmpty(query)) {
        return false;
      }
      for (key in query) {
        value = query[key];
        if (this.get(key) !== value) {
          match = false;
          break;
        }
      }
      if (match !== false) {
        return this;
      }
      if ((type = options.create)) {
        return ContextNodeModel.create(type, query, options);
      }
    };

    ContextNodeModel.prototype.fetch = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.find.apply(this, args);
    };

    return ContextNodeModel;

  })(c.Backbone.Model);
  return {
    ContextNodeError: ContextNodeError,
    ContextNodeModel: ContextNodeModel
  };
});

/*
//@ sourceMappingURL=base.js.map
*/