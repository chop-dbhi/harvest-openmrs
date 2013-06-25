var __slice = [].slice;

define(['underscore'], function(_) {
  var channels, publish, subscribe, unsubscribe;
  channels = {};
  subscribe = function(channel, _handler, once, context) {
    var handler;
    if ((once != null) && typeof once !== 'boolean') {
      context = once;
      once = null;
    }
    if (channels[channel] == null) {
      channels[channel] = [];
    }
    if (once) {
      handler = function() {
        unsubscribe(channel, handler, true);
        return _handler.apply(context, arguments);
      };
    } else {
      handler = _handler;
    }
    channels[channel].push([handler, context]);
  };
  publish = function() {
    var args, channel, context, handler, handlers, _i, _len, _ref;
    channel = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!(handlers = channels[channel])) {
      return;
    }
    for (_i = 0, _len = handlers.length; _i < _len; _i++) {
      _ref = handlers[_i], handler = _ref[0], context = _ref[1];
      if (handler) {
        handler.apply(context, args);
      }
    }
    setTimeout(function() {
      return channels[channel] = _.compact(handlers);
    });
  };
  unsubscribe = function(channel, handler, defer) {
    var handlers, idx;
    if (!(handlers = channels[channel])) {
      return;
    }
    if ((idx = handlers.indexOf(handler)) >= 0) {
      if (defer) {
        handlers[idx] = null;
      } else {
        handlers.splice(idx, 1);
      }
    }
  };
  return {
    subscribe: subscribe,
    publish: publish,
    unsubscribe: unsubscribe
  };
});

/*
//@ sourceMappingURL=mediator.js.map
*/