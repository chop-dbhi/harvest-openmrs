var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../../core', '../../controls', './base'], function(c, controls, base) {
  var NumberControl, _ref;
  NumberControl = (function(_super) {
    __extends(NumberControl, _super);

    function NumberControl() {
      _ref = NumberControl.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NumberControl.prototype.options = {
      regionViews: {
        value: controls.RangeInput
      }
    };

    NumberControl.prototype.events = function() {
      var events;
      events = c._.clone(base.FieldControl.prototype.events);
      events["change " + this.dataSelectors.operator] = 'toggleRange';
      return events;
    };

    NumberControl.prototype.toggleRange = function() {
      var input2;
      input2 = this.value.currentView.input2.ui.input;
      if (/range/i.test(this.getOperator())) {
        return input2.prop('disabled', false).show();
      } else {
        return input2.prop('disabled', true).hide();
      }
    };

    NumberControl.prototype.onRender = function() {
      NumberControl.__super__.onRender.apply(this, arguments);
      return this.toggleRange();
    };

    return NumberControl;

  })(base.FieldControl);
  return {
    NumberControl: NumberControl
  };
});

/*
//@ sourceMappingURL=number.js.map
*/