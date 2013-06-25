var __slice = [].slice;

define(['../core', 'date', 'inputio', 'highcharts', 'plugins/backbone-marionette', 'plugins/bootstrap', 'plugins/bootstrap-datepicker', 'plugins/jquery-ui', 'plugins/jquery-easing', 'plugins/jquery-panels', 'plugins/jquery-scroller', 'plugins/typeahead', 'plugins/typeselect'], function(c) {
  var _constructor;
  c.Highcharts = Highcharts;
  c.Marionette = Backbone.Marionette;
  c.renderTemplate = c.Marionette.Renderer.render;
  c.Marionette.View.prototype.publish = c.publish;
  c.Marionette.View.prototype.unsubscribe = c.unsubscribe;
  c.Marionette.View.prototype.subscribe = function(channel, handler, once) {
    var channels, _base;
    if (this._channels == null) {
      this._channels = {};
    }
    if (!once) {
      channels = (_base = this._channels)[channel] != null ? (_base = this._channels)[channel] : _base[channel] = [];
      channels.push(handler);
    }
    c.subscribe(channel, handler, once);
  };
  c.Marionette.View.prototype.onClose = function() {
    var channel, handler, handlers, _i, _len, _ref;
    if (this._channels == null) {
      return;
    }
    _ref = this._channels;
    for (channel in _ref) {
      handlers = _ref[channel];
      for (_i = 0, _len = handlers.length; _i < _len; _i++) {
        handler = handlers[_i];
        this.unsubscribe(channel, handler);
      }
    }
  };
  c.Marionette.View.prototype.bindSubscribers = function() {
    var channel, handler, method, _ref, _results;
    if (this.subscribers == null) {
      return;
    }
    _ref = this.subscribers;
    _results = [];
    for (channel in _ref) {
      method = _ref[channel];
      if ((handler = this[method]) == null) {
        throw new Error("" + method + " not a method");
      }
      _results.push(this.subscribe(channel, handler));
    }
    return _results;
  };
  _constructor = c.Marionette.View.prototype.constructor;
  c.Marionette.View.prototype.constructor = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _constructor.apply(this, args);
    return this.bindSubscribers();
  };
  return c;
});

/*
//@ sourceMappingURL=core.js.map
*/