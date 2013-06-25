var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./core', 'tpl!templates/search.html'], function() {
  var Search, c, templates, _ref;
  c = arguments[0], templates = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  templates = c._.object(['search'], templates);
  Search = (function(_super) {
    __extends(Search, _super);

    function Search() {
      _ref = Search.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Search.prototype.className = 'search';

    Search.prototype.template = templates.search;

    Search.prototype.ui = {
      input: 'input'
    };

    Search.prototype.onRender = function() {
      var _this = this;
      if (this.options.placeholder) {
        this.ui.input.attr('placeholder', this.options.placeholder);
      }
      return c._.defer(function() {
        return _this.ui.input.focus();
      });
    };

    return Search;

  })(c.Marionette.ItemView);
  return {
    Search: Search
  };
});

/*
//@ sourceMappingURL=search.js.map
*/