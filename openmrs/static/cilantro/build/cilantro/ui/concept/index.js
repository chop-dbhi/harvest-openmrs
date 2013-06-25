var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', '../base', '../accordian'], function(c, base, accordian) {
  var ConceptGroup, ConceptIndex, ConceptItem, ConceptSection, _ref, _ref1, _ref2, _ref3;
  ConceptItem = (function(_super) {
    __extends(ConceptItem, _super);

    function ConceptItem() {
      this.toggleFocus = __bind(this.toggleFocus, this);
      _ref = ConceptItem.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ConceptItem.prototype.events = {
      'click a': 'click'
    };

    ConceptItem.prototype.initialize = function() {
      return this.subscribe(c.CONCEPT_FOCUS, this.toggleFocus);
    };

    ConceptItem.prototype.click = function(event) {
      event.preventDefault();
      return c.publish(c.CONCEPT_FOCUS, this.model.id);
    };

    ConceptItem.prototype.toggleFocus = function(id) {
      return this.$el.toggleClass('active', id === this.model.id);
    };

    return ConceptItem;

  })(accordian.Item);
  ConceptSection = (function(_super) {
    __extends(ConceptSection, _super);

    function ConceptSection() {
      _ref1 = ConceptSection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ConceptSection.prototype.itemView = ConceptItem;

    ConceptSection.prototype.filter = function(query, models) {
      var show;
      show = false;
      this.children.each(function(view) {
        if (!query || (models[view.model.cid] != null)) {
          view.$el.show();
          return show = true;
        } else {
          return view.$el.hide();
        }
      });
      this.$el.toggle(show && !this.isEmpty());
      return show;
    };

    return ConceptSection;

  })(accordian.Section);
  ConceptGroup = (function(_super) {
    __extends(ConceptGroup, _super);

    function ConceptGroup() {
      _ref2 = ConceptGroup.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ConceptGroup.prototype.itemView = ConceptSection;

    ConceptGroup.prototype.filter = function(query, models) {
      var show;
      show = false;
      this.children.each(function(view) {
        if (view.filter(query, models)) {
          return show = true;
        }
      });
      this.$el.toggle(show && !this.isEmpty());
      return show;
    };

    ConceptGroup.prototype.find = function(model) {
      var child, cid, view, _ref3, _ref4;
      _ref3 = this.children._views;
      for (cid in _ref3) {
        view = _ref3[cid];
        if ((child = (_ref4 = view.children) != null ? _ref4.findByModel(model) : void 0)) {
          return child;
        }
      }
    };

    return ConceptGroup;

  })(accordian.Group);
  ConceptIndex = (function(_super) {
    __extends(ConceptIndex, _super);

    function ConceptIndex() {
      _ref3 = ConceptIndex.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    ConceptIndex.prototype.className = 'concept-index accordian';

    ConceptIndex.prototype.itemView = ConceptGroup;

    ConceptIndex.prototype.showCollection = function() {
      var _this = this;
      this.resetGroups();
      this.groups.each(function(item, index) {
        return _this.addItemView(item, _this.getItemView(item), index);
      });
    };

    ConceptIndex.prototype.getGroup = function(attrs) {
      var group;
      if (attrs.category != null) {
        group = attrs.category;
        while (group.parent != null) {
          group = group.parent;
        }
        return group;
      }
      return {
        id: -1,
        name: 'Other'
      };
    };

    ConceptIndex.prototype.getSection = function(attrs) {
      var _ref4;
      if (((_ref4 = attrs.category) != null ? _ref4.parent : void 0) != null) {
        return attrs.category;
      }
      return {
        id: -1,
        name: 'Other'
      };
    };

    ConceptIndex.prototype.resetGroups = function() {
      var model, _i, _len, _ref4;
      if (this.groups == null) {
        this.groups = new c.Backbone.Collection(null, {
          comparator: 'order'
        });
      } else {
        this.groups.reset();
      }
      _ref4 = this.collection.models;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        model = _ref4[_i];
        this.groupModel(model);
      }
    };

    ConceptIndex.prototype.groupModel = function(model) {
      var attrs, group, groupAttrs, section, sectionAttrs;
      attrs = model.attributes;
      groupAttrs = this.getGroup(attrs);
      sectionAttrs = this.getSection(attrs);
      if (!(group = this.groups.get(groupAttrs.id))) {
        group = new c.Backbone.Model(groupAttrs);
        group.sections = new c.Backbone.Collection(null, {
          comparator: 'order'
        });
        this.groups.add(group);
      }
      if (!(section = group.sections.get(sectionAttrs.id))) {
        section = new c.Backbone.Model(sectionAttrs);
        section.items = new c.Backbone.Collection(null, {
          comparator: 'order'
        });
        group.sections.add(section);
      }
      section.items.add(model);
    };

    ConceptIndex.prototype.filter = function(query, resp) {
      var datum, model, models, _i, _len;
      models = {};
      if (query) {
        for (_i = 0, _len = resp.length; _i < _len; _i++) {
          datum = resp[_i];
          if ((model = this.collection.get(datum.id))) {
            models[model.cid] = model;
          }
        }
      }
      return this.children.each(function(view) {
        return view.filter(query, models);
      });
    };

    ConceptIndex.prototype.find = function(model) {
      var child, cid, view, _ref4;
      _ref4 = this.children._views;
      for (cid in _ref4) {
        view = _ref4[cid];
        if ((child = typeof view.find === "function" ? view.find(model) : void 0)) {
          return child;
        }
      }
    };

    return ConceptIndex;

  })(accordian.Accordian);
  return {
    ConceptIndex: ConceptIndex,
    ConceptGroup: ConceptGroup,
    ConceptSection: ConceptSection,
    ConceptItem: ConceptItem
  };
});

/*
//@ sourceMappingURL=index.js.map
*/