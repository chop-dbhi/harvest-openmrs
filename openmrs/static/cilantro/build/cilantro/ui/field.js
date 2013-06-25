var __slice = [].slice;

define(['./core', './field/info', './field/form', './field/controls', './field/stats'], function() {
  var c, mods, _ref;
  c = arguments[0], mods = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return (_ref = c._).extend.apply(_ref, [{}].concat(__slice.call(mods)));
});

/*
//@ sourceMappingURL=field.js.map
*/