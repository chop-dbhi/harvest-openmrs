var __slice = [].slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(['../core', './core', './utils', 'tpl!templates/charts/chart.html'], function() {
  var FieldChart, c, charts, templates, utils, _ref;
  c = arguments[0], charts = arguments[1], utils = arguments[2], templates = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
  templates = c._.object(['chart'], templates);
  FieldChart = (function(_super) {
    __extends(FieldChart, _super);

    function FieldChart() {
      this.setValue = __bind(this.setValue, this);
      this.chartClick = __bind(this.chartClick, this);
      _ref = FieldChart.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FieldChart.prototype.template = templates.chart;

    FieldChart.prototype.ui = {
      chart: '.chart',
      heading: '.heading',
      status: '.heading .status'
    };

    FieldChart.prototype.chartClick = function(event) {
      var category, _ref1;
      category = (_ref1 = event.point.category) != null ? _ref1 : event.point.name;
      event.point.select(!event.point.selected, true);
      return this.change();
    };

    FieldChart.prototype.interactive = function(options) {
      var type, _ref1;
      if ((type = (_ref1 = options.chart) != null ? _ref1.type : void 0) === 'pie') {
        return true;
      } else if (type === 'column' && (options.xAxis.categories != null)) {
        return true;
      }
      return false;
    };

    FieldChart.prototype.getChartOptions = function(resp) {
      var options;
      options = utils.processResponse(resp, [this.model]);
      if (options.clustered) {
        this.ui.status.text('Clustered').show();
      } else {
        this.ui.status.hide();
      }
      if (this.interactive(options)) {
        this.setOption('plotOptions.series.events.click', this.chartClick);
      }
      $.extend(true, options, this.chartOptions);
      options.chart.renderTo = this.ui.chart[0];
      return options;
    };

    FieldChart.prototype.getField = function() {
      return this.model.id;
    };

    FieldChart.prototype.getValue = function(options) {
      var point, points;
      points = this.chart.getSelectedPoints();
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = points.length; _i < _len; _i++) {
          point = points[_i];
          _results.push(point.category);
        }
        return _results;
      })();
    };

    FieldChart.prototype.getOperator = function() {
      return 'in';
    };

    FieldChart.prototype.removeChart = function(event) {
      FieldChart.__super__.removeChart.apply(this, arguments);
      if (this.node) {
        return this.node.destroy();
      }
    };

    FieldChart.prototype.onRender = function() {
      var _this = this;
      if (this.options.parentView != null) {
        this.ui.chart.width(this.options.parentView.$el.width());
      }
      return this.model.distribution(function(resp) {
        var options;
        options = _this.getChartOptions(resp);
        if (resp.size) {
          return _this.renderChart(options);
        } else {
          return _this.showEmptyView(options);
        }
      });
    };

    FieldChart.prototype.setValue = function(value) {
      var point, points, _i, _len, _ref1, _ref2, _results;
      if (!c._.isArray(value)) {
        value = [];
      }
      points = this.chart.series[0].points;
      _results = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        _results.push(point.select((_ref1 = point.name) != null ? _ref1 : (_ref2 = point.category, __indexOf.call(value, _ref2) >= 0), true));
      }
      return _results;
    };

    return FieldChart;

  })(charts.Chart);
  return {
    FieldChart: FieldChart
  };
});

/*
//@ sourceMappingURL=dist.js.map
*/