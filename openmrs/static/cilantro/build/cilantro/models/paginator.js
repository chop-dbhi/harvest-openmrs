var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core'], function(c) {
  var Page, Paginator, PaginatorMixin, _ref, _ref1;
  PaginatorMixin = {
    comparator: 'page_num',
    refresh: function() {
      var _this = this;
      if (!this.isPending()) {
        this.pending();
        return this.fetch({
          reset: true
        }).done(function() {
          _this.resolve();
          return _this.setCurrentPage(_this.models[0].id);
        });
      }
    },
    parse: function(resp, options) {
      if (this.perPage !== resp.per_page) {
        if (!options.reset) {
          this.reset(null, {
            silent: true
          });
        }
        this.currentPageNum = null;
        this.perPage = resp.per_page;
        this.trigger('change:pagesize', this, this.perPage);
      }
      if (this.numPages !== resp.num_pages) {
        this.numPages = resp.num_pages;
        this.trigger('change:pagecount', this, this.numPages);
      }
      if (this.objectCount !== resp.object_count) {
        this.objectCount = resp.object_count;
        this.trigger('change:objectcount', this, this.objectCount);
      }
      return [resp];
    },
    hasPage: function(num) {
      return (1 <= num && num <= this.numPages);
    },
    hasNextPage: function(num) {
      if (num == null) {
        num = this.currentPageNum;
      }
      return num < this.numPages;
    },
    hasPreviousPage: function(num) {
      if (num == null) {
        num = this.currentPageNum;
      }
      return num > 1;
    },
    setCurrentPage: function(num) {
      if (num === this.currentPageNum) {
        return;
      }
      if (!this.hasPage(num)) {
        throw new Error('Cannot set the current page out of bounds');
      }
      this.previousPageNum = this.currentPageNum;
      this.currentPageNum = num;
      return this.trigger.apply(this, ['change:currentpage', this].concat(__slice.call(this.getCurrentPageStats())));
    },
    getPage: function(num, options) {
      var model,
        _this = this;
      if (options == null) {
        options = {};
      }
      if (!this.hasPage(num)) {
        return;
      }
      if (!(model = this.get(num)) && options.load !== false) {
        (model = new this.model({
          page_num: num
        })).pending();
        this.add(model);
        model.fetch().done(function() {
          return model.resolve();
        });
      }
      if (model && options.active !== false) {
        this.setCurrentPage(num);
      }
      return model;
    },
    getCurrentPage: function(options) {
      return this.getPage(this.currentPageNum, options);
    },
    getFirstPage: function(options) {
      return this.getPage(1, options);
    },
    getLastPage: function(options) {
      return this.getPage(this.numPages, options);
    },
    getNextPage: function(num, options) {
      if (num == null) {
        num = this.currentPageNum;
      }
      return this.getPage(num + 1, options);
    },
    getPreviousPage: function(num, options) {
      if (num == null) {
        num = this.currentPageNum;
      }
      return this.getPage(num - 1, options);
    },
    pageIsLoading: function(num) {
      var page;
      if (num == null) {
        num = this.currentPageNum;
      }
      if ((page = this.getPage(num, {
        active: false,
        load: false
      }))) {
        return page.isPending();
      }
    },
    getPageCount: function() {
      return this.numPages;
    },
    getCurrentPageStats: function() {
      return [
        this.currentPageNum, {
          previous: this.previousPageNum,
          first: this.currentPageNum === 1,
          last: this.currentPageNum === this.numPages
        }
      ];
    }
  };
  Page = (function(_super) {
    __extends(Page, _super);

    function Page() {
      _ref = Page.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Page.prototype.idAttribute = 'page_num';

    Page.prototype.url = function() {
      return "" + (this.collection.url()) + "?page=" + this.id + "&per_page=" + this.collection.perPage;
    };

    return Page;

  })(c.Backbone.Model);
  Paginator = (function(_super) {
    __extends(Paginator, _super);

    function Paginator() {
      _ref1 = Paginator.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Paginator.prototype.model = Page;

    Paginator.prototype.initialize = function() {
      Paginator.__super__.initialize.apply(this, arguments);
      return this.resolve();
    };

    return Paginator;

  })(c.Backbone.Collection);
  c._.extend(Paginator.prototype, PaginatorMixin);
  return {
    PaginatorMixin: PaginatorMixin,
    Page: Page,
    Paginator: Paginator
  };
});

/*
//@ sourceMappingURL=paginator.js.map
*/