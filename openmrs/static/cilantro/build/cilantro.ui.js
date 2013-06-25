var __slice = [].slice;

define(['./cilantro', './cilantro/router', './cilantro/ui/base', './cilantro/ui/button', './cilantro/ui/concept', './cilantro/ui/field', './cilantro/ui/charts', './cilantro/ui/context', './cilantro/ui/controls', './cilantro/ui/exporter', './cilantro/ui/tables', './cilantro/ui/workflows'], function() {
  var c, mods, router, routes, ui, _ref;
  c = arguments[0], router = arguments[1], mods = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  c.ui = (_ref = c._).extend.apply(_ref, [{}].concat(__slice.call(mods)));
  ui = c.getOption('ui') || {};
  c.router = new router.Router({
    el: ui.main,
    maxHeight: ui.maxHeight
  });
  if ((routes = c.getOption('routes')) != null) {
    c.router.register(routes);
  }
  if (c.getOption('autoroute')) {
    $(document).on('click', 'a', function(event) {
      var pathname, root;
      pathname = this.pathname;
      if (pathname.charAt(0) !== '/') {
        pathname = "/" + pathname;
      }
      root = Backbone.history.root || '/';
      if (pathname.slice(0, root.length) === root) {
        pathname = pathname.slice(root.length);
      }
      if (c.router.hasRoute(pathname)) {
        event.preventDefault();
        Backbone.history.navigate(pathname, {
          trigger: true
        });
      }
    });
  }
  return c;
});

/*
//@ sourceMappingURL=cilantro.ui.js.map
*/