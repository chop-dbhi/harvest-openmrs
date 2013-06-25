var __slice = [].slice;

define(['../../core', './nodes/base', './nodes/condition', './nodes/branch', './nodes/composite'], function() {
  var c, mods, _ref;
  c = arguments[0], mods = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return (_ref = c._).extend.apply(_ref, [{}].concat(__slice.call(mods)));
});

/*
//@ sourceMappingURL=nodes.js.map
*/