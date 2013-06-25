var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../../core', '../../../models', '../../controls', '../../paginator', '../../values', '../../search', 'tpl!templates/search.html', 'tpl!templates/field/controls/multi-value-item.html', 'tpl!templates/field/controls/multi-value-search.html'], function() {
  var FieldValueSearch, SearchItem, SearchPage, SearchPageModel, SearchPageRoll, SearchPaginator, ValueSearch, c, controls, models, paginator, search, templates, values, _ref, _ref1, _ref2, _ref3, _ref4;
  c = arguments[0], models = arguments[1], controls = arguments[2], paginator = arguments[3], values = arguments[4], search = arguments[5], templates = 7 <= arguments.length ? __slice.call(arguments, 6) : [];
  templates = c._.object(['search', 'item', 'layout'], templates);
  SearchPageModel = (function(_super) {
    __extends(SearchPageModel, _super);

    function SearchPageModel(attrs, options) {
      if (options == null) {
        options = {};
      }
      options.parse = true;
      this.items = new models.Values;
      SearchPageModel.__super__.constructor.call(this, attrs, options);
    }

    SearchPageModel.prototype.parse = function(resp, options) {
      this.items.reset(resp.values, options);
      delete resp.values;
      return resp;
    };

    return SearchPageModel;

  })(models.Page);
  SearchPaginator = (function(_super) {
    __extends(SearchPaginator, _super);

    function SearchPaginator() {
      _ref = SearchPaginator.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SearchPaginator.prototype.model = SearchPageModel;

    SearchPaginator.prototype.initialize = function(models, options) {
      if (options == null) {
        options = {};
      }
      this.field = options.field;
      return SearchPaginator.__super__.initialize.call(this, models, options);
    };

    SearchPaginator.prototype.url = function() {
      var url;
      url = this.field.links.values;
      if (this.urlParams != null) {
        url = "" + url + "?" + (c.$.param(this.urlParams));
      }
      return url;
    };

    return SearchPaginator;

  })(models.Paginator);
  ValueSearch = (function(_super) {
    __extends(ValueSearch, _super);

    function ValueSearch() {
      _ref1 = ValueSearch.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ValueSearch.prototype.className = 'field-search search';

    ValueSearch.prototype.template = templates.search;

    ValueSearch.prototype.ui = {
      input: 'input'
    };

    ValueSearch.prototype.events = {
      'keydown input': 'search'
    };

    ValueSearch.prototype.initialize = function() {
      ValueSearch.__super__.initialize.apply(this, arguments);
      this.paginator = this.options.paginator;
      return this.search = c._.debounce(this.search, 300);
    };

    ValueSearch.prototype.search = function(event) {
      var value;
      value = this.ui.input.val();
      if (value) {
        this.paginator.urlParams = {
          query: value
        };
      } else {
        this.paginator.urlParams = null;
      }
      return this.paginator.refresh();
    };

    return ValueSearch;

  })(search.Search);
  SearchItem = (function(_super) {
    __extends(SearchItem, _super);

    SearchItem.prototype.className = 'value-item';

    SearchItem.prototype.template = templates.item;

    SearchItem.prototype.ui = {
      actions: '.actions'
    };

    SearchItem.prototype.events = {
      'click button': 'addItem'
    };

    function SearchItem(options) {
      if (options == null) {
        options = {};
      }
      if ((this.values = options.values)) {
        this.listenTo(this.values, 'add', this.setState, this);
        this.listenTo(this.values, 'remove', this.setState, this);
        this.listenTo(this.values, 'reset', this.setState, this);
      }
      SearchItem.__super__.constructor.call(this, options);
    }

    SearchItem.prototype.addItem = function() {
      var attrs;
      attrs = c._.extend(this.model.toJSON(), {
        valid: true
      });
      return this.values.add(attrs);
    };

    SearchItem.prototype.setState = function() {
      return this.$el.toggleClass('disabled', !!this.values.get(this.model));
    };

    SearchItem.prototype.onRender = function() {
      return this.setState();
    };

    return SearchItem;

  })(c.Marionette.ItemView);
  SearchPage = (function(_super) {
    __extends(SearchPage, _super);

    function SearchPage() {
      _ref2 = SearchPage.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    SearchPage.prototype.className = 'search-value-list';

    SearchPage.prototype.itemView = SearchItem;

    return SearchPage;

  })(paginator.ListingPage);
  SearchPageRoll = (function(_super) {
    __extends(SearchPageRoll, _super);

    function SearchPageRoll() {
      _ref3 = SearchPageRoll.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    SearchPageRoll.prototype.listView = SearchPage;

    return SearchPageRoll;

  })(paginator.PageRoll);
  FieldValueSearch = (function(_super) {
    __extends(FieldValueSearch, _super);

    function FieldValueSearch() {
      _ref4 = FieldValueSearch.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    FieldValueSearch.prototype.className = 'field-value-search';

    FieldValueSearch.prototype.template = templates.layout;

    FieldValueSearch.prototype.regions = {
      search: '.search-region',
      paginator: '.paginator-region',
      browse: '.browse-region',
      values: '.values-region'
    };

    FieldValueSearch.prototype.initialize = function(options) {
      var _this = this;
      FieldValueSearch.__super__.initialize.call(this, options);
      if (!this.collection) {
        this.collection = new models.Values;
        this.collection.url = function() {
          return _this.model.links.values;
        };
      }
      this.collection.on('all', this.change, this);
      this.valuesPaginator = new SearchPaginator(null, {
        field: this.model
      });
      return this.valuesPaginator.refresh();
    };

    FieldValueSearch.prototype.onRender = function() {
      this.search.show(new ValueSearch({
        model: this.model,
        paginator: this.valuesPaginator,
        placeholder: "Search " + (this.model.get('plural_name')) + "..."
      }));
      this.browse.show(new SearchPageRoll({
        collection: this.valuesPaginator,
        values: this.collection
      }));
      this.paginator.show(new paginator.Paginator({
        className: 'paginator mini',
        model: this.valuesPaginator
      }));
      this.values.show(new values.ValueList({
        collection: this.collection
      }));
      return this.set(this.context);
    };

    FieldValueSearch.prototype.getOperator = function() {
      return 'in';
    };

    FieldValueSearch.prototype.getValue = function() {
      return this.collection.toJSON();
    };

    FieldValueSearch.prototype.setValue = function(value) {
      return this.collection.set(value, {
        merge: false
      });
    };

    return FieldValueSearch;

  })(controls.Control);
  return {
    FieldValueSearch: FieldValueSearch
  };
});

/*
//@ sourceMappingURL=search.js.map
*/