define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var Deferrable;
  Deferrable = {
    deferred: {},
    initialize: function() {
      var method, once, _fn, _ref,
        _this = this;
      this.pending();
      _ref = this.deferred;
      _fn = function(method, once) {
        var func;
        func = _this[method];
        return _this[method] = function() {
          return _this.defer(method, func, once, arguments);
        };
      };
      for (method in _ref) {
        once = _ref[method];
        _fn(method, once);
      }
    },
    pending: function(clear) {
      if (clear == null) {
        clear = false;
      }
      if ((this._deferred != null) && this.isPending() && !clear) {
        return this;
      }
      (this._deferred = $.Deferred()).once = {};
      return this;
    },
    defer: function(name, func, once, args) {
      if (once == null) {
        once = true;
      }
      if (_.isString(name)) {
        if (!_.isFunction(func)) {
          once = func;
          func = this[name];
        }
        if (once && this.isPending()) {
          if (this._deferred.once[name]) {
            return this;
          }
          this._deferred.once[name] = true;
        }
      } else {
        func = name;
      }
      this._deferred.done(function() {
        return func.apply(this, args);
      });
      return this;
    },
    resolve: function(context) {
      if (context == null) {
        context = this;
      }
      if (this._deferred) {
        this._deferred.resolveWith(context);
      }
      return this;
    },
    reject: function(context) {
      if (context == null) {
        context = this;
      }
      this._deferred.rejectWith(context);
      return this;
    },
    promise: function() {
      var _ref;
      return (_ref = this._deferred).promise.apply(_ref, arguments);
    },
    when: function(func) {
      $.when(this).done(func);
      return this;
    },
    state: function() {
      var _ref;
      return (_ref = this._deferred) != null ? _ref.state() : void 0;
    },
    isPending: function() {
      return this.state() === 'pending';
    },
    isResolved: function() {
      return this.state() === 'resolved';
    },
    isRejected: function() {
      return this.state() === 'rejected';
    }
  };
  Deferrable.ready = Deferrable.when;
  Deferrable.resolveWith = Deferrable.resolve;
  Deferrable.rejectWith = Deferrable.reject;
  _.extend(Backbone.View.prototype, Deferrable);
  _.extend(Backbone.Model.prototype, Deferrable);
  _.extend(Backbone.Collection.prototype, Deferrable);
  _.extend(Backbone.Router.prototype, Deferrable);
});

/*
//@ sourceMappingURL=backbone-deferrable.js.map
*/