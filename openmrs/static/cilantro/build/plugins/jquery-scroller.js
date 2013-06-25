define(['jquery', 'underscore'], function($, _) {
  /*
  jQuery plugin for triggering a scroll event once a certain threshold is
  reached. A use case of this is the "infinite" scrolling element in which
  data is being populated in the element on-demand.
  
  Options:
    `container` - The container element that this element is scrolling
    relative to. Default is window
  
    `threshold` - Percent scrolled from the top of the element which triggers
      the event. Once this thresholder has been reached the `reset` method
      must be called to reset this state.
  
    `autofill` - For cases where each trigger event appends to this element
    (e.g. infinite scroll), this option will trigger the `scroller` event
    until this element's is greater than the container height.
  
    `resize` - Adds an event handler to trigger a reset when the window is
    resized.
  
    `trigger` - A single handler to fire when the `scroller` event fires.
    This can be bound directly to the element as a normal, but having it
    as an option keeps the code tidier.
  
  Methods are invoked by passing the method name as a string in the
  constructor method, e.g. `$(...).scroller('reset')`.
  
  Methods:
    `reset` - Resets the pre-calculated aboslute dimensions and thresholds.
      Use this when the element size changes.
  */

  var Scroller, defaultOptions;
  defaultOptions = {
    container: window,
    threshold: 0.75,
    autofill: false,
    resize: true,
    trigger: null
  };
  Scroller = function(element, options) {
    var _this = this;
    this.element = $(element);
    this.options = options;
    this.container = $(options.container);
    if (options.resize) {
      $(window).on('resize', _.debounce(function() {
        return _this.reset();
      }, 100));
    }
    this.container.on('scroll', _.debounce(function() {
      var scrollTop, threshold;
      scrollTop = _this.container.scrollTop();
      threshold = (_this.element.height() - _this.container.height()) * _this.options.threshold;
      if (!_this.reached && scrollTop >= threshold) {
        _this.reached = true;
        return _this.element.trigger('scroller');
      }
    }, 100));
    if (options.trigger) {
      this.element.on('scroller', options.trigger);
    }
    return this;
  };
  Scroller.prototype = {
    constructor: Scroller,
    reset: function() {
      this.reached = false;
      if (this.options.autofill && (this.element.height() - this.container.height()) < 0) {
        this.element.trigger('scroller');
      }
      return this;
    }
  };
  $.fn.scroller = function(option) {
    var options;
    if ($.isPlainObject(option)) {
      options = $.extend({}, defaultOptions, option);
    } else {
      options = $.extend({}, defaultOptions);
    }
    return this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data('scroller');
      if (!data) {
        $this.data('scroller', (data = new Scroller($this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };
  return $.fn.scroller.Constructor = Scroller;
});

/*
//@ sourceMappingURL=jquery-scroller.js.map
*/