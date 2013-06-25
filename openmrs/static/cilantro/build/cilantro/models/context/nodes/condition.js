var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../../../core', './base'], function(c, base) {
  var ConditionNodeModel, _ref;
  ConditionNodeModel = (function(_super) {
    __extends(ConditionNodeModel, _super);

    function ConditionNodeModel() {
      _ref = ConditionNodeModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ConditionNodeModel.prototype.nodeType = 'condition';

    ConditionNodeModel.prototype.validate = function(attrs) {
      if (!((attrs.operator != null) && (attrs.field != null) && (attrs.value != null))) {
        return 'Not a valid condition node';
      }
      if (c._.isArray(attrs.value) && !attrs.value.length) {
        return 'Empty condition value';
      }
    };

    ConditionNodeModel.prototype.toJSON = function(options) {
      var attrs;
      attrs = ConditionNodeModel.__super__.toJSON.call(this, options);
      if ((attrs.value != null) && typeof attrs.value === 'object') {
        attrs.value = c._.clone(attrs.value);
      }
      return attrs;
    };

    return ConditionNodeModel;

  })(base.ContextNodeModel);
  return {
    ConditionNodeModel: ConditionNodeModel
  };
});

/*
//@ sourceMappingURL=condition.js.map
*/