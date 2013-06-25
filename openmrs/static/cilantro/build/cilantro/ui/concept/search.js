var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', '../search'], function(c, search) {
  var ConceptSearch, _ref;
  ConceptSearch = (function(_super) {
    __extends(ConceptSearch, _super);

    function ConceptSearch() {
      _ref = ConceptSearch.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ConceptSearch.prototype.className = 'concept-search search';

    ConceptSearch.prototype.options = {
      placeholder: 'Search by name, description, or data...'
    };

    ConceptSearch.prototype.onRender = function() {
      var _this = this;
      ConceptSearch.__super__.onRender.apply(this, arguments);
      return this.ui.input.on('keyup', c._.debounce(function() {
        var query;
        query = _this.ui.input.val();
        if (query) {
          return _this.collection.search(query, function(resp) {
            return _this.options.handler(query, resp);
          });
        } else {
          return _this.options.handler(null, []);
        }
      }, 300));
    };

    return ConceptSearch;

  })(search.Search);
  return {
    ConceptSearch: ConceptSearch
  };
});

/*
//@ sourceMappingURL=search.js.map
*/