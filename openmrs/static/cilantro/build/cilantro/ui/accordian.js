var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./core', './base', 'tpl!templates/accordian/group.html', 'tpl!templates/accordian/section.html', 'tpl!templates/accordian/item.html'], function() {
  var Accordian, Group, Item, Section, base, c, templates, _ref, _ref1, _ref2, _ref3;
  c = arguments[0], base = arguments[1], templates = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  templates = c._.object(['group', 'section', 'item'], templates);
  Item = (function(_super) {
    __extends(Item, _super);

    function Item() {
      _ref = Item.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Item.prototype.tagName = 'li';

    Item.prototype.template = templates.item;

    return Item;

  })(c.Marionette.ItemView);
  Section = (function(_super) {
    __extends(Section, _super);

    function Section() {
      _ref1 = Section.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Section.prototype.className = 'section';

    Section.prototype.itemView = Item;

    Section.prototype.template = templates.section;

    Section.prototype.itemViewContainer = '.items';

    Section.prototype.ui = {
      heading: '.heading'
    };

    Section.prototype.isEmpty = function() {
      return !this.collection.length;
    };

    Section.prototype.onCompositeCollectionRendered = function() {
      return this.$el.toggle(!this.isEmpty());
    };

    return Section;

  })(c.Marionette.CompositeView);
  Group = (function(_super) {
    __extends(Group, _super);

    function Group() {
      _ref2 = Group.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Group.prototype.className = 'group';

    Group.prototype.template = templates.group;

    Group.prototype.itemView = Section;

    Group.prototype.itemViewContainer = '.sections';

    Group.prototype.itemSectionItems = 'items';

    Group.prototype.options = {
      collapsable: true
    };

    Group.prototype.itemViewOptions = function(model, index) {
      return {
        model: model,
        index: index,
        collection: model[this.itemSectionItems]
      };
    };

    Group.prototype.ui = {
      heading: '.heading',
      icon: '.heading span',
      inner: '.inner'
    };

    Group.prototype.events = {
      'click > .heading': 'toggleCollapse',
      'shown > .inner': 'showCollapse',
      'hidden > .inner': 'hideCollapse'
    };

    Group.prototype.onRender = function() {
      if (!this.options.collapsable) {
        this.$('.inner').removeClass('collapse');
        return this.ui.icon.hide();
      }
    };

    Group.prototype.isEmpty = function() {
      var model, _i, _len, _ref3;
      if (this.collection.length) {
        return false;
      }
      _ref3 = this.collection.models;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        model = _ref3[_i];
        if (model.items.length) {
          return false;
        }
      }
      return true;
    };

    Group.prototype.onCompositeCollectionRendered = function() {
      var length, model, view;
      this.$el.toggle(!this.isEmpty());
      if ((length = this.collection.length)) {
        view = this.children.findByModel(model = this.collection.at(0));
        return view.ui.heading.toggle(length > 1 || model.id >= 0);
      }
    };

    Group.prototype.toggleCollapse = function() {
      if (this.options.collapsable) {
        return this.ui.inner.collapse('toggle');
      }
    };

    Group.prototype.showCollapse = function() {
      return this.ui.icon.text('-');
    };

    Group.prototype.hideCollapse = function() {
      return this.ui.icon.text('+');
    };

    return Group;

  })(c.Marionette.CompositeView);
  Accordian = (function(_super) {
    __extends(Accordian, _super);

    function Accordian() {
      _ref3 = Accordian.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Accordian.prototype.className = 'accordian';

    Accordian.prototype.itemView = Group;

    Accordian.prototype.emptyView = base.EmptyView;

    Accordian.prototype.itemGroupSections = 'sections';

    Accordian.prototype.options = {
      collapsable: true
    };

    Accordian.prototype.itemViewOptions = function(model, index) {
      return {
        model: model,
        index: index,
        collection: model[this.itemGroupSections],
        collapsable: this.options.collapsable
      };
    };

    return Accordian;

  })(c.Marionette.CollectionView);
  return {
    Accordian: Accordian,
    Group: Group,
    Section: Section,
    Item: Item
  };
});

/*
//@ sourceMappingURL=accordian.js.map
*/