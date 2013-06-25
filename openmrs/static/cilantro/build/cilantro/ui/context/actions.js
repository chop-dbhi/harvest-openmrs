var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', 'tpl!templates/context/actions.html'], function() {
  var ContextActions, c, templates, _ref;
  c = arguments[0], templates = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  templates = c._.object(['actions'], templates);
  ContextActions = (function(_super) {
    __extends(ContextActions, _super);

    function ContextActions() {
      _ref = ContextActions.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ContextActions.prototype.template = templates.actions;

    ContextActions.prototype.ui = {
      count: '.count'
    };

    ContextActions.prototype.events = {
      'click [data-role=remove]': 'clickRemoveAll'
    };

    ContextActions.prototype.modelEvents = {
      'change:count': 'renderCount'
    };

    ContextActions.prototype.serializeData = function() {
      var attrs;
      attrs = c._.clone(this.model.attributes);
      delete attrs.json;
      attrs.count = c.utils.prettyNumber(attrs.count);
      return attrs;
    };

    ContextActions.prototype.renderCount = function(model, value, options) {
      return this.ui.count.text(c.utils.prettyNumber(value));
    };

    ContextActions.prototype.clickRemoveAll = function() {
      return c.publish(c.CONTEXT_CLEAR);
    };

    return ContextActions;

  })(c.Marionette.ItemView);
  return {
    ContextActions: ContextActions
  };
});

/*
//@ sourceMappingURL=actions.js.map
*/