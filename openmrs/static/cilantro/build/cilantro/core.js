define(['jquery', 'underscore', 'backbone', 'mediator', './channels', './utils', './session', 'plugins/js', 'plugins/jquery-ajax-queue', 'plugins/backbone-deferrable'], function($, _, Backbone, mediator, channels, utils, session) {
  var aliases, c, currentSession, defaultConfig, methods, props;
  $(window).on('beforeunload', function() {
    if ($.hasPendingRequest()) {
      return "Wow, you're quick! Your data is being saved.               It will only take a moment.";
    }
  });
  currentSession = null;
  defaultConfig = {
    autoroute: true
  };
  c = {
    config: $.extend(true, defaultConfig, this.cilantro)
  };
  aliases = {
    dom: $,
    ajax: $.ajax
  };
  methods = {
    getOption: function(key) {
      return utils.getDotProp(c.config, key);
    },
    setOption: function(key, value) {
      return utils.setDotProp(c.config, key, value);
    },
    openSession: function(url, credentials) {
      if (url == null) {
        url = this.getOption('url');
      }
      if (credentials == null) {
        credentials = this.getOption('credentials');
      }
      if (url == null) {
        throw new Error('Session cannot be opened, no URL defined');
      }
      return session.openSession(url, credentials, function(sessionData) {
        return currentSession = _.clone(sessionData);
      });
    },
    closeSession: function() {
      return session.closeSession(function() {
        return currentSession = null;
      });
    },
    getCurrentSession: function() {
      return currentSession != null ? currentSession.root : void 0;
    },
    getSessionUrl: function(name) {
      return session.getSessionUrl(currentSession, name);
    }
  };
  channels = _.extend({}, channels, session.channels);
  props = {
    $: $,
    _: _,
    Backbone: Backbone,
    utils: utils
  };
  return _.extend(c, mediator, channels, props, aliases, methods);
});

/*
//@ sourceMappingURL=core.js.map
*/