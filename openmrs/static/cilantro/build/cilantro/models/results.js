var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', '../structs', './paginator'], function(c, structs, paginator) {
  var Results, ResultsPage, _ref, _ref1;
  ResultsPage = (function(_super) {
    __extends(ResultsPage, _super);

    function ResultsPage() {
      _ref = ResultsPage.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ResultsPage.prototype.idAttribute = 'page_num';

    ResultsPage.prototype.url = function() {
      return "" + (this.collection.url()) + "?page=" + this.id + "&per_page=" + this.collection.perPage;
    };

    return ResultsPage;

  })(structs.Frame);
  Results = (function(_super) {
    __extends(Results, _super);

    function Results() {
      _ref1 = Results.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Results.prototype.url = function() {
      return c.getSessionUrl('preview');
    };

    Results.prototype.initialize = function() {
      Results.__super__.initialize.apply(this, arguments);
      this.resolve();
      c.subscribe(c.SESSION_OPENED, this.refresh, this);
      c.subscribe(c.SESSION_CLOSED, this.reset, this);
      c.subscribe(c.CONTEXT_SYNCED, this.refresh, this);
      return c.subscribe(c.VIEW_SYNCED, this.refresh, this);
    };

    Results.prototype.fetch = function(options) {
      if (options == null) {
        options = {};
      }
      if (options.cache == null) {
        options.cache = false;
      }
      return Results.__super__.fetch.call(this, options);
    };

    return Results;

  })(structs.FrameArray);
  c._.extend(Results.prototype, paginator.PaginatorMixin);
  Results.prototype.model = ResultsPage;
  return {
    Results: Results
  };
});

/*
//@ sourceMappingURL=results.js.map
*/