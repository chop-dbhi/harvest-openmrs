var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', './search', './index', 'tpl!templates/concept/columns.html', 'tpl!templates/concept/columns-available.html', 'tpl!templates/concept/columns-available-section.html', 'tpl!templates/concept/columns-available-group.html', 'tpl!templates/concept/columns-selected.html'], function() {
  var AvailableColumns, AvailableGroup, AvailableItem, AvailableSection, ConceptColumns, SelectedColumns, SelectedItem, c, index, search, templates, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
  c = arguments[0], search = arguments[1], index = arguments[2], templates = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
  templates = c._.object(['columns', 'available', 'section', 'group', 'selected'], templates);
  AvailableItem = (function(_super) {
    __extends(AvailableItem, _super);

    function AvailableItem() {
      _ref = AvailableItem.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AvailableItem.prototype.template = templates.available;

    AvailableItem.prototype.events = {
      'click .column-item-button': 'triggerAdd'
    };

    AvailableItem.prototype.triggerAdd = function(event) {
      event.preventDefault();
      return this.model.trigger('columns:add', this.model);
    };

    AvailableItem.prototype.enable = function() {
      return this.$el.removeClass('disabled');
    };

    AvailableItem.prototype.disable = function() {
      return this.$el.addClass('disabled');
    };

    return AvailableItem;

  })(index.ConceptItem);
  AvailableSection = (function(_super) {
    __extends(AvailableSection, _super);

    function AvailableSection() {
      _ref1 = AvailableSection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    AvailableSection.prototype.template = templates.section;

    AvailableSection.prototype.itemView = AvailableItem;

    AvailableSection.prototype.options = {
      enableAddAll: true
    };

    AvailableSection.prototype.events = {
      'click .column-section-button': 'triggerAdd'
    };

    AvailableSection.prototype.triggerAdd = function(event) {
      var itemModel, _i, _len, _ref2, _results;
      _ref2 = this.model.items.models;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        itemModel = _ref2[_i];
        _results.push(itemModel.trigger('columns:add', itemModel));
      }
      return _results;
    };

    AvailableSection.prototype.onRender = function() {
      if (!this.options.enableAddAll) {
        return this.$('.column-section-button').hide();
      }
    };

    return AvailableSection;

  })(index.ConceptSection);
  AvailableGroup = (function(_super) {
    __extends(AvailableGroup, _super);

    function AvailableGroup() {
      _ref2 = AvailableGroup.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    AvailableGroup.prototype.template = templates.group;

    AvailableGroup.prototype.itemView = AvailableSection;

    AvailableGroup.prototype.options = {
      enableAddAll: false
    };

    AvailableGroup.prototype.events = {
      'click .column-group-button': 'triggerAdd'
    };

    AvailableGroup.prototype.triggerAdd = function(event) {
      var itemModel, sectionModel, _i, _len, _ref3, _results;
      _ref3 = this.model.sections.models;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        sectionModel = _ref3[_i];
        _results.push((function() {
          var _j, _len1, _ref4, _results1;
          _ref4 = sectionModel.items.models;
          _results1 = [];
          for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
            itemModel = _ref4[_j];
            _results1.push(itemModel.trigger('columns:add', itemModel));
          }
          return _results1;
        })());
      }
      return _results;
    };

    AvailableGroup.prototype.onRender = function() {
      AvailableGroup.__super__.onRender.apply(this, arguments);
      if (!this.options.enableAddAll) {
        return this.$('.column-group-button').hide();
      }
    };

    return AvailableGroup;

  })(index.ConceptGroup);
  AvailableColumns = (function(_super) {
    __extends(AvailableColumns, _super);

    function AvailableColumns() {
      _ref3 = AvailableColumns.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    AvailableColumns.prototype.itemView = AvailableGroup;

    AvailableColumns.prototype.className = 'available-columns accordian';

    return AvailableColumns;

  })(index.ConceptIndex);
  SelectedItem = (function(_super) {
    __extends(SelectedItem, _super);

    function SelectedItem() {
      _ref4 = SelectedItem.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    SelectedItem.prototype.tagName = 'li';

    SelectedItem.prototype.template = templates.selected;

    SelectedItem.prototype.serializeData = function() {
      var concept;
      concept = c.data.concepts.get(this.model.get('concept'));
      return {
        name: concept.get('name')
      };
    };

    SelectedItem.prototype.events = {
      'click button': 'triggerRemove',
      'sortupdate': 'updateIndex'
    };

    SelectedItem.prototype.triggerRemove = function(event) {
      event.preventDefault();
      return this.model.trigger('columns:remove', this.model);
    };

    SelectedItem.prototype.updateIndex = function(event, index) {
      var collection;
      event.stopPropagation();
      collection = this.model.collection;
      collection.remove(this.model, {
        silent: true
      });
      return collection.add(this.model, {
        at: index,
        silent: true
      });
    };

    return SelectedItem;

  })(c.Marionette.ItemView);
  SelectedColumns = (function(_super) {
    __extends(SelectedColumns, _super);

    function SelectedColumns() {
      _ref5 = SelectedColumns.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    SelectedColumns.prototype.tagName = 'ul';

    SelectedColumns.prototype.className = 'selected-columns';

    SelectedColumns.prototype.itemView = SelectedItem;

    SelectedColumns.prototype.events = {
      'sortupdate': 'triggerItemSort'
    };

    SelectedColumns.prototype.initialize = function() {
      return this.$el.sortable({
        cursor: 'move',
        forcePlaceholderSize: true,
        placeholder: 'placeholder'
      });
    };

    SelectedColumns.prototype.triggerItemSort = function(event, ui) {
      return ui.item.trigger(event, ui.item.index());
    };

    return SelectedColumns;

  })(c.Marionette.CollectionView);
  ConceptColumns = (function(_super) {
    __extends(ConceptColumns, _super);

    ConceptColumns.prototype.className = 'concept-columns';

    ConceptColumns.prototype.template = templates.columns;

    ConceptColumns.prototype.events = {
      'click .columns-remove-all-button': 'triggerRemoveAll'
    };

    ConceptColumns.prototype.regions = {
      search: '.search-region',
      available: '.available-region',
      selected: '.selected-region'
    };

    function ConceptColumns(options) {
      if (options.view == null) {
        throw new Error('ViewModel instance required');
      }
      this.view = options.view;
      delete options.view;
      ConceptColumns.__super__.constructor.call(this, options);
    }

    ConceptColumns.prototype.initialize = function() {
      return this.$el.modal({
        show: false
      });
    };

    ConceptColumns.prototype.onRender = function() {
      var concept, facet, _i, _len, _ref6, _results,
        _this = this;
      this.listenTo(this.collection, 'columns:add', this.addColumn, this);
      this.listenTo(this.view.facets, 'columns:remove', this.removeColumn, this);
      this.available.show(new AvailableColumns({
        collection: this.collection,
        collapsable: false
      }));
      this.search.show(new search.ConceptSearch({
        collection: this.collection,
        handler: function(query, resp) {
          return _this.available.currentView.filter(query, resp);
        }
      }));
      this.selected.show(new SelectedColumns({
        collection: this.view.facets
      }));
      _ref6 = this.view.facets.models;
      _results = [];
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        facet = _ref6[_i];
        if ((concept = this.collection.get(facet.get('concept')))) {
          _results.push(this.addColumn(concept, false));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ConceptColumns.prototype.isConceptUnselected = function(concept) {
      var facet, _i, _len, _ref6;
      _ref6 = this.view.facets.models;
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        facet = _ref6[_i];
        if (facet.get('concept') === concept.id) {
          return false;
        }
      }
      return true;
    };

    ConceptColumns.prototype.triggerRemoveAll = function() {
      var facet, facets, _i, _len, _ref6, _results;
      facets = this.view.facets.clone();
      _ref6 = facets.models;
      _results = [];
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        facet = _ref6[_i];
        _results.push(this.removeColumn(facet));
      }
      return _results;
    };

    ConceptColumns.prototype.addColumn = function(concept, add) {
      var facet, _ref6;
      if (add == null) {
        add = true;
      }
      if ((_ref6 = this.available.currentView.find(concept)) != null) {
        _ref6.disable();
      }
      if (add && this.isConceptUnselected(concept)) {
        facet = new this.view.facets.model({
          concept: concept.id
        });
        return this.view.facets.add(facet);
      }
    };

    ConceptColumns.prototype.removeColumn = function(facet) {
      var concept, _ref6;
      this.view.facets.remove(facet);
      concept = this.collection.get(facet.get('concept'));
      return (_ref6 = this.available.currentView.find(concept)) != null ? _ref6.enable() : void 0;
    };

    return ConceptColumns;

  })(c.Marionette.Layout);
  return {
    ConceptColumns: ConceptColumns
  };
});

/*
//@ sourceMappingURL=columns.js.map
*/