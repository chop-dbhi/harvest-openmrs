var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./core', 'tpl!templates/welcome.html'], function() {
  var Welcome, c, templates, _ref;
  c = arguments[0], templates = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  templates = c._.object(['welcome'], templates);
  Welcome = (function(_super) {
    __extends(Welcome, _super);

    function Welcome() {
      _ref = Welcome.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Welcome.prototype.className = 'welcome';

    Welcome.prototype.template = templates.welcome;

    return Welcome;

  })(c.Marionette.ItemView);
  return {
    Welcome: Welcome
  };
});

/*
//@ sourceMappingURL=welcome.js.map
*/