var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

define(['../../../core', './base'], function(c, base) {
  var BranchNodeModel, ContextNodeCollection;
  ContextNodeCollection = (function(_super) {
    __extends(ContextNodeCollection, _super);

    function ContextNodeCollection(models, options) {
      ContextNodeCollection.__super__.constructor.call(this, models, options);
      this.parent = options != null ? options.parent : void 0;
    }

    ContextNodeCollection.prototype.model = function(attrs, options) {
      var args, _ref;
      args = [attrs, options];
      if (options.create != null) {
        args.splice(0, 0, options.create);
      }
      return (_ref = base.ContextNodeModel).create.apply(_ref, args);
    };

    ContextNodeCollection.prototype.get = function(attrs) {
      if (attrs.id != null) {
        return ContextNodeCollection.__super__.get.call(this, attrs);
      }
      if (attrs instanceof c.Backbone.Model) {
        attrs = attrs.pick('concept', 'field');
      }
      return this.find(attrs);
    };

    ContextNodeCollection.prototype.set = function(models, options) {
      var cleaned, model, _i, _len;
      if (models == null) {
        return ContextNodeCollection.__super__.set.call(this, null, options);
      }
      models = c._.isArray(models) ? models : [models];
      cleaned = [];
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        if (model === this.parent) {
          throw new base.ContextNodeError('Cannot add self as child');
        } else if (model instanceof base.ContextNodeModel && model.get('removed')) {
          continue;
        } else if (model.removed) {
          continue;
        } else {
          cleaned.push(model);
        }
      }
      return ContextNodeCollection.__super__.set.call(this, cleaned, options);
    };

    ContextNodeCollection.prototype.find = function(query, options) {
      var child, create, node, _i, _len, _ref;
      if (options == null) {
        options = {};
      }
      create = options.create;
      options.create = false;
      _ref = this.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if ((node = child.find(query, options))) {
          return node;
        }
      }
      if (create) {
        options.create = create;
        this.add(query, options);
        return this.get(query);
      }
    };

    ContextNodeCollection.prototype.fetch = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.find.apply(this, args);
    };

    return ContextNodeCollection;

  })(c.Backbone.Collection);
  BranchNodeModel = (function(_super) {
    __extends(BranchNodeModel, _super);

    BranchNodeModel.prototype.nodeType = 'branch';

    BranchNodeModel.prototype.defaults = function() {
      return {
        type: 'and',
        children: []
      };
    };

    function BranchNodeModel() {
      var _this = this;
      this.children = new ContextNodeCollection(null, {
        parent: this
      });
      this.children.on('change', function(model, collection, options) {
        return _this.trigger('change', _this, options);
      });
      this.on('change:children', function(model, value, options) {
        return this.children.set(value, options);
      });
      BranchNodeModel.__super__.constructor.apply(this, arguments);
    }

    BranchNodeModel.prototype.toJSON = function() {
      var attrs, child, _i, _len, _ref;
      (attrs = BranchNodeModel.__super__.toJSON.apply(this, arguments)).children = [];
      _ref = this.children.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (!child.get('removed')) {
          attrs.children.push(child.toJSON());
        }
      }
      return attrs;
    };

    BranchNodeModel.prototype.isValid = function(options) {
      if (options == null) {
        options = {};
      }
      options.validate = true;
      return this._validate(this.toJSON(), options);
    };

    BranchNodeModel.prototype.isEmpty = function() {
      return this.children.length === 0;
    };

    BranchNodeModel.prototype.validate = function(attrs, options) {
      var child, message, _i, _len, _ref;
      options = c._.extend({
        deep: true,
        empty: true
      }, options);
      if (!(attrs.type === 'and' || attrs.type === 'or')) {
        return 'Not a valid branch type';
      }
      if (attrs.children == null) {
        return 'No branch children';
      }
      if (!options.empty && this.isEmpty()) {
        return 'Children are empty';
      }
      if (options.deep) {
        _ref = attrs.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (child instanceof base.ContextNodeModel) {
            if (!child.isValid(options)) {
              return child.validationError;
            }
          } else if ((message = base.ContextNodeModel.prototype.validate.call(child, child, options))) {
            return message;
          }
        }
      }
    };

    BranchNodeModel.prototype.find = function(query, options) {
      var create, node;
      options = c._.extend({
        deep: true,
        create: false
      }, options);
      create = options.create;
      options.create = false;
      if ((node = BranchNodeModel.__super__.find.call(this, query, options))) {
        return node;
      }
      if (options.deep) {
        options.create = create;
        if ((node = this.children.find(query, options))) {
          return node;
        }
      }
    };

    BranchNodeModel.prototype.destroy = function(options) {
      if (options == null) {
        options = {};
      }
      this.set('removed', true);
      this.stableAttributes = null;
    };

    BranchNodeModel.prototype.save = function(options) {
      var attrs, child, children, _i, _len, _ref;
      options = c._.extend({
        deep: false,
        strict: false
      }, options);
      if (!this.isValid({
        deep: false,
        empty: false
      })) {
        return false;
      }
      attrs = c._.clone(this.attributes);
      delete attrs.children;
      children = [];
      _ref = this.children.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.get('removed')) {
          continue;
        }
        if ((options.deep && !child.save(null, {
          deep: true
        })) || !child.isValid()) {
          if (options.strict) {
            return false;
          }
        } else {
          if (child.stableAttributes != null) {
            children.push(child.stableAttributes);
          }
        }
      }
      attrs.children = children;
      this.stableAttributes = attrs;
      this.unset('removed');
      return true;
    };

    BranchNodeModel.prototype.clear = function(options) {
      if (options == null) {
        options = {};
      }
      this.children.each(function(model) {
        return model.clear(options);
      });
      if (options.reset) {
        this.children.reset();
      }
    };

    return BranchNodeModel;

  })(base.ContextNodeModel);
  return {
    BranchNodeModel: BranchNodeModel
  };
});

/*
//@ sourceMappingURL=branch.js.map
*/