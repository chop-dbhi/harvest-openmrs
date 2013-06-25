var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', 'tpl!templates/field/info.html'], function() {
  var FieldInfo, c, templates, _ref;
  c = arguments[0], templates = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  templates = c._.object(['info'], templates);
  FieldInfo = (function(_super) {
    __extends(FieldInfo, _super);

    function FieldInfo() {
      _ref = FieldInfo.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FieldInfo.prototype.className = 'field-info';

    FieldInfo.prototype.template = templates.info;

    return FieldInfo;

  })(c.Marionette.ItemView);
  return {
    FieldInfo: FieldInfo
  };
});

/*
//@ sourceMappingURL=info.js.map
*/