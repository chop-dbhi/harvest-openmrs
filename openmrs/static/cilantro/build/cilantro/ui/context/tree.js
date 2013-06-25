var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', '../base', './item', './info', './actions', 'tpl!templates/context.html', 'tpl!templates/context/empty.html', 'tpl!templates/context/tree.html'], function() {
  var ContextEmptyTree, ContextPanel, ContextTree, actions, base, c, info, item, templates, _ref, _ref1, _ref2;
  c = arguments[0], base = arguments[1], item = arguments[2], info = arguments[3], actions = arguments[4], templates = 6 <= arguments.length ? __slice.call(arguments, 5) : [];
  templates = c._.object(['context', 'empty', 'tree'], templates);
  ContextEmptyTree = (function(_super) {
    __extends(ContextEmptyTree, _super);

    function ContextEmptyTree() {
      _ref = ContextEmptyTree.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ContextEmptyTree.prototype.template = templates.empty;

    return ContextEmptyTree;

  })(base.EmptyView);
  ContextTree = (function(_super) {
    __extends(ContextTree, _super);

    function ContextTree() {
      _ref1 = ContextTree.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ContextTree.prototype.className = 'context-tree';

    ContextTree.prototype.template = templates.tree;

    ContextTree.prototype.itemViewContainer = '.branch-children';

    ContextTree.prototype.itemView = item.ContextItem;

    ContextTree.prototype.emptyView = ContextEmptyTree;

    ContextTree.prototype.modelEvents = {
      'root:change:enabled': 'toggleState'
    };

    ContextTree.prototype.toggleState = function() {
      return this.$el.toggleClass('disabled', !this.model.isEnabled());
    };

    ContextTree.prototype.onRender = function() {
      return this.toggleState();
    };

    return ContextTree;

  })(c.Marionette.CompositeView);
  ContextPanel = (function(_super) {
    __extends(ContextPanel, _super);

    function ContextPanel() {
      _ref2 = ContextPanel.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ContextPanel.prototype.className = 'context';

    ContextPanel.prototype.template = templates.context;

    ContextPanel.prototype.regions = {
      actions: '.actions-region',
      tree: '.tree-region',
      info: '.info-region'
    };

    ContextPanel.prototype.onRender = function() {
      this.info.show(new info.ContextInfo({
        model: this.model
      }));
      this.actions.show(new actions.ContextActions({
        model: this.model
      }));
      return this.tree.show(new ContextTree({
        model: this.model,
        collection: this.model.root.children
      }));
    };

    return ContextPanel;

  })(c.Marionette.Layout);
  return {
    ContextPanel: ContextPanel
  };
});

/*
//@ sourceMappingURL=tree.js.map
*/