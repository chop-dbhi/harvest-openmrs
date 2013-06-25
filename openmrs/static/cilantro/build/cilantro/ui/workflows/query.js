var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../core', '../base', '../concept', '../context', 'tpl!templates/workflows/query.html'], function() {
  var QueryWorkflow, base, c, concept, context, templates, _ref;
  c = arguments[0], base = arguments[1], concept = arguments[2], context = arguments[3], templates = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
  templates = c._.object(['query'], templates);
  QueryWorkflow = (function(_super) {
    __extends(QueryWorkflow, _super);

    function QueryWorkflow() {
      _ref = QueryWorkflow.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    QueryWorkflow.prototype.className = 'query-workflow';

    QueryWorkflow.prototype.template = templates.query;

    QueryWorkflow.prototype.regions = {
      concepts: '.concept-panel-region',
      workspace: '.concept-workspace-region',
      context: '.context-panel-region'
    };

    QueryWorkflow.prototype.onRender = function() {
      var _this = this;
      this.workspace.show(new concept.ConceptWorkspace);
      this.concepts.show(new base.LoadView({
        message: 'Loading query concepts...'
      }));
      this.context.show(new base.LoadView({
        message: 'Loading session context...'
      }));
      c.data.concepts.ready(function() {
        return _this.concepts.show(new concept.ConceptPanel({
          collection: c.data.concepts.queryable
        }));
      });
      return c.data.contexts.ready(function() {
        return _this.context.show(new context.ContextPanel({
          model: c.data.contexts.getSession()
        }));
      });
    };

    return QueryWorkflow;

  })(c.Marionette.Layout);
  return {
    QueryWorkflow: QueryWorkflow
  };
});

/*
//@ sourceMappingURL=query.js.map
*/