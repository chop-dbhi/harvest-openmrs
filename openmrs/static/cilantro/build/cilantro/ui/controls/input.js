var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['../core', 'tpl!templates/controls/text-input.html', 'tpl!templates/controls/static-input.html', 'tpl!templates/controls/boolean-input.html', 'tpl!templates/controls/select-input.html', 'tpl!templates/controls/typeahead-input.html', 'tpl!templates/controls/range-input.html', 'tpl!templates/controls/operator-input.html'], function() {
  var BooleanInput, Input, OperatorInput, RangeInput, SelectInput, StaticInput, TextInput, TypeaheadInput, c, templates, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
  c = arguments[0], templates = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  templates = c._.object(['text', 'static', 'boolean', 'select', 'typeahead', 'range', 'operator'], templates);
  Input = (function(_super) {
    __extends(Input, _super);

    function Input() {
      _ref = Input.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Input.prototype.template = templates.text;

    Input.prototype.className = 'control-input';

    Input.prototype.options = {
      inputAttrs: {}
    };

    Input.prototype.ui = {
      input: '.input',
      units: '.units'
    };

    Input.prototype.onRender = function() {
      return this.ui.input.attr(this.options.inputAttrs);
    };

    return Input;

  })(c.Marionette.ItemView);
  StaticInput = (function(_super) {
    __extends(StaticInput, _super);

    function StaticInput() {
      _ref1 = StaticInput.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    StaticInput.prototype.template = templates["static"];

    return StaticInput;

  })(Input);
  BooleanInput = (function(_super) {
    __extends(BooleanInput, _super);

    function BooleanInput() {
      _ref2 = BooleanInput.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    BooleanInput.prototype.template = templates.boolean;

    return BooleanInput;

  })(Input);
  TextInput = (function(_super) {
    __extends(TextInput, _super);

    function TextInput() {
      _ref3 = TextInput.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    return TextInput;

  })(Input);
  SelectInput = (function(_super) {
    __extends(SelectInput, _super);

    function SelectInput() {
      this.renderOptions = __bind(this.renderOptions, this);
      _ref4 = SelectInput.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    SelectInput.prototype.template = templates.select;

    SelectInput.prototype.initialize = function() {
      var _this = this;
      return this.on('render', function() {
        var _ref5;
        return (_ref5 = _this.model) != null ? _ref5.values(_this.renderOptions) : void 0;
      });
    };

    SelectInput.prototype.parseOption = function(option) {
      return [option.value, option.label];
    };

    SelectInput.prototype.renderOptions = function(options) {
      var label, option, value, _i, _len, _ref5;
      if (options == null) {
        options = {};
      }
      this.ui.input.empty();
      if (this.options.allowEmpty !== false) {
        this.ui.input.append('<option value=>---</option>');
      }
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        option = options[_i];
        _ref5 = this.parseOption(option), value = _ref5[0], label = _ref5[1];
        this.ui.input.append("<option value=\"" + value + "\">" + label + "</option>");
      }
    };

    return SelectInput;

  })(Input);
  TypeaheadInput = (function(_super) {
    __extends(TypeaheadInput, _super);

    function TypeaheadInput() {
      _ref5 = TypeaheadInput.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    TypeaheadInput.prototype.template = templates.typeahead;

    return TypeaheadInput;

  })(Input);
  RangeInput = (function(_super) {
    __extends(RangeInput, _super);

    function RangeInput() {
      _ref6 = RangeInput.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    RangeInput.prototype.template = function() {};

    RangeInput.prototype.options = {
      inputView: TextInput
    };

    RangeInput.prototype.onRender = function() {
      this.input1 = new this.options.inputView(this.options);
      this.input2 = new this.options.inputView(this.options);
      this.input1.render();
      this.input1.ui.units.hide();
      this.input2.render();
      this.$el.append(this.input1.el, this.input2.el);
      return this.ui.input = this.$el.children();
    };

    return RangeInput;

  })(Input);
  OperatorInput = (function(_super) {
    __extends(OperatorInput, _super);

    function OperatorInput() {
      _ref7 = OperatorInput.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    OperatorInput.prototype.template = templates.operator;

    OperatorInput.prototype.initialize = function() {
      var _this = this;
      return this.on('render', function() {
        var options;
        options = {
          allowEmpty: _this.options.allowEmpty
        };
        if (_this.model != null) {
          return _this.renderOptions(_this.model.get('operators'), options);
        }
      });
    };

    OperatorInput.prototype.parseOption = function(option) {
      return option;
    };

    return OperatorInput;

  })(SelectInput);
  return {
    TextInput: TextInput,
    StaticInput: StaticInput,
    BooleanInput: BooleanInput,
    SelectInput: SelectInput,
    TypeaheadInput: TypeaheadInput,
    RangeInput: RangeInput,
    OperatorInput: OperatorInput
  };
});

/*
//@ sourceMappingURL=input.js.map
*/