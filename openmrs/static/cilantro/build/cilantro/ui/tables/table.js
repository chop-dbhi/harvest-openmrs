var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', './body', './header', './footer'], function(c, body, header, footer) {
  var Table, _ref;
  Table = (function(_super) {
    __extends(Table, _super);

    function Table() {
      _ref = Table.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Table.prototype.tagName = 'table';

    Table.prototype.className = 'table table-striped';

    Table.prototype.itemView = body.Body;

    Table.prototype.itemViewOptions = function(item, index) {
      return c._.defaults({
        collection: item.series
      }, this.options);
    };

    Table.prototype.collectionEvents = {
      'change:currentpage': 'showCurentPage'
    };

    Table.prototype.initialize = function() {
      this.header = new header.Header(c._.defaults({
        collection: this.collection.indexes
      }, this.options));
      this.footer = new footer.Footer(c._.defaults({
        collection: this.collection.indexes
      }, this.options));
      this.header.render();
      this.footer.render();
      return this.$el.append(this.header.el, this.footer.el);
    };

    Table.prototype.showCurentPage = function(model, num, options) {
      return this.children.each(function(view) {
        return view.$el.toggle(view.model.id === num);
      });
    };

    return Table;

  })(c.Marionette.CollectionView);
  return {
    Table: Table
  };
});

/*
//@ sourceMappingURL=table.js.map
*/