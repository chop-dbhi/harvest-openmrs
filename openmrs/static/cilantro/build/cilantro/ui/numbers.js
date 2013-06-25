define(['./core'], function(c) {
  return {
    renderCount: function($el, count, fallback) {
      if (fallback == null) {
        fallback = '<em>n/a</em>';
      }
      if (count == null) {
        return $el.html(fallback);
      } else {
        return $el.text(c.utils.prettyNumber(count)).attr('title', c.utils.toDelimitedNumber(count));
      }
    }
  };
});

/*
//@ sourceMappingURL=numbers.js.map
*/