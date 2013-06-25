var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core'], function(c) {
  var Collection, Model;
  Model = (function(_super) {
    __extends(Model, _super);

    Model.prototype.url = function() {
      if (this.isNew()) {
        return Model.__super__.url.apply(this, arguments);
      } else {
        return this.links.self;
      }
    };

    function Model(attrs, options) {
      this.links = {};
      Model.__super__.constructor.call(this, attrs, options);
    }

    Model.prototype.parse = function(attrs, options) {
      var link, name, _ref;
      if ((attrs != null) && (attrs._links != null)) {
        this.links = {};
        _ref = attrs._links;
        for (name in _ref) {
          link = _ref[name];
          this.links[name] = link.href;
        }
      }
      return attrs;
    };

    return Model;

  })(c.Backbone.Model);
  Collection = (function(_super) {
    __extends(Collection, _super);

    Collection.prototype.model = Model;

    Collection.prototype.url = function() {
      if (this.isNew()) {
        return Collection.__super__.url.apply(this, arguments);
      } else {
        return this.links.self;
      }
    };

    function Collection(attrs, options) {
      this.links = {};
      Collection.__super__.constructor.call(this, attrs, options);
    }

    Collection.prototype.parse = function(attrs, options) {
      var link, name, _ref;
      if ((attrs != null) && (attrs._links != null)) {
        this.links = {};
        _ref = attrs._links;
        for (name in _ref) {
          link = _ref[name];
          this.links[name] = link.href;
        }
      }
      return attrs;
    };

    return Collection;

  })(c.Backbone.Collection);
  return {
    Model: Model,
    Collection: Collection
  };
});

/*
//@ sourceMappingURL=base.js.map
*/