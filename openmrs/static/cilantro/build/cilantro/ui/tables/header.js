var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', './row', 'underscore'], function(c, row, _) {
  var Header, HeaderCell, HeaderRow, _ref, _ref1;
  HeaderCell = (function(_super) {
    __extends(HeaderCell, _super);

    HeaderCell.prototype.tagName = 'th';

    function HeaderCell(options) {
      if (options.view == null) {
        throw new Error('ViewModel instance required');
      }
      this.view = options.view;
      delete options.view;
      HeaderCell.__super__.constructor.call(this, options);
    }

    HeaderCell.prototype.onClick = function() {
      _.each(this.view.facets.models, function(f) {
        var direction;
        if (f.get('concept') === this.model.id) {
          direction = f.get('sort');
          if (direction != null) {
            if (direction.toLowerCase() === "asc") {
              f.set('sort', "desc");
              return f.set('sort_index', 0);
            } else {
              f.unset('sort');
              return f.unset('sort_index');
            }
          } else {
            f.set('sort', "asc");
            return f.set('sort_index', 0);
          }
        } else {
          f.unset('sort');
          return f.unset('sort_index');
        }
      }, this);
      return this.view.save();
    };

    HeaderCell.prototype.initialize = function() {
      return this.listenTo(this.model, 'change:visible', this.toggleVisible);
    };

    HeaderCell.prototype.events = {
      "click": "onClick"
    };

    HeaderCell.prototype.getSortIconHtml = function() {
      var direction, iconClass, model;
      model = _.find(this.view.facets.models, function(m) {
        return m.get('concept') === this.model.id;
      }, this);
      if (model == null) {
        return "";
      }
      direction = (model.get('sort') || "").toLowerCase();
      if (direction === "asc") {
        iconClass = "icon-sort-up";
      } else if (direction === "desc") {
        iconClass = "icon-sort-down";
      } else {
        iconClass = "icon-sort";
      }
      return "<i class=" + iconClass + "></i>";
    };

    HeaderCell.prototype.render = function() {
      var iconHtml;
      this.toggleVisible();
      iconHtml = this.getSortIconHtml();
      this.$el.html("<span>" + this.model.get('name') + iconHtml);
      return this;
    };

    HeaderCell.prototype.toggleVisible = function() {
      return this.$el.toggle(this.model.get('visible'));
    };

    return HeaderCell;

  })(c.Backbone.View);
  HeaderRow = (function(_super) {
    __extends(HeaderRow, _super);

    function HeaderRow() {
      _ref = HeaderRow.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HeaderRow.prototype.itemView = HeaderCell;

    return HeaderRow;

  })(row.Row);
  Header = (function(_super) {
    __extends(Header, _super);

    function Header() {
      _ref1 = Header.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Header.prototype.tagName = 'thead';

    Header.prototype.render = function() {
      row = new HeaderRow(c._.extend({}, this.options, {
        collection: this.collection
      }));
      this.$el.html(row.el);
      row.render();
      return this;
    };

    return Header;

  })(c.Backbone.View);
  return {
    Header: Header
  };
});

/*
//@ sourceMappingURL=header.js.map
*/