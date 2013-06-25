var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', 'tpl!templates/concept/info.html'], function() {
  var ConceptInfo, c, templates, _ref;
  c = arguments[0], templates = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  templates = c._.object(['info'], templates);
  ConceptInfo = (function(_super) {
    __extends(ConceptInfo, _super);

    function ConceptInfo() {
      _ref = ConceptInfo.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ConceptInfo.prototype.className = 'concept-info';

    ConceptInfo.prototype.template = templates.info;

    ConceptInfo.prototype.serializeData = function() {
      var data;
      data = this.model.toJSON();
      if (!data.description && this.model.fields.length) {
        data.description = this.model.fields.at(0).description;
      }
      return data;
    };

    return ConceptInfo;

  })(c.Marionette.ItemView);
  return {
    ConceptInfo: ConceptInfo
  };
});

/*
//@ sourceMappingURL=info.js.map
*/