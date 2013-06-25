var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./core'], function(c) {
  var EmptyView, ErrorView, LoadView, StateView, _ref, _ref1, _ref2;
  StateView = (function(_super) {
    __extends(StateView, _super);

    StateView.prototype.align = 'center';

    function StateView() {
      var html, icon, message;
      StateView.__super__.constructor.apply(this, arguments);
      if (this.template == null) {
        if (this.options.template) {
          this.template = this.options.template;
        } else {
          html = [];
          if ((icon = this.options.icon || this.icon)) {
            html.push(icon);
          }
          if ((message = this.options.message || this.message)) {
            html.push(message);
          }
          this.template = function() {
            return html.join(' ');
          };
        }
      }
    }

    StateView.prototype.initialize = function() {
      if (this.align) {
        return this.$el.css('text-align', this.align);
      }
    };

    return StateView;

  })(c.Marionette.ItemView);
  EmptyView = (function(_super) {
    __extends(EmptyView, _super);

    function EmptyView() {
      _ref = EmptyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    EmptyView.prototype.className = 'empty-view';

    EmptyView.prototype.icon = '<i class="icon-info"></i>';

    EmptyView.prototype.message = 'No data available';

    return EmptyView;

  })(StateView);
  ErrorView = (function(_super) {
    __extends(ErrorView, _super);

    function ErrorView() {
      _ref1 = ErrorView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ErrorView.prototype.className = 'error-view';

    ErrorView.prototype.icon = '<i class="icon-exclamation"></i>';

    ErrorView.prototype.message = 'Something went awry..';

    return ErrorView;

  })(StateView);
  LoadView = (function(_super) {
    __extends(LoadView, _super);

    function LoadView() {
      _ref2 = LoadView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    LoadView.prototype.className = 'load-view';

    LoadView.prototype.icon = '<i class="icon-spinner icon-spin"></i>';

    LoadView.prototype.message = 'Loading...';

    return LoadView;

  })(StateView);
  return {
    EmptyView: EmptyView,
    ErrorView: ErrorView,
    LoadView: LoadView
  };
});

/*
//@ sourceMappingURL=base.js.map
*/