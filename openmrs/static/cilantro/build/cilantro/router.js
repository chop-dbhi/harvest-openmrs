var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['underscore', 'backbone'], function(_, Backbone) {
  var Router, _ref;
  Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      this._render = __bind(this._render, this);
      this._load = __bind(this._load, this);
      this._unload = __bind(this._unload, this);
      this._loadAll = __bind(this._loadAll, this);
      this._unloadAll = __bind(this._unloadAll, this);
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Router.prototype.options = {
      el: 'body'
    };

    Router.prototype.initialize = function(options) {
      this.el = options.el || this.options.el;
      this._registered = {};
      this._loaded = [];
      this._routes = {};
      return this._handlers = {};
    };

    Router.prototype._unloadAll = function() {
      var id, _i, _len, _ref1;
      _ref1 = this._loaded.slice();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        id = _ref1[_i];
        this._unload(this._registered[id], false);
      }
    };

    Router.prototype._loadAll = function() {
      var id, ids, _i, _len;
      if ((ids = this._routes[Backbone.history.fragment]) == null) {
        return;
      }
      for (_i = 0, _len = ids.length; _i < _len; _i++) {
        id = ids[_i];
        this._load(this._registered[id]);
      }
    };

    Router.prototype._unload = function(route, force) {
      var idx, view;
      if (force == null) {
        force = true;
      }
      if ((route.route != null) || force && (idx = this._loaded.indexOf(route.id)) >= 0) {
        this._loaded.splice(idx, 1);
        if ((view = route._view) != null) {
          if (view != null) {
            view.$el.hide();
          }
          return typeof view.trigger === "function" ? view.trigger('router:unload', this, Backbone.history.fragment) : void 0;
        }
      }
    };

    Router.prototype._load = function(options) {
      var _this = this;
      if (options._view == null) {
        if (_.isString(options.view)) {
          require([options.view], function(klass) {
            options._view = new klass(options.options);
            _this._render(options);
            return _this._loaded.push(options.id);
          });
          return;
        }
        options._view = options.view;
      }
      this._render(options);
      return this._loaded.push(options.id);
    };

    Router.prototype._render = function(options) {
      var target, view;
      view = options._view;
      if (!view._rendered) {
        view._rendered = true;
        if (options.el !== false) {
          if (options.el != null) {
            target = Backbone.$(options.el, this.el);
          } else {
            target = Backbone.$(this.el);
          }
          target.append(view.el);
        }
        if (typeof view.render === "function") {
          view.render();
        }
      }
      view.$el.show();
      if (typeof view.trigger === "function") {
        view.trigger('router:load', this, Backbone.history.fragment);
      }
    };

    Router.prototype._register = function(options) {
      var handler,
        _this = this;
      if (this._registered[options.id] != null) {
        throw new Error("Route " + options.id + " already registered");
      }
      options = _.clone(options);
      if (options.route == null) {
        this._load(options);
      } else if (this._handlers[options.route] == null) {
        this._routes[options.route] = [];
        this._handlers[options.route] = handler = function() {
          _this._unloadAll();
          _this._loadAll();
        };
        this.route(options.route, handler);
      }
      if (options.route != null) {
        this._routes[options.route].push(options.id);
      }
      return this._registered[options.id] = options;
    };

    Router.prototype.get = function(id) {
      return this._registered[id];
    };

    Router.prototype.hasRoute = function(route) {
      return this._routes.hasOwnProperty(route);
    };

    Router.prototype.navigate = function(fragment, options) {
      var config;
      if (((config = this.get(fragment)) != null) && config.navigable) {
        fragment = config.route;
      }
      return Router.__super__.navigate.call(this, fragment, options);
    };

    Router.prototype.register = function(routes) {
      var options, _i, _len;
      if (!_.isArray(routes)) {
        routes = [routes];
      }
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        options = routes[_i];
        if (!options.view) {
          continue;
        }
        this._register(options);
      }
    };

    Router.prototype.unregister = function(id) {
      var idx, options, _ref1;
      if ((options = this._registered[id]) != null) {
        this._unload(options);
        delete this._registered[id];
        if ((idx = (_ref1 = this._routes[options.route]) != null ? _ref1.indexOf(id) : void 0) >= 0) {
          this._routes[options.route].splice(idx, 1);
        }
      }
    };

    return Router;

  })(Backbone.Router);
  return {
    Router: Router
  };
});

/*
//@ sourceMappingURL=router.js.map
*/