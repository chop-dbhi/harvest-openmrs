var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', '../base', '../paginator', '../numbers', '../../structs', '../../models', '../tables', '../context', '../concept', '../exporter', 'tpl!templates/count.html', 'tpl!templates/workflows/results.html'], function() {
  var ResultCount, ResultsWorkflow, base, c, concept, context, exporter, models, numbers, paginator, structs, tables, templates, _ref, _ref1;
  c = arguments[0], base = arguments[1], paginator = arguments[2], numbers = arguments[3], structs = arguments[4], models = arguments[5], tables = arguments[6], context = arguments[7], concept = arguments[8], exporter = arguments[9], templates = 11 <= arguments.length ? __slice.call(arguments, 10) : [];
  templates = c._.object(['count', 'results'], templates);
  ResultCount = (function(_super) {
    __extends(ResultCount, _super);

    function ResultCount() {
      _ref = ResultCount.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ResultCount.prototype.tagName = 'span';

    ResultCount.prototype.className = 'result-count';

    ResultCount.prototype.template = templates.count;

    ResultCount.prototype.ui = {
      count: '.count',
      label: '.count-label'
    };

    ResultCount.prototype.modelEvents = {
      'change:objectcount': 'renderCount'
    };

    ResultCount.prototype.renderCount = function(model, count, options) {
      numbers.renderCount(this.ui.count, count);
      return this.ui.label.text('records');
    };

    return ResultCount;

  })(c.Marionette.ItemView);
  ResultsWorkflow = (function(_super) {
    __extends(ResultsWorkflow, _super);

    function ResultsWorkflow() {
      _ref1 = ResultsWorkflow.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ResultsWorkflow.prototype.className = 'results-workflow';

    ResultsWorkflow.prototype.template = templates.results;

    ResultsWorkflow.prototype.requestDelay = 2500;

    ResultsWorkflow.prototype.requestTimeout = 10000;

    ResultsWorkflow.prototype.monitorDelay = 500;

    ResultsWorkflow.prototype.monitorTimeout = 60000;

    ResultsWorkflow.prototype.numPendingDownloads = 0;

    ResultsWorkflow.prototype.pageRangePattern = /^[0-9]+(\.\.\.[0-9]+)?$/;

    ResultsWorkflow.prototype.ui = {
      columns: '.columns-modal',
      exportOptions: '.export-options-modal',
      exportProgress: '.export-progress-modal'
    };

    ResultsWorkflow.prototype.events = {
      'click .columns-modal [data-save]': 'saveColumns',
      'click .toolbar [data-toggle=columns]': 'showColumns',
      'click .export-options-modal [data-save]': 'exportData',
      'click [data-toggle=export-options]': 'showExportOptions',
      'click [data-toggle=export-progress]': 'showExportProgress',
      'click #pages-text-ranges': 'selectPagesOption'
    };

    ResultsWorkflow.prototype.regions = {
      count: '.count-region',
      table: '.table-region',
      paginator: '.paginator-region',
      context: '.context-region',
      columns: '.columns-modal .modal-body',
      exportTypes: '.export-options-modal .export-type-region',
      exportProgress: '.export-progress-modal .export-progress-region'
    };

    ResultsWorkflow.prototype.initialize = function() {
      c._.bindAll(this, "startExport", "onExportFinished", "checkExportStatus");
      return this.monitors = {};
    };

    ResultsWorkflow.prototype.selectPagesOption = function() {
      $('#pages-radio-all').prop('checked', false);
      $('#pages-radio-ranges').prop('checked', true);
      return $('#pages-text-ranges').val('');
    };

    ResultsWorkflow.prototype.changeExportStatus = function(title, newState) {
      var statusContainer;
      statusContainer = $(".export-status-" + title + " .span10");
      statusContainer.children().hide();
      switch (newState) {
        case "pending":
          return statusContainer.find('.pending-container').show();
        case "downloading":
          return statusContainer.find('.progress').show();
        case "error":
          return statusContainer.find('.label-important').show();
        case "success":
          return statusContainer.find('.label-success').show();
      }
    };

    ResultsWorkflow.prototype.onExportFinished = function(exportTypeTitle) {
      this.numPendingDownloads = this.numPendingDownloads - 1;
      $('.export-progress-container .badge-info').html(this.numPendingDownloads);
      if (this.hasExportErrorOccurred(exportTypeTitle)) {
        this.changeExportStatus(exportTypeTitle, "error");
      } else {
        this.changeExportStatus(exportTypeTitle, "success");
      }
      if (this.numPendingDownloads === 0) {
        $('[data-toggle=export-options]').prop('disabled', false);
        return $('.export-progress-container').hide();
      }
    };

    ResultsWorkflow.prototype.hasExportErrorOccurred = function(exportTypeTitle) {
      var id;
      id = "#export-download-" + exportTypeTitle;
      if ($(id).contents()[0].body.children.length === 0) {
        return false;
      } else {
        return true;
      }
    };

    ResultsWorkflow.prototype.checkExportStatus = function(exportTypeTitle) {
      var cookieName;
      this.monitors[exportTypeTitle]["execution_time"] = this.monitors[exportTypeTitle]["execution_time"] + this.monitorDelay;
      cookieName = "export-type-" + (exportTypeTitle.toLowerCase());
      if (this.getCookie(cookieName) === "complete") {
        clearInterval(this.monitors[exportTypeTitle]["interval"]);
        this.setCookie(cookieName, null);
        return this.onExportFinished(exportTypeTitle);
      } else if (this.monitors[exportTypeTitle]["execution_time"] > this.monitorTimeout || this.hasExportErrorOccurred(exportTypeTitle)) {
        clearInterval(this.monitors[exportTypeTitle]["interval"]);
        return this.onExportFinished(exportTypeTitle);
      }
    };

    ResultsWorkflow.prototype.setCookie = function(name, value) {
      return document.cookie = "" + name + "=" + (escape(value)) + "; path=/";
    };

    ResultsWorkflow.prototype.getCookie = function(name) {
      var endIndex, startIndex, value;
      value = document.cookie;
      startIndex = value.indexOf(" " + name + "=");
      if (startIndex === -1) {
        startIndex = value.indexOf("" + name + "=");
      }
      if (startIndex === -1) {
        value = null;
      } else {
        startIndex = value.indexOf("=", startIndex) + 1;
        endIndex = value.indexOf(";", startIndex);
        if (endIndex === -1) {
          endIndex = value.length;
        }
        value = unescape(value.substring(startIndex, endIndex));
      }
      return value;
    };

    ResultsWorkflow.prototype.startExport = function(exportType, pages) {
      var cookieName, iframe, title, url;
      title = $(exportType).attr('title');
      this.changeExportStatus(title, "downloading");
      cookieName = "export-type-" + (title.toLowerCase());
      this.setCookie(cookieName, null);
      url = $(exportType).attr('href');
      if (url[url.length - 1] !== "/") {
        url = "" + url + "/";
      }
      url = "" + url + pages;
      iframe = "<iframe id=export-download-" + title + " src=" + url + " style='display: none'></iframe>";
      $('.export-iframe-container').append(iframe);
      if (c.data.exporters.notifiesOnComplete()) {
        this.monitors[title] = {};
        this.monitors[title]["execution_time"] = 0;
        return this.monitors[title]["interval"] = setInterval(this.checkExportStatus, this.monitorDelay, title);
      } else {
        return setTimeout(this.onExportFinished, this.requestTimeout, title);
      }
    };

    ResultsWorkflow.prototype.initializeExportStatusIndicators = function(selectedTypes) {
      var st, _i, _len, _results;
      $('.export-status-container').children().hide();
      _results = [];
      for (_i = 0, _len = selectedTypes.length; _i < _len; _i++) {
        st = selectedTypes[_i];
        _results.push($(".export-status-" + st.title).show());
      }
      return _results;
    };

    ResultsWorkflow.prototype.isPageRangeValid = function() {
      var pageRange;
      if ($('input[name=pages-radio]:checked').val() === "all") {
        return true;
      } else {
        pageRange = $('#pages-text-ranges').val();
        return this.pageRangePattern.test(pageRange);
      }
    };

    ResultsWorkflow.prototype.exportData = function(event) {
      var delay, i, pagesSuffix, selectedTypes, _i, _ref2, _results;
      $('.export-iframe-container').html('');
      selectedTypes = $('input[name=export-type-checkbox]:checked');
      if (selectedTypes.length === 0) {
        $('#export-error-message').html('An export type must be selected.');
        return $('.export-options-modal .alert-block').show();
      } else if (!this.isPageRangeValid()) {
        $('#export-error-message').html('Page range is invalid. Must be a single page(example: 1) or a range of pages(example: 2...5).');
        return $('.export-options-modal .alert-block').show();
      } else {
        this.numPendingDownloads = selectedTypes.length;
        pagesSuffix = "";
        if ($('input[name=pages-radio]:checked').val() !== "all") {
          pagesSuffix = $('#pages-text-ranges').val() + "/";
        }
        $("[data-toggle=export-options]").prop('disabled', true);
        $('.export-progress-container').show();
        $('.export-progress-container .badge-info').html(this.numPendingDownloads);
        this.ui.exportOptions.modal('hide');
        this.initializeExportStatusIndicators(selectedTypes);
        this.ui.exportProgress.modal('show');
        delay = this.requestDelay;
        if (!c.data.exporters.notifiesOnComplete()) {
          delay = this.requestTimeout;
        }
        _results = [];
        for (i = _i = 0, _ref2 = selectedTypes.length - 1; _i <= _ref2; i = _i += 1) {
          this.changeExportStatus($(selectedTypes[i]).attr('title'), "pending");
          _results.push(setTimeout(this.startExport, i * delay, selectedTypes[i], pagesSuffix));
        }
        return _results;
      }
    };

    ResultsWorkflow.prototype.onRender = function() {
      var _this = this;
      this.paginator.show(new paginator.Paginator({
        model: c.data.results
      }));
      this.count.show(new ResultCount({
        model: c.data.results
      }));
      this.context.show(new base.LoadView({
        message: 'Loading session context...'
      }));
      this.columns.show(new base.LoadView({
        message: 'Loading all your query options...'
      }));
      this.exportTypes.show(new exporter.ExportTypeCollection({
        collection: c.data.exporters
      }));
      this.exportProgress.show(new exporter.ExportProgressCollection({
        collection: c.data.exporters
      }));
      c.data.contexts.ready(function() {
        return _this.context.show(new context.ContextPanel({
          model: c.data.contexts.getSession()
        }));
      });
      return c.data.concepts.ready(function() {
        return c.data.views.ready(function() {
          _this.table.show(new tables.Table({
            view: c.data.views.getSession(),
            collection: c.data.results
          }));
          return _this.columns.show(new concept.ConceptColumns({
            view: c.data.views.getSession(),
            collection: c.data.concepts.viewable
          }));
        });
      });
    };

    ResultsWorkflow.prototype.showExportOptions = function() {
      $('.export-options-modal .alert-block').hide();
      this.ui.exportOptions.modal('show');
      if (c.data.exporters.length === 0) {
        return $('.export-options-modal .btn-primary').prop('disabled', true);
      }
    };

    ResultsWorkflow.prototype.showExportProgress = function() {
      return this.ui.exportProgress.modal('show');
    };

    ResultsWorkflow.prototype.showColumns = function() {
      return this.ui.columns.modal('show');
    };

    ResultsWorkflow.prototype.saveColumns = function() {
      c.publish(c.VIEW_SAVE);
      return this.ui.columns.modal('hide');
    };

    return ResultsWorkflow;

  })(c.Marionette.Layout);
  return {
    ResultsWorkflow: ResultsWorkflow
  };
});

/*
//@ sourceMappingURL=results.js.map
*/