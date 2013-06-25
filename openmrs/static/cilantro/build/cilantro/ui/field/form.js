var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', '../base', './info', './stats', './controls', '../infograph', '../charts', 'tpl!templates/field/form.html', 'tpl!templates/field/form-condensed.html'], function() {
  var FieldControlOptions, FieldControls, FieldForm, FieldFormCollection, LoadingControls, base, c, charts, controls, getControlView, info, infograph, stats, templates, _ref, _ref1, _ref2, _ref3;
  c = arguments[0], base = arguments[1], info = arguments[2], stats = arguments[3], controls = arguments[4], infograph = arguments[5], charts = arguments[6], templates = 8 <= arguments.length ? __slice.call(arguments, 7) : [];
  templates = c._.object(['form', 'condensed'], templates);
  getControlView = function(model) {
    var type;
    type = model.get('simple_type');
    if (model.get('enumerable') || type === 'boolean') {
      return infograph.BarChart;
    } else if (model.get('searchable')) {
      return controls.FieldValueSearch;
    } else if (type === 'number') {
      return controls.NumberControl;
    } else if (type === 'boolean') {
      return controls.BooleanControl;
    }
  };
  LoadingControls = (function(_super) {
    __extends(LoadingControls, _super);

    function LoadingControls() {
      _ref = LoadingControls.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LoadingControls.prototype.message = 'Loading and rendering controls...';

    return LoadingControls;

  })(base.LoadView);
  FieldControls = (function(_super) {
    __extends(FieldControls, _super);

    function FieldControls() {
      _ref1 = FieldControls.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FieldControls.prototype.emptyView = LoadingControls;

    FieldControls.prototype.getItemView = function(model) {
      var itemView;
      if ((itemView = model.get('itemView')) == null) {
        itemView = getControlView(model.get('model'));
      }
      return itemView;
    };

    FieldControls.prototype.itemViewOptions = function(model, index) {
      return model.attributes;
    };

    FieldControls.prototype.buildItemView = function(model, itemView, options) {
      return new itemView(options);
    };

    return FieldControls;

  })(c.Marionette.CollectionView);
  FieldControlOptions = (function(_super) {
    __extends(FieldControlOptions, _super);

    function FieldControlOptions() {
      _ref2 = FieldControlOptions.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    return FieldControlOptions;

  })(c.Backbone.Model);
  FieldForm = (function(_super) {
    __extends(FieldForm, _super);

    FieldForm.prototype.className = 'field-form';

    FieldForm.prototype.getTemplate = function() {
      if (this.options.condensedLayout) {
        return templates.condensed;
      } else {
        return templates.form;
      }
    };

    FieldForm.prototype.options = {
      showInfo: true,
      showChart: false,
      showDefaultControl: true,
      condensedLayout: false
    };

    function FieldForm() {
      FieldForm.__super__.constructor.apply(this, arguments);
      this.context = this.options.context;
    }

    FieldForm.prototype.regions = {
      info: '.info-region',
      stats: '.stats-region',
      controls: '.controls-region'
    };

    FieldForm.prototype.onRender = function() {
      if (this.options.showInfo) {
        this.info.show(new info.FieldInfo({
          model: this.model
        }));
      }
      if (this.model.stats != null) {
        this.stats.show(new stats.FieldStats({
          model: this.model
        }));
      }
      this.controls.show(new FieldControls({
        collection: new c.Backbone.Collection
      }));
      if (this.options.showDefaultControl) {
        this.addControl();
      }
      if (!this.model.get('enumerable')) {
        if (this.options.showChart && (this.model.links.distribution != null)) {
          this.addControl(charts.FieldChart, {
            chart: {
              height: 200
            }
          });
        }
      }
      if (this.options.condensedLayout) {
        return this.$el.addClass('condensed');
      }
    };

    FieldForm.prototype.addControl = function(itemView, options) {
      var model;
      model = new FieldControlOptions(c._.defaults({
        model: this.model,
        context: this.context,
        itemView: itemView
      }, options));
      return this.controls.currentView.collection.add(model);
    };

    return FieldForm;

  })(c.Marionette.Layout);
  FieldFormCollection = (function(_super) {
    __extends(FieldFormCollection, _super);

    function FieldFormCollection() {
      _ref3 = FieldFormCollection.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    FieldFormCollection.prototype.itemView = FieldForm;

    FieldFormCollection.prototype.itemViewOptions = function(model, index) {
      var context, options;
      context = this.options.context;
      options = {
        model: model,
        context: context.find({
          field: model.id,
          concept: context.get('concept')
        }, {
          create: 'condition'
        })
      };
      if (this.options.hideSingleFieldInfo && this.collection.length < 2) {
        options.showInfo = false;
      }
      if (this.fieldChartIndex == null) {
        if (model.links.distribution != null) {
          this.fieldChartIndex = index;
          options.showChart = true;
        }
      } else {
        options.condensedLayout = true;
      }
      return options;
    };

    return FieldFormCollection;

  })(c.Marionette.CollectionView);
  return {
    FieldForm: FieldForm,
    FieldFormCollection: FieldFormCollection
  };
});

/*
//@ sourceMappingURL=form.js.map
*/