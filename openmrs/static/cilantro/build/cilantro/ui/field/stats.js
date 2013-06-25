var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', '../base', '../charts', '../charts/utils', 'tpl!templates/field/stats.html'], function() {
  var FieldStatValue, FieldStats, FieldStatsChart, FieldStatsValues, base, c, charts, templates, utils, _ref, _ref1, _ref2, _ref3;
  c = arguments[0], base = arguments[1], charts = arguments[2], utils = arguments[3], templates = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
  templates = c._.object(['layout'], templates);
  FieldStatValue = (function(_super) {
    __extends(FieldStatValue, _super);

    function FieldStatValue() {
      _ref = FieldStatValue.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FieldStatValue.prototype.tagName = 'li';

    FieldStatValue.prototype.template = function(data) {
      return "<span class=stat-label>" + data.label + "</span><span class=stat-value>" + data.value + "</span>";
    };

    return FieldStatValue;

  })(c.Marionette.ItemView);
  FieldStatsValues = (function(_super) {
    __extends(FieldStatsValues, _super);

    function FieldStatsValues() {
      _ref1 = FieldStatsValues.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FieldStatsValues.prototype.tagName = 'ul';

    FieldStatsValues.prototype.emptyView = base.EmptyView;

    FieldStatsValues.prototype.itemView = FieldStatValue;

    return FieldStatsValues;

  })(c.Marionette.CollectionView);
  FieldStatsChart = (function(_super) {
    __extends(FieldStatsChart, _super);

    function FieldStatsChart() {
      _ref2 = FieldStatsChart.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    FieldStatsChart.prototype.className = 'sparkline';

    FieldStatsChart.prototype.chartOptions = c.Backbone.Sparkline.prototype.chartOptions;

    FieldStatsChart.prototype.getChartOptions = function(resp) {
      var options;
      options = {
        series: [utils.getSeries(resp.data)]
      };
      c.$.extend(true, options, this.chartOptions);
      options.chart.renderTo = this.ui.chart[0];
      return options;
    };

    return FieldStatsChart;

  })(charts.FieldChart);
  FieldStats = (function(_super) {
    __extends(FieldStats, _super);

    function FieldStats() {
      _ref3 = FieldStats.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    FieldStats.prototype.className = 'field-stats';

    FieldStats.prototype.template = templates.layout;

    FieldStats.prototype.regions = {
      values: '.stats-values',
      chart: '.stats-chart'
    };

    FieldStats.prototype.onRender = function() {
      if (this.model.stats != null) {
        this.values.show(new FieldStatsValues({
          collection: this.model.stats
        }));
        if (!this.model.stats.length) {
          return this.model.stats.fetch({
            reset: true
          });
        }
      }
    };

    return FieldStats;

  })(c.Marionette.Layout);
  return {
    FieldStats: FieldStats
  };
});

/*
//@ sourceMappingURL=stats.js.map
*/