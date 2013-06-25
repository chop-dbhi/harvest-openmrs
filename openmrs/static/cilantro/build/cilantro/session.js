define(['jquery', 'mediator', './session/channels'], function($, mediator, channels) {
  var closeSession, getSessionUrl, linkParser, openSession, setAuthData;
  linkParser = function(href) {
    var parser;
    parser = document.createElement('a');
    parser.href = href;
    return parser;
  };
  getSessionUrl = function(session, key) {
    var current, link, target;
    if (session == null) {
      return;
    }
    if (!(link = session.urls[key])) {
      return;
    }
    current = linkParser(session.root);
    target = linkParser(link.href);
    current.pathname = target.pathname;
    return current.href;
  };
  setAuthData = function(options, credentials, process, sessionData) {
    if (sessionData == null) {
      sessionData = {};
    }
    return _.extend(options, {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(credentials),
      success: function(resp) {
        _.extend(sessionData, {
          token: resp.token
        });
        return openSession(options.url, null, process, sessionData);
      }
    });
  };
  openSession = function(url, credentials, process, sessionData) {
    var data, options;
    if (sessionData == null) {
      sessionData = {};
    }
    data = sessionData.token != null ? {
      token: sessionData.token
    } : null;
    options = {
      url: url,
      type: 'GET',
      data: data,
      dataType: 'json',
      beforeSend: function() {
        return mediator.publish(channels.SESSION_OPENING);
      },
      success: function(resp) {
        _.extend(sessionData, {
          root: url,
          name: resp.title,
          version: resp.version,
          urls: resp._links
        });
        process(sessionData);
        return mediator.publish(channels.SESSION_OPENED);
      },
      error: function(xhr, status, error) {
        var channel;
        channel = (function() {
          switch (xhr.statusCode) {
            case 401:
            case 403:
              return channels.SESSION_UNAUTHORIZED;
            default:
              return channels.SESSION_ERROR;
          }
        })();
        return mediator.publish(channel, error);
      }
    };
    if (credentials != null) {
      setAuthData(options, credentials, process, sessionData);
    }
    return $.ajax(options);
  };
  closeSession = function(process) {
    process();
    return mediator.publish(channels.SESSION_CLOSED);
  };
  return {
    openSession: openSession,
    closeSession: closeSession,
    getSessionUrl: getSessionUrl,
    channels: channels
  };
});

/*
//@ sourceMappingURL=session.js.map
*/