var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../../core', '../../controls', 'inputio', 'tpl!templates/field/controls/base.html'], function() {
  var FORM_ELEMENTS, FieldControl, InputIO, c, controls, templates, _ref;
  c = arguments[0], controls = arguments[1], InputIO = arguments[2], templates = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
  templates = c._.object(['control'], templates);
  FORM_ELEMENTS = 'input,select,textarea';
  FieldControl = (function(_super) {
    __extends(FieldControl, _super);

    function FieldControl() {
      _ref = FieldControl.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FieldControl.prototype.className = 'field-control';

    FieldControl.prototype.template = templates.control;

    FieldControl.prototype.events = {
      'keyup input': 'change',
      'change select': 'change',
      'click input[type=radio],input[type=checkbox]': 'change'
    };

    FieldControl.prototype.options = {
      inputOptions: {
        operator: {
          allowEmpty: true
        }
      }
    };

    FieldControl.prototype.regionViews = {
      operator: controls.OperatorInput,
      value: controls.TextInput,
      nulls: controls.BooleanInput
    };

    FieldControl.prototype._getAttr = function(attr, type) {
      var $el, dataSelector, region;
      dataSelector = this.dataSelectors[attr];
      if ((region = this[attr]) == null) {
        return;
      }
      if (($el = region.currentView.$(dataSelector)) == null) {
        return;
      }
      if ($el.is(FORM_ELEMENTS)) {
        return InputIO.get($el, type);
      } else {
        return $el.attr(this.dataAttrs[attr]);
      }
    };

    FieldControl.prototype._setAttr = function(attr, value) {
      var $el, dataSelector, region;
      dataSelector = this.dataSelectors[attr];
      if ((region = this[attr]) == null) {
        return;
      }
      if (($el = region.currentView.$(dataSelector)) == null) {
        return;
      }
      if ($el.is(FORM_ELEMENTS)) {
        InputIO.set($el, value);
      } else {
        $el.attr(this.dataAttrs[attr], value);
      }
    };

    FieldControl.prototype.getField = function() {
      var _ref1;
      return ((_ref1 = this.model) != null ? _ref1.id : void 0) || this._getAttr('field');
    };

    FieldControl.prototype.getOperator = function() {
      return this._getAttr('operator', 'string');
    };

    FieldControl.prototype.getValue = function() {
      var _ref1;
      return this._getAttr('value', (_ref1 = this.model) != null ? _ref1.get('simple_type') : void 0);
    };

    FieldControl.prototype.getNulls = function() {
      return this._getAttr('nulls', 'boolean');
    };

    FieldControl.prototype.setField = function(value) {
      var _ref1;
      return !((_ref1 = this.model) != null ? _ref1.id : void 0) && this._setAttr('field', value);
    };

    FieldControl.prototype.setOperator = function(value) {
      return this._setAttr('operator', value);
    };

    FieldControl.prototype.setValue = function(value) {
      return this._setAttr('value', value);
    };

    FieldControl.prototype.setNulls = function(value) {
      return this._setAttr('nulls', Boolean(value));
    };

    return FieldControl;

  })(controls.Control);
  return {
    FieldControl: FieldControl
  };
});

/*
//@ sourceMappingURL=base.js.map
*/