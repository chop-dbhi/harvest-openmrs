var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['../core', '../welcome', '../field', '../charts', './form', './info', 'tpl!templates/concept/workspace.html'], function() {
  var ConceptWorkspace, ConceptWorkspaceHistory, ConceptWorkspaceHistoryItem, c, charts, field, form, info, templates, welcome, _ref, _ref1, _ref2;
  c = arguments[0], welcome = arguments[1], field = arguments[2], charts = arguments[3], form = arguments[4], info = arguments[5], templates = 7 <= arguments.length ? __slice.call(arguments, 6) : [];
  templates = c._.object(['workspace'], templates);
  ConceptWorkspaceHistoryItem = (function(_super) {
    __extends(ConceptWorkspaceHistoryItem, _super);

    function ConceptWorkspaceHistoryItem() {
      _ref = ConceptWorkspaceHistoryItem.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ConceptWorkspaceHistoryItem.prototype.className = 'concept-info';

    ConceptWorkspaceHistoryItem.prototype.events = {
      click: 'focus'
    };

    ConceptWorkspaceHistoryItem.prototype.focus = function() {
      return this.publish(c.CONCEPT_FOCUS, this.model.id);
    };

    return ConceptWorkspaceHistoryItem;

  })(info.ConceptInfo);
  ConceptWorkspaceHistory = (function(_super) {
    __extends(ConceptWorkspaceHistory, _super);

    function ConceptWorkspaceHistory() {
      _ref1 = ConceptWorkspaceHistory.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ConceptWorkspaceHistory.prototype.className = 'concept-workspace-history';

    ConceptWorkspaceHistory.prototype.itemView = ConceptWorkspaceHistoryItem;

    ConceptWorkspaceHistory.prototype.appendHtml = function(collectionView, itemView, index) {
      return collectionView.$el.prepend(itemView.el);
    };

    return ConceptWorkspaceHistory;

  })(c.Marionette.CollectionView);
  ConceptWorkspace = (function(_super) {
    __extends(ConceptWorkspace, _super);

    function ConceptWorkspace() {
      this.createView = __bind(this.createView, this);
      this.showItem = __bind(this.showItem, this);
      _ref2 = ConceptWorkspace.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ConceptWorkspace.prototype.className = 'concept-workspace';

    ConceptWorkspace.prototype.template = templates.workspace;

    ConceptWorkspace.prototype.itemView = form.ConceptForm;

    ConceptWorkspace.prototype.ui = {
      tabs: '.nav-tabs',
      mainTab: '.nav-tabs [data-name=main]',
      historyTab: '.nav-tabs [data-name=history]'
    };

    ConceptWorkspace.prototype.regions = {
      main: '.main-region',
      history: '.history-region'
    };

    ConceptWorkspace.prototype.regionViews = {
      history: ConceptWorkspaceHistory,
      main: welcome.Welcome
    };

    ConceptWorkspace.prototype._ensureModel = function(model) {
      if (!(model instanceof c.models.ConceptModel)) {
        model = c.data.concepts.get(model);
      }
      return model;
    };

    ConceptWorkspace.prototype.initialize = function() {
      ConceptWorkspace.__super__.initialize.apply(this, arguments);
      if (this.options.emptyView != null) {
        this.emptyView = this.options.emptyView;
      }
      return this.subscribe(c.CONCEPT_FOCUS, this.showItem);
    };

    ConceptWorkspace.prototype.showItem = function(model) {
      var customForm, options,
        _this = this;
      this.ui.mainTab.tab('show');
      model = this._ensureModel(model);
      if (this.currentView && model.id === this.currentView.model.id) {
        return;
      }
      customForm = c.getOption("concepts.forms." + model.id);
      options = {
        model: model
      };
      if (customForm != null) {
        return require([customForm.module], function(CustomForm) {
          options = c._.extend({}, customForm.options, options);
          return _this.createView(CustomForm, options);
        });
      } else {
        return this.createView(this.itemView, options);
      }
    };

    ConceptWorkspace.prototype.createView = function(itemViewClass, options) {
      var view;
      view = new itemViewClass(options);
      this.history.currentView.collection.add(options.model);
      return this.setCurrentView(view);
    };

    ConceptWorkspace.prototype.setCurrentView = function(view) {
      if (this.currentView == null) {
        this.ui.tabs.fadeIn();
      }
      this.currentView = view;
      return this.main.show(view);
    };

    ConceptWorkspace.prototype.onRender = function() {
      this.main.show(new this.regionViews.main);
      return this.history.show(new this.regionViews.history({
        collection: new c.Backbone.Collection
      }));
    };

    return ConceptWorkspace;

  })(c.Marionette.Layout);
  return {
    ConceptWorkspace: ConceptWorkspace
  };
});

/*
//@ sourceMappingURL=workspace.js.map
*/