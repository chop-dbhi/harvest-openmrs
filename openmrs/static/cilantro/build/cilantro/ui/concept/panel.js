var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', './index', './search', 'tpl!templates/concept/panel.html'], function() {
  var ConceptPanel, ConceptSearch, c, index, search, templates, _ref, _ref1;
  c = arguments[0], index = arguments[1], search = arguments[2], templates = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
  templates = c._.object(['panel'], templates);
  ConceptSearch = (function(_super) {
    __extends(ConceptSearch, _super);

    function ConceptSearch() {
      _ref = ConceptSearch.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ConceptSearch.prototype.events = {
      'typeahead:autocompleted input': 'autocomplete'
    };

    ConceptSearch.prototype.autocomplete = function(event, datum) {
      return c.publish(c.CONCEPT_FOCUS, datum.id);
    };

    return ConceptSearch;

  })(search.ConceptSearch);
  ConceptPanel = (function(_super) {
    __extends(ConceptPanel, _super);

    function ConceptPanel() {
      _ref1 = ConceptPanel.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ConceptPanel.prototype.className = 'concept-panel';

    ConceptPanel.prototype.template = templates.panel;

    ConceptPanel.prototype.regions = {
      search: '.search-region',
      index: '.index-region'
    };

    ConceptPanel.prototype.onRender = function() {
      var _this = this;
      this.index.show(new index.ConceptIndex({
        collection: this.collection,
        collapsable: false
      }));
      this.search.show(new ConceptSearch({
        collection: this.collection,
        handler: function(query, resp) {
          return _this.index.currentView.filter(query, resp);
        }
      }));
      return c._.defer(function() {
        return _this.search.currentView.ui.input.focus();
      });
    };

    return ConceptPanel;

  })(c.Marionette.Layout);
  return {
    ConceptPanel: ConceptPanel
  };
});

/*
//@ sourceMappingURL=panel.js.map
*/