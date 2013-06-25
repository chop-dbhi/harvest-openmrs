var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', './base'], function(c, base) {
  var ExporterCollection, ExporterModel, _ref, _ref1;
  ExporterModel = (function(_super) {
    __extends(ExporterModel, _super);

    function ExporterModel() {
      _ref = ExporterModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return ExporterModel;

  })(base.Model);
  ExporterCollection = (function(_super) {
    __extends(ExporterCollection, _super);

    function ExporterCollection() {
      _ref1 = ExporterCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ExporterCollection.prototype.model = ExporterModel;

    ExporterCollection.prototype.minSerranoVersionProgressEnabled = [2, 0, 16];

    ExporterCollection.prototype.url = function() {
      return c.getSessionUrl('exporter');
    };

    ExporterCollection.prototype.initialize = function() {
      var _this = this;
      ExporterCollection.__super__.initialize.apply(this, arguments);
      c.subscribe(c.SESSION_OPENED, function() {
        return _this.fetch({
          reset: true
        });
      });
      c.subscribe(c.SESSION_CLOSED, function() {
        return _this.reset();
      });
      return this.version = [0, 0, 0];
    };

    ExporterCollection.prototype.notifiesOnComplete = function() {
      var i, versionHasProgressFeature, _i;
      versionHasProgressFeature = true;
      for (i = _i = 0; _i <= 2; i = _i += 1) {
        if (this.version[i] < this.minSerranoVersionProgressEnabled[i]) {
          versionHasProgressFeature = false;
        }
      }
      return versionHasProgressFeature;
    };

    ExporterCollection.prototype.parse = function(attrs) {
      var key, versionFields, _i, _len, _ref2;
      if ((attrs != null) && (attrs._links != null)) {
        if ((attrs.version != null) && attrs.version.split(".").length === 3) {
          versionFields = attrs.version.split(".");
          this.version = [parseInt(versionFields[0], 10), parseInt(versionFields[1], 10), parseInt(versionFields[2], 10)];
        }
        _ref2 = Object.keys(attrs._links);
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          key = _ref2[_i];
          if (key !== "self") {
            this.push(new ExporterModel(attrs._links[key]));
          }
        }
        return this.models;
      }
    };

    return ExporterCollection;

  })(base.Collection);
  return {
    ExporterModel: ExporterModel,
    ExporterCollection: ExporterCollection
  };
});

/*
//@ sourceMappingURL=exporter.js.map
*/