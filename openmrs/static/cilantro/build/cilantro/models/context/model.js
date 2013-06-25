var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

define(['../../core', '../base', './nodes'], function(c, base, nodes) {
  var ContextCollection, ContextModel, contextNodeModels, getContextNodeType, _ref;
  contextNodeModels = {
    branch: nodes.BranchNodeModel,
    condition: nodes.ConditionNodeModel,
    composite: nodes.CompositeNodeModel
  };
  getContextNodeType = function(attrs, options) {
    var model, type;
    if (attrs instanceof nodes.ContextNodeModel) {
      return attrs.nodeType;
    }
    for (type in contextNodeModels) {
      model = contextNodeModels[type];
      if (!model.prototype.validate.call(attrs, attrs, options)) {
        return type;
      }
    }
    throw new nodes.ContextNodeError('Unknown context node type');
  };
  nodes.ContextNodeModel.create = function(type, attrs, options) {
    var klass;
    if (typeof type === 'object') {
      options = attrs;
      attrs = type;
      type = getContextNodeType(attrs, options);
    }
    if ((klass = contextNodeModels[type]) == null) {
      throw new nodes.ContextNodeError('Unknown context node type');
    }
    return new klass(attrs, options);
  };
  ContextModel = (function(_super) {
    __extends(ContextModel, _super);

    ContextModel.prototype.rootEventPrefix = 'root';

    function ContextModel(attrs, options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      this.parse = __bind(this.parse, this);
      this.root = new nodes.BranchNodeModel;
      this.listenTo(this.root, 'all', function() {
        var args, event;
        event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return _this.trigger.apply(_this, ["" + _this.rootEventPrefix + ":" + event].concat(__slice.call(args)));
      });
      options.parse = true;
      ContextModel.__super__.constructor.call(this, attrs, options);
    }

    ContextModel.prototype.initialize = function() {
      var _this = this;
      this.on('request', function() {
        this.pending();
        return c.publish(c.CONTEXT_SYNCING, this);
      });
      this.on('sync', function() {
        this.resolve();
        return c.publish(c.CONTEXT_SYNCED, this, 'success');
      });
      this.on('error', function() {
        this.resolve();
        return c.publish(c.CONTEXT_SYNCED, this, 'error');
      });
      this.on('change', function() {
        return c.publish(c.CONTEXT_CHANGED, this);
      });
      c.subscribe(c.CONTEXT_PAUSE, function(id) {
        if (_this.id === id || !id && _this.isSession()) {
          return _this.pending();
        }
      });
      c.subscribe(c.CONTEXT_RESUME, function(id) {
        if (_this.id === id || !id && _this.isSession()) {
          return _this.resolve();
        }
      });
      c.subscribe(c.CONTEXT_CLEAR, function(id) {
        if (_this.id === id || !id && _this.isSession()) {
          _this.root.stableAttributes = null;
          return _this.save();
        }
      });
      c.subscribe(c.CONTEXT_SAVE, function(id) {
        if (_this.id === id || !id && _this.isSession()) {
          _this.root.save();
          return _this.save();
        }
      });
      return this.resolve();
    };

    ContextModel.prototype.parse = function(resp) {
      var attrs, copy;
      if ((attrs = resp.json) != null) {
        copy = c.$.extend(true, {}, attrs);
        if ((attrs.concept != null) || (attrs.field != null)) {
          this.root.children.add(attrs);
        } else {
          this.root.set(attrs, {
            remove: false,
            save: true
          });
        }
        delete resp.json;
      }
      return ContextModel.__super__.parse.call(this, resp);
    };

    ContextModel.prototype.toJSON = function(options) {
      var attrs;
      if (options == null) {
        options = {};
      }
      attrs = ContextModel.__super__.toJSON.apply(this, arguments);
      attrs.json = this.root.stableAttributes;
      return attrs;
    };

    ContextModel.prototype.isSession = function() {
      return this.get('session');
    };

    ContextModel.prototype.isArchived = function() {
      return this.get('archived');
    };

    ContextModel.prototype.isEnabled = function() {
      return this.root.isEnabled();
    };

    ContextModel.prototype.enable = function() {
      return this.root.enable();
    };

    ContextModel.prototype.disable = function() {
      return this.root.disable();
    };

    return ContextModel;

  })(base.Model);
  ContextCollection = (function(_super) {
    __extends(ContextCollection, _super);

    function ContextCollection() {
      _ref = ContextCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ContextCollection.prototype.model = ContextModel;

    ContextCollection.prototype.url = function() {
      return c.getSessionUrl('contexts');
    };

    ContextCollection.prototype.initialize = function() {
      var _this = this;
      ContextCollection.__super__.initialize.apply(this, arguments);
      c.subscribe(c.SESSION_OPENED, function() {
        return _this.fetch({
          reset: true
        }).done(function() {
          _this.ensureSession();
          return _this.resolve();
        });
      });
      return c.subscribe(c.SESSION_CLOSED, function() {
        return _this.reset();
      });
    };

    ContextCollection.prototype.getSession = function() {
      return (this.filter(function(model) {
        return model.get('session');
      }))[0];
    };

    ContextCollection.prototype.hasSession = function() {
      return !!this.getSession();
    };

    ContextCollection.prototype.ensureSession = function() {
      var defaults;
      if (!this.hasSession()) {
        defaults = {
          session: true
        };
        defaults.json = c.getOption('defaults.context');
        return this.create(defaults);
      }
    };

    return ContextCollection;

  })(base.Collection);
  return {
    ContextModel: ContextModel,
    ContextCollection: ContextCollection
  };
});

/*
//@ sourceMappingURL=model.js.map
*/