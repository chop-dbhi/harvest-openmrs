var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['../core', '../controls', '../button', 'tpl!templates/infograph/bar.html', 'tpl!templates/infograph/bar-chart-toolbar.html', 'tpl!templates/infograph/bar-chart.html'], function() {
  var Bar, BarChart, BarChartToolbar, BarCollection, BarModel, Bars, button, c, controls, sortModelAttr, templates, _ref, _ref1, _ref2, _ref3;
  c = arguments[0], controls = arguments[1], button = arguments[2], templates = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
  templates = c._.object(['bar', 'toolbar', 'chart'], templates);
  BarModel = (function(_super) {
    __extends(BarModel, _super);

    function BarModel() {
      _ref = BarModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BarModel.prototype.parse = function(attrs) {
      attrs.value = attrs.values[0];
      return attrs;
    };

    return BarModel;

  })(c.Backbone.Model);
  sortModelAttr = function(attr) {
    return function(model) {
      var value;
      value = model.get(attr);
      if (c._.isString(value)) {
        value = value.toLowerCase();
      }
      return value;
    };
  };
  BarCollection = (function(_super) {
    __extends(BarCollection, _super);

    function BarCollection() {
      _ref1 = BarCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    BarCollection.prototype.model = BarModel;

    BarCollection.prototype.comparator = function(model) {
      return -model.get('count');
    };

    BarCollection.prototype.sortModelsBy = function(attr) {
      var reverse;
      if ((reverse = attr.charAt(0) === '-')) {
        attr = attr.slice(1);
      }
      this.models = this.sortBy(sortModelAttr(attr));
      if (reverse) {
        this.models.reverse();
      }
      this.trigger('sort', this);
    };

    return BarCollection;

  })(c.Backbone.Collection);
  Bar = (function(_super) {
    __extends(Bar, _super);

    function Bar() {
      _ref2 = Bar.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Bar.prototype.className = 'info-bar';

    Bar.prototype.template = templates.bar;

    Bar.prototype.options = {
      total: null
    };

    Bar.prototype.ui = {
      bar: '.bar'
    };

    Bar.prototype.events = {
      'click': 'toggleSelected'
    };

    Bar.prototype.modelEvents = {
      'change:selected': 'setSelected',
      'change:visible': 'setVisible'
    };

    Bar.prototype.serializeData = function() {
      var attrs, percentage;
      attrs = this.model.toJSON();
      attrs.value = attrs.values[0];
      percentage = this.getPercentage();
      attrs.width = percentage;
      if (percentage < 1) {
        attrs.percentage = '<1';
      } else {
        attrs.percentage = parseInt(percentage);
      }
      return attrs;
    };

    Bar.prototype.onRender = function() {
      return this.setSelected(this.model, !!this.model.get('selected'));
    };

    Bar.prototype.getPercentage = function() {
      return this.model.get('count') / this.options.total * 100;
    };

    Bar.prototype.toggleSelected = function(event) {
      return this.model.set('selected', !this.model.get('selected'));
    };

    Bar.prototype.setSelected = function(model, value) {
      this.$el.toggleClass('selected', value);
      if (!value && model.get('visible') === false) {
        return this.$el.removeClass('filtered').hide();
      }
    };

    Bar.prototype.setVisible = function(model, value) {
      if (value) {
        return this.$el.removeClass('filtered').show();
      } else if (model.get('selected')) {
        return this.$el.addClass('filtered');
      } else {
        return this.$el.hide();
      }
    };

    return Bar;

  })(c.Marionette.ItemView);
  Bars = (function(_super) {
    __extends(Bars, _super);

    Bars.prototype.className = 'info-bar-chart';

    Bars.prototype.itemView = Bar;

    Bars.prototype.itemViewOptions = function(model, index) {
      return {
        model: model,
        total: this.calcTotal()
      };
    };

    Bars.prototype.collectionEvents = {
      'change': 'change',
      'sort': 'sortChildren'
    };

    function Bars(options) {
      if (options.collection == null) {
        options.collection = new BarCollection;
      }
      this.bindContext(options.context);
      Bars.__super__.constructor.call(this, options);
    }

    Bars.prototype.initialize = function() {
      var _this = this;
      return this.model.distribution(function(resp) {
        _this.collection.reset(resp.data, {
          parse: true
        });
        return _this.setValue(_this.context.get('value'));
      });
    };

    Bars.prototype.calcTotal = function() {
      var count, total, _i, _len, _ref3;
      total = 0;
      _ref3 = this.collection.pluck('count');
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        count = _ref3[_i];
        total += count;
      }
      return total;
    };

    Bars.prototype.onRender = function() {
      return this.set(this.getContext());
    };

    Bars.prototype.sortChildren = function(collection, options) {
      var _this = this;
      this.collection.each(function(model) {
        var view;
        view = _this.children.findByModel(model);
        return _this.$el.append(view.el);
      });
    };

    Bars.prototype.getField = function() {
      return this.model.id;
    };

    Bars.prototype.getOperator = function() {
      return 'in';
    };

    Bars.prototype.getValue = function() {
      return c._.map(this.collection.where({
        selected: true
      }), function(model) {
        return model.get('value');
      });
    };

    Bars.prototype.setValue = function(values) {
      var model, value, _i, _len;
      if (!(values != null ? values.length : void 0)) {
        return;
      }
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        if ((model = this.collection.findWhere({
          value: value
        }))) {
          model.set('selected', true);
        }
      }
    };

    return Bars;

  })(c.Marionette.CollectionView);
  c._.defaults(Bars.prototype, controls.ControlViewMixin);
  BarChartToolbar = (function(_super) {
    __extends(BarChartToolbar, _super);

    function BarChartToolbar() {
      _ref3 = BarChartToolbar.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    BarChartToolbar.prototype.className = 'navbar navbar-toolbar';

    BarChartToolbar.prototype.template = templates.toolbar;

    BarChartToolbar.prototype.events = {
      'change .btn-select': 'sortBy',
      'keyup [name=filter]': 'filterBars',
      'click [name=invert]': 'invertSelection'
    };

    BarChartToolbar.prototype.ui = {
      toolbar: '.btn-toolbar',
      sortSelect: '.btn-select',
      filterInput: '[name=filter]',
      invertButton: '[name=invert]'
    };

    BarChartToolbar.prototype.onRender = function() {
      this.sortSelect = new button.ButtonSelect({
        collection: [
          {
            value: '-count',
            label: 'Count (desc)',
            selected: true
          }, {
            value: 'count',
            label: 'Count (asc)'
          }, {
            value: '-value',
            label: 'Value (desc)'
          }, {
            value: 'value',
            label: 'Value (asc)'
          }
        ]
      });
      this.sortSelect.render();
      this.sortSelect.$el.addClass('pull-right');
      return this.ui.toolbar.append(this.sortSelect.el);
    };

    BarChartToolbar.prototype.sortBy = function(event) {
      return this.collection.sortModelsBy(this.sortSelect.getSelection());
    };

    BarChartToolbar.prototype.filterBars = function(event) {
      var regex, text;
      event.stopPropagation();
      text = this.ui.filterInput.val();
      regex = new RegExp(text, 'i');
      this.collection.each(function(model) {
        return model.set('visible', !text || regex.test(model.get('value')));
      });
    };

    BarChartToolbar.prototype.invertSelection = function(event) {
      this.collection.each(function(model) {
        if (model.get('visible') !== false || model.get('selected')) {
          return model.set('selected', !model.get('selected'));
        }
      });
      this.collection.trigger('change');
    };

    return BarChartToolbar;

  })(c.Marionette.ItemView);
  BarChart = (function(_super) {
    __extends(BarChart, _super);

    BarChart.prototype.template = templates.chart;

    BarChart.prototype.options = {
      minValuesForToolbar: 10
    };

    BarChart.prototype.regions = {
      toolbar: '.toolbar-region',
      bars: '.bars-region'
    };

    BarChart.prototype.collectionEvents = {
      'reset': 'toggleToolbar'
    };

    function BarChart(options) {
      this.toggleToolbar = __bind(this.toggleToolbar, this);
      if (options.collection == null) {
        options.collection = new BarCollection;
      }
      BarChart.__super__.constructor.call(this, options);
    }

    BarChart.prototype.toggleToolbar = function() {
      if (!this.toolbar.currentView) {
        return;
      }
      return this.toolbar.currentView.$el.toggle(this.collection.length >= this.options.minValuesForToolbar);
    };

    BarChart.prototype.onRender = function() {
      this.bars.show(new Bars({
        model: this.model,
        context: this.context,
        collection: this.collection
      }));
      this.toolbar.show(new BarChartToolbar({
        collection: this.collection
      }));
      return this.toggleToolbar();
    };

    return BarChart;

  })(controls.Control);
  return {
    BarChart: BarChart
  };
});

/*
//@ sourceMappingURL=bar.js.map
*/