var __slice = [].slice;

define(['./core', './models/field', './models/concept', './models/context', './models/view', './models/paginator', './models/results', './models/exporter', './models/value'], function() {
  var c, mods, _ref;
  c = arguments[0], mods = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return (_ref = c._).extend.apply(_ref, [{}].concat(__slice.call(mods)));
});

/*
//@ sourceMappingURL=models.js.map
*/