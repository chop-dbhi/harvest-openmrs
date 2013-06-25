var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', './base', './field'], function(c, base, field) {
  var BaseConceptCollection, ConceptCollection, ConceptModel, _ref;
  ConceptModel = (function(_super) {
    __extends(ConceptModel, _super);

    function ConceptModel(attrs, options) {
      if (options == null) {
        options = {};
      }
      this.fields = new field.FieldCollection;
      options.parse = true;
      ConceptModel.__super__.constructor.call(this, attrs, options);
    }

    ConceptModel.prototype.initialize = function() {
      var _this = this;
      ConceptModel.__super__.initialize.apply(this, arguments);
      return c.subscribe(c.CONCEPT_FOCUS, function(id) {
        if (_this.id !== id) {
          return;
        }
        if (!_this.fields.length) {
          return _this.fields.fetch({
            reset: true
          });
        }
      });
    };

    ConceptModel.prototype.parse = function(resp, options) {
      var _this = this;
      ConceptModel.__super__.parse.apply(this, arguments);
      this.fields.url = function() {
        return _this.links.fields;
      };
      if ((resp != null ? resp.fields : void 0) != null) {
        this.fields.set(resp.fields, options);
        delete resp.fields;
      }
      return resp;
    };

    return ConceptModel;

  })(base.Model);
  BaseConceptCollection = (function(_super) {
    __extends(BaseConceptCollection, _super);

    function BaseConceptCollection() {
      _ref = BaseConceptCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseConceptCollection.prototype.model = ConceptModel;

    BaseConceptCollection.prototype.url = function() {
      return c.getSessionUrl('concepts');
    };

    BaseConceptCollection.prototype.search = function(query, handler) {
      return c.ajax({
        url: c._.result(this, 'url'),
        data: {
          query: query,
          brief: 1
        },
        dataType: 'json',
        success: function(resp) {
          return handler(resp);
        }
      });
    };

    return BaseConceptCollection;

  })(base.Collection);
  ConceptCollection = (function(_super) {
    __extends(ConceptCollection, _super);

    function ConceptCollection() {
      this.queryable = new BaseConceptCollection;
      this.viewable = new BaseConceptCollection;
      ConceptCollection.__super__.constructor.apply(this, arguments);
    }

    ConceptCollection.prototype.initialize = function() {
      var _this = this;
      ConceptCollection.__super__.initialize.apply(this, arguments);
      c.subscribe(c.SESSION_OPENED, function() {
        return _this.fetch({
          reset: true
        });
      });
      c.subscribe(c.SESSION_CLOSED, function() {
        return _this.reset();
      });
      this.on('reset', function() {
        this.queryable.reset(this.filter(function(m) {
          return !!m.get('queryview');
        }));
        return this.viewable.reset(this.filter(function(m) {
          return !!m.get('formatter_name');
        }));
      });
      return this.on('reset', this.resolve);
    };

    return ConceptCollection;

  })(BaseConceptCollection);
  return {
    ConceptModel: ConceptModel,
    ConceptCollection: ConceptCollection
  };
});

/*
//@ sourceMappingURL=concept.js.map
*/