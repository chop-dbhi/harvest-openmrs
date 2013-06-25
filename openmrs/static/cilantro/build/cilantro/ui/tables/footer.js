var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', './row'], function(c, row) {
  var Footer, _ref;
  Footer = (function(_super) {
    __extends(Footer, _super);

    function Footer() {
      _ref = Footer.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Footer.prototype.tagName = 'tfoot';

    Footer.prototype.template = function() {};

    return Footer;

  })(c.Marionette.ItemView);
  return {
    Footer: Footer
  };
});

/*
//@ sourceMappingURL=footer.js.map
*/