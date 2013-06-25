var __slice = [].slice;

define(['underscore', './utils/numbers'], function() {
  var getDotProp, mods, setDotProp, _;
  _ = arguments[0], mods = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  getDotProp = function(obj, key) {
    var tok, toks, _i, _len;
    toks = key.split('.');
    for (_i = 0, _len = toks.length; _i < _len; _i++) {
      tok = toks[_i];
      if ((obj = obj[tok]) == null) {
        return;
      }
    }
    return obj;
  };
  setDotProp = function(obj, key, value) {
    var last, tok, toks, _i, _len;
    toks = key.split('.');
    last = toks.pop();
    for (_i = 0, _len = toks.length; _i < _len; _i++) {
      tok = toks[_i];
      if (obj[tok] == null) {
        obj[tok] = {};
      }
      obj = obj[tok];
    }
    obj[last] = value;
  };
  return _.extend.apply(_, [{
    getDotProp: getDotProp,
    setDotProp: setDotProp
  }].concat(__slice.call(mods)));
});

/*
//@ sourceMappingURL=utils.js.map
*/