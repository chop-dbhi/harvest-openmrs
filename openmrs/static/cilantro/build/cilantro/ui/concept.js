var __slice = [].slice;

define(['./core', './concept/info', './concept/search', './concept/index', './concept/panel', './concept/form', './concept/workspace', './concept/columns'], function() {
  var c, mods, _ref;
  c = arguments[0], mods = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return (_ref = c._).extend.apply(_ref, [{}].concat(__slice.call(mods)));
});

/*
//@ sourceMappingURL=concept.js.map
*/