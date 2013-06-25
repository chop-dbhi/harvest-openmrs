var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['./core'], function(c) {
  var EmptyExportType, ExportProgress, ExportProgressCollection, ExportType, ExportTypeCollection, getTitle, _ref, _ref1, _ref2, _ref3, _ref4;
  getTitle = function(exporterModel) {
    var fields, title;
    title = exporterModel.get('title');
    if (title == null) {
      if (href[href.length - 1] === "/") {
        fields = href.substring(0, href.length - 1).split("/");
      } else {
        fields = href.split("/");
      }
      if ((fields != null) && fields.length > 0) {
        title = fields[fields.length - 1].toUpperCase();
      } else {
        title = "Untitled (" + href + ")";
      }
    }
    return title;
  };
  ExportType = (function(_super) {
    __extends(ExportType, _super);

    function ExportType() {
      _ref = ExportType.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ExportType.prototype.tagName = 'label';

    ExportType.prototype.className = 'checkbox';

    ExportType.prototype.render = function() {
      var href, title;
      href = this.model.get('href');
      title = getTitle(this.model);
      this.$el.html("<input type=checkbox name=export-type-checkbox id=export-type-checkbox-" + title + " title='" + title + "' href='" + href + "' /> " + title);
      return this;
    };

    return ExportType;

  })(c.Backbone.View);
  EmptyExportType = (function(_super) {
    __extends(EmptyExportType, _super);

    function EmptyExportType() {
      _ref1 = EmptyExportType.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    EmptyExportType.prototype.className = 'empty';

    EmptyExportType.prototype.render = function() {
      this.$el.html('No exporters found...');
      return this;
    };

    return EmptyExportType;

  })(c.Backbone.View);
  ExportProgress = (function(_super) {
    __extends(ExportProgress, _super);

    function ExportProgress() {
      _ref2 = ExportProgress.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ExportProgress.prototype.tagName = 'div';

    ExportProgress.prototype.initialize = function() {
      return this.$el.addClass("export-status-" + (getTitle(this.model)));
    };

    ExportProgress.prototype.render = function() {
      var error, loading, pending, success;
      success = "<span class='label label-success hide'>Done</span>";
      error = "<span class='label label-important hide'>Error</span>";
      loading = "<div class='progress progress-striped active hide'><div class='bar' style='width: 100%;'></div></div>";
      pending = "<div class=pending-container><span class=pending-spinner></span> Pending...</div>";
      return this.$el.html("<div class=span2>" + (getTitle(this.model)) + ":</div><div class=span10>" + success + error + loading + pending + "</div>");
    };

    return ExportProgress;

  })(c.Backbone.View);
  ExportTypeCollection = (function(_super) {
    __extends(ExportTypeCollection, _super);

    function ExportTypeCollection() {
      _ref3 = ExportTypeCollection.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    ExportTypeCollection.prototype.tagName = 'div';

    ExportTypeCollection.prototype.itemView = ExportType;

    ExportTypeCollection.prototype.emptyView = EmptyExportType;

    return ExportTypeCollection;

  })(c.Marionette.CollectionView);
  ExportProgressCollection = (function(_super) {
    __extends(ExportProgressCollection, _super);

    function ExportProgressCollection() {
      _ref4 = ExportProgressCollection.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    ExportProgressCollection.prototype.tagName = 'div';

    ExportProgressCollection.prototype.className = 'export-status-container';

    ExportProgressCollection.prototype.itemView = ExportProgress;

    return ExportProgressCollection;

  })(c.Marionette.CollectionView);
  return {
    ExportType: ExportType,
    EmptyExportType: EmptyExportType,
    ExportProgress: ExportProgress,
    ExportTypeCollection: ExportTypeCollection,
    ExportProgressCollection: ExportProgressCollection
  };
});

/*
//@ sourceMappingURL=exporter.js.map
*/