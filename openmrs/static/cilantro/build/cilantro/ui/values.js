var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./core', './base', '../models', 'tpl!templates/values/list.html', 'tpl!templates/values/item.html'], function() {
  var EmptyItem, ValueItem, ValueList, base, c, models, templates, _ref, _ref1, _ref2;
  c = arguments[0], base = arguments[1], models = arguments[2], templates = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
  templates = c._.object(['list', 'item'], templates);
  EmptyItem = (function(_super) {
    __extends(EmptyItem, _super);

    function EmptyItem() {
      _ref = EmptyItem.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    EmptyItem.prototype.icon = false;

    EmptyItem.prototype.message = 'Search or browse values on the left or click "Edit List" above to paste in a list of values. (Hint: you can copy and paste in a column from Excel)';

    return EmptyItem;

  })(base.EmptyView);
  ValueItem = (function(_super) {
    __extends(ValueItem, _super);

    function ValueItem() {
      _ref1 = ValueItem.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ValueItem.prototype.template = templates.item;

    ValueItem.prototype.className = 'value-item';

    ValueItem.prototype.ui = {
      status: '.status',
      remove: 'button'
    };

    ValueItem.prototype.events = {
      'click button': 'destroy'
    };

    ValueItem.prototype.modelEvents = {
      'change:valid': 'toggleValid',
      'change:pending': 'togglePending'
    };

    ValueItem.prototype.destroy = function() {
      return this.model.destroy();
    };

    ValueItem.prototype.toggleValid = function(model, valid, options) {
      var _this = this;
      this.ui.status.show();
      if (valid) {
        return this.ui.status.html('<i class="icon-ok text-success"></i>').fadeOut(2000, function() {
          return _this.ui.status.html('');
        });
      } else {
        return this.ui.status.html('<i class="icon-exclamation text-warning"></i>');
      }
    };

    ValueItem.prototype.togglePending = function(model, pending, options) {
      if (!pending) {
        return;
      }
      return this.ui.status.html('<i class="icon-spinner icon-spin"></i>').show();
    };

    return ValueItem;

  })(c.Marionette.ItemView);
  ValueList = (function(_super) {
    __extends(ValueList, _super);

    function ValueList() {
      _ref2 = ValueList.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ValueList.prototype.className = 'value-list';

    ValueList.prototype.template = templates.list;

    ValueList.prototype.itemView = ValueItem;

    ValueList.prototype.emptyView = EmptyItem;

    ValueList.prototype.itemViewContainer = '.items-list';

    ValueList.prototype.collectionEvents = {
      'reset': 'clearText',
      'sort': 'sortItems'
    };

    ValueList.prototype.ui = {
      toggle: '.toggle',
      list: '.items-list',
      textarea: '.items-text'
    };

    ValueList.prototype.events = {
      'click .toggle': 'toggle',
      'click .clear': 'clear'
    };

    ValueList.prototype.clear = function(event) {
      if (event != null) {
        event.preventDefault();
      }
      return this.collection.reset();
    };

    ValueList.prototype.toggle = function(event) {
      if (event != null) {
        event.preventDefault();
      }
      if (this.ui.list.is(':visible')) {
        this.loadText();
        this.ui.list.hide();
        this.ui.textarea.show();
        return this.ui.toggle.html('<i class=icon-list></i> Show List');
      } else {
        this.parseText();
        this.ui.list.show();
        this.ui.textarea.hide();
        return this.ui.toggle.html('<i class=icon-edit></i> Edit List');
      }
    };

    ValueList.prototype.sortItems = function(collection, options) {
      var _this = this;
      return this.collection.each(function(model) {
        var view;
        view = _this.children.findByModel(model);
        return _this.$(_this.itemViewContainer).append(view.el);
      });
    };

    ValueList.prototype.clearText = function() {
      return this.ui.textarea.val('');
    };

    ValueList.prototype.loadText = function() {
      return this.ui.textarea.val(this.collection.pluck('value').join('\n'));
    };

    ValueList.prototype.parseText = function() {
      var i, model, value, values, _i, _len;
      models = [];
      values = c.$.trim(this.ui.textarea.val()).split('\n');
      for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
        value = values[i];
        if (!(value = $.trim(value))) {
          continue;
        }
        if ((model = this.collection.get(value))) {
          model.set('index', i);
          models.push(model);
        } else {
          models.push({
            value: value,
            label: value,
            index: i
          });
        }
      }
      return this.collection.set(models);
    };

    return ValueList;

  })(c.Marionette.CompositeView);
  return {
    ValueList: ValueList
  };
});

/*
//@ sourceMappingURL=values.js.map
*/