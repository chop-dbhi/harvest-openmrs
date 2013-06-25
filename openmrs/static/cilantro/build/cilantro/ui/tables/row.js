var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', './cell'], function(c, cell) {
  var EmptyRow, Row, _ref, _ref1;
  Row = (function(_super) {
    __extends(Row, _super);

    function Row() {
      this.itemViewOptions = __bind(this.itemViewOptions, this);
      _ref = Row.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Row.prototype.tagName = 'tr';

    Row.prototype.template = function() {};

    Row.prototype.itemView = cell.Cell;

    Row.prototype.itemViewOptions = function(model, index) {
      return c._.extend({}, this.options, {
        model: model
      });
    };

    return Row;

  })(c.Marionette.CollectionView);
  EmptyRow = (function(_super) {
    __extends(EmptyRow, _super);

    function EmptyRow() {
      _ref1 = EmptyRow.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    EmptyRow.prototype.className = 'empty';

    EmptyRow.prototype.tagName = 'tr';

    EmptyRow.prototype.render = function() {
      this.$el.html('Loading...');
      return this;
    };

    return EmptyRow;

  })(c.Backbone.View);
  return {
    Row: Row,
    EmptyRow: EmptyRow
  };
});

/*
//@ sourceMappingURL=row.js.map
*/