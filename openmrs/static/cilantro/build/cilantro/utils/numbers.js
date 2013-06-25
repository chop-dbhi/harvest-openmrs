define(function() {
  var prettyNumber, suffixes, toDelimitedNumber, toSuffixedNumber;
  suffixes = [[3, 'K'], [6, 'million'], [9, 'billion'], [12, 'trillion'], [15, 'quadrillion'], [18, 'quintillion'], [21, 'sextillion'], [24, 'septillion'], [27, 'octillion'], [30, 'nonillion'], [33, 'decillion'], [100, 'googol']];
  toSuffixedNumber = function(value) {
    var exp, largeNum, new_value, suffix, _i, _len, _ref;
    if (value == null) {
      return;
    }
    if (value < 1000) {
      return toDelimitedNumber(value);
    }
    for (_i = 0, _len = suffixes.length; _i < _len; _i++) {
      _ref = suffixes[_i], exp = _ref[0], suffix = _ref[1];
      largeNum = Math.pow(10, exp);
      if (value < largeNum * 1000) {
        new_value = Math.round(value / largeNum * 10) / 10;
        return "" + new_value + " " + suffix;
      }
    }
  };
  toDelimitedNumber = function(value, delim) {
    var arr, decimal, i, int, len, text, _ref;
    if (delim == null) {
      delim = ',';
    }
    if (value == null) {
      return;
    }
    _ref = value.toString().split('.'), int = _ref[0], decimal = _ref[1];
    arr = int.toString().split('');
    len = arr.length;
    i = len % 3 || 3;
    while (i < len) {
      arr.splice(i, 0, delim);
      i = i + 4;
    }
    text = arr.join('');
    if (decimal) {
      text += "." + decimal;
    }
    return text;
  };
  prettyNumber = function(value) {
    if (value == null) {
      return '&infin;';
    }
    if (value !== 0) {
      if (Math.abs(value) < 0.01) {
        return value.toExponential(2);
      }
      if (Math.round(value) !== value) {
        value = value.toPrecision(3);
      }
    }
    return toSuffixedNumber(value);
  };
  return {
    toSuffixedNumber: toSuffixedNumber,
    toDelimitedNumber: toDelimitedNumber,
    prettyNumber: prettyNumber
  };
});

/*
//@ sourceMappingURL=numbers.js.map
*/