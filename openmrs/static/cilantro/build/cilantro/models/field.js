var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', './base', './stats'], function(c, base, stats) {
  var FieldCollection, FieldModel, _ref;
  FieldModel = (function(_super) {
    __extends(FieldModel, _super);

    function FieldModel() {
      var _this = this;
      FieldModel.__super__.constructor.apply(this, arguments);
      if (this.links.stats) {
        this.stats = new stats.StatCollection;
        this.stats.url = function() {
          return _this.links.stats;
        };
      }
    }

    FieldModel.prototype.parse = function() {
      this._cache = {};
      return FieldModel.__super__.parse.apply(this, arguments);
    };

    FieldModel.prototype.distribution = function(handler, cache) {
      var _this = this;
      if (cache == null) {
        cache = true;
      }
      if (this.links.distribution == null) {
        handler();
      }
      if (cache && (this._cache.distribution != null)) {
        handler(this._cache.distribution);
      } else {
        c.Backbone.ajax({
          url: this.links.distribution,
          dataType: 'json',
          success: function(resp) {
            _this._cache.distribution = cache ? resp : null;
            return handler(resp);
          }
        });
      }
    };

    FieldModel.prototype.values = function(query, handler, cache) {
      var _this = this;
      if (cache == null) {
        cache = true;
      }
      if (typeof query === 'function') {
        handler = query;
        cache = handler;
        query = '';
      } else {
        cache = false;
      }
      if (this.links.values == null) {
        handler();
      }
      if (cache && (this._cache.values != null)) {
        handler(this._cache.values);
      } else {
        c.Backbone.ajax({
          url: this.links.values,
          data: {
            query: query
          },
          dataType: 'json',
          success: function(resp) {
            _this._cache.values = cache ? resp : null;
            return handler(resp);
          }
        });
      }
    };

    return FieldModel;

  })(base.Model);
  FieldCollection = (function(_super) {
    __extends(FieldCollection, _super);

    function FieldCollection() {
      _ref = FieldCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FieldCollection.prototype.model = FieldModel;

    FieldCollection.prototype.url = function() {
      return c.getSessionUrl('fields');
    };

    FieldCollection.prototype.search = function(query, handler) {
      return c.Backbone.ajax({
        url: c._.result(this, 'url'),
        data: {
          query: query
        },
        dataType: 'json',
        success: function(resp) {
          return handler(resp);
        }
      });
    };

    return FieldCollection;

  })(base.Collection);
  return {
    FieldModel: FieldModel,
    FieldCollection: FieldCollection
  };
});

/*
//@ sourceMappingURL=field.js.map
*/