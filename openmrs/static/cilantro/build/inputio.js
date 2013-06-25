(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    return define(['jquery'], function(jQuery) {
      return root.InputIO = factory(jQuery);
    });
  } else {
    return root.InputIO = factory(root.jQuery);
  }
})(this, function(jQuery) {
  var check, checkers, coerce, coerceDate, coercers, dateJSInstalled, get, getType, isArray, isBoolean, isDate, isNaN, isNumber, isString, set;
  isArray = $.isArray;
  isNumber = function(obj) {
    return $.type(obj) === 'number';
  };
  isNaN = function(obj) {
    return isNumber(obj) && obj !== +obj;
  };
  isBoolean = function(obj) {
    return $.type(obj) === 'boolean';
  };
  isString = function(obj) {
    return $.type(obj) === 'string';
  };
  isDate = function(obj) {
    return $.type(obj) === 'date';
  };
  dateJSInstalled = Date.CultureInfo != null;
  getType = function($el) {
    return $el.attr('data-type') || $el.attr('type');
  };
  get = function(selector, type) {
    var $e, $el, e, multi, value, _i, _len;
    multi = false;
    $el = $(selector).not(':disabled');
    if ($el.is('input[type=checkbox]') && $el.length > 1) {
      multi = true;
    }
    if ($el.is('input[type=radio],input[type=checkbox]')) {
      $el = $el.filter(':checked');
    }
    if ($el.is('select[multiple]')) {
      multi = true;
      value = coerce($el.val(), type || getType($el));
    } else if (multi || $el.length > 1) {
      multi = true;
      value = [];
      for (_i = 0, _len = $el.length; _i < _len; _i++) {
        e = $el[_i];
        $e = $(e);
        value.push(coerce($e.val(), type || getType($e)));
      }
    } else {
      value = coerce($el.val(), type || getType($el));
    }
    if ((value == null) || value === '') {
      value = multi ? [] : null;
    }
    return value;
  };
  set = function(selector, value) {
    var $el, i, multi, x, _i, _len;
    multi = false;
    $el = $(selector);
    if ($el.is('select[multiple],input[type=radio],input[type=checkbox]')) {
      multi = true;
    }
    if (!multi && $el.length > 1) {
      if (!isArray(value)) {
        value = [value];
      }
      for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
        x = value[i];
        $($el[i]).val(x);
      }
      return;
    }
    if (multi && !isArray(value)) {
      value = [value];
    } else if (!multi && isArray(value)) {
      value = value[0];
    }
    $el.val(value);
  };
  coerceDate = function(v) {
    if (!dateJSInstalled) {
      throw new Error('date.js must be installed to properly dates');
    }
    return Date.parse(v);
  };
  coercers = {
    boolean: function(v) {
      return Boolean(v);
    },
    number: function(v) {
      return parseFloat(v);
    },
    string: function(v) {
      return v.toString();
    },
    date: coerceDate,
    datetime: coerceDate,
    time: coerceDate
  };
  coerce = function(value, type) {
    var cleaned, x;
    if (value == null) {
      return null;
    }
    if (isArray(value)) {
      cleaned = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          x = value[_i];
          _results.push(coerce(x, type));
        }
        return _results;
      })();
      value = cleaned.length ? cleaned : null;
    } else if (coercers[type] != null) {
      value = coercers[type](value);
    }
    if (value === '' || isNaN(value)) {
      return null;
    } else {
      return value;
    }
  };
  checkers = {
    boolean: isBoolean,
    number: isNumber,
    string: isString,
    date: isDate,
    datetime: isDate,
    time: isDate
  };
  check = function(value, type) {
    if (checkers[type] != null) {
      return checkers[type](value);
    } else {
      return true;
    }
  };
  return {
    get: get,
    set: set,
    coerce: coerce,
    coercers: coercers,
    check: check,
    checkers: checkers
  };
});

/*
//@ sourceMappingURL=inputio.js.map
*/