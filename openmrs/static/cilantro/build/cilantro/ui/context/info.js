var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', 'tpl!templates/context/info.html'], function() {
  var ContextInfo, c, templates, _ref;
  c = arguments[0], templates = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  templates = c._.object(['info'], templates);
  ContextInfo = (function(_super) {
    __extends(ContextInfo, _super);

    function ContextInfo() {
      _ref = ContextInfo.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ContextInfo.prototype.template = templates.info;

    ContextInfo.prototype.events = {
      'click [data-role=view]': 'navigateResults'
    };

    ContextInfo.prototype.navigateResults = function(event) {
      event.preventDefault();
      return c.router.navigate('results', {
        trigger: true
      });
    };

    return ContextInfo;

  })(c.Marionette.ItemView);
  return {
    ContextInfo: ContextInfo
  };
});

/*
//@ sourceMappingURL=info.js.map
*/