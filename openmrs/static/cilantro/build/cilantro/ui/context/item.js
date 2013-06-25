var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', 'tpl!templates/context/item.html'], function() {
  var ContextItem, c, flattenLanguage, templates, _ref;
  c = arguments[0], templates = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  templates = c._.object(['item'], templates);
  flattenLanguage = function(attrs, items) {
    var child, _i, _len, _ref;
    if (items == null) {
      items = [];
    }
    if (attrs.children != null) {
      _ref = attrs.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        flattenLanguage(child, items);
      }
    } else if (attrs.language != null) {
      items.push(attrs.language);
    }
    return items;
  };
  ContextItem = (function(_super) {
    __extends(ContextItem, _super);

    function ContextItem() {
      _ref = ContextItem.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ContextItem.prototype.className = 'context-item';

    ContextItem.prototype.template = templates.item;

    ContextItem.prototype.events = {
      'click .language': 'clickShow',
      'click .actions .state': 'clickState',
      'click .actions .remove': 'clickRemove'
    };

    ContextItem.prototype.ui = {
      loader: '.actions .loader',
      actions: '.actions button',
      state: '.actions .state',
      check: '.actions .state input',
      language: '.language'
    };

    ContextItem.prototype.modelEvents = {
      'change': 'renderLanguage',
      'change:enabled': 'toggleState',
      'request': 'showLoading',
      'sync': 'doneLoading',
      'error': 'doneLoading'
    };

    ContextItem.prototype.clickShow = function(event) {
      c.router.navigate('query', {
        trigger: true
      });
      return c.publish(c.CONCEPT_FOCUS, this.model.get('concept'));
    };

    ContextItem.prototype.clickRemove = function(event) {
      this.model.destroy();
      this.$el.fadeOut({
        duration: 400,
        easing: 'easeOutExpo'
      });
      return c.publish(c.CONTEXT_SAVE, null, 'stable');
    };

    ContextItem.prototype.clickState = function(event) {
      if (this.model.isEnabled()) {
        this.model.disable();
      } else {
        this.model.enable();
      }
      return c.publish(c.CONTEXT_SAVE, null, 'stable');
    };

    ContextItem.prototype.disable = function() {
      this.$el.addClass('disabled');
      this.ui.state.attr('title', 'Enable');
      return this.ui.check.prop('checked', false);
    };

    ContextItem.prototype.enable = function() {
      this.$el.removeClass('disabled');
      this.ui.state.attr('title', 'Disable');
      return this.ui.check.prop('checked', true);
    };

    ContextItem.prototype.toggleState = function(model, value, options) {
      if (this.model.isEnabled()) {
        return this.enable();
      } else {
        return this.disable();
      }
    };

    ContextItem.prototype.renderLanguage = function() {
      var text;
      text = flattenLanguage(this.model.toJSON()).join(', ');
      this.$el.toggle(!!text);
      return this.ui.language.html(text);
    };

    ContextItem.prototype.showLoading = function() {
      this.ui.loader.show();
      return this.ui.actions.hide();
    };

    ContextItem.prototype.doneLoading = function() {
      this.ui.loader.hide();
      return this.ui.actions.show();
    };

    ContextItem.prototype.onRender = function() {
      this.ui.loader.hide();
      this.renderLanguage();
      return this.toggleState();
    };

    return ContextItem;

  })(c.Marionette.ItemView);
  return {
    ContextItem: ContextItem
  };
});

/*
//@ sourceMappingURL=item.js.map
*/