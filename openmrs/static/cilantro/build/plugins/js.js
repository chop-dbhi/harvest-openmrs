define(function() {
  if (!String.prototype.trim) {
    String.prototype.ltrim = function() {
      return this.replace(/^\s+/, '');
    };
    String.prototype.rtrim = function() {
      return this.replace(/\s+$/, '');
    };
    return String.prototype.trim = function() {
      return this.ltrim().rtrim();
    };
  }
});

/*
//@ sourceMappingURL=js.js.map
*/