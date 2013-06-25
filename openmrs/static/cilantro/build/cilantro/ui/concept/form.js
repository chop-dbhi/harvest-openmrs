var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['../../core', '../field', '../charts', './info', 'tpl!templates/concept/form.html'], function() {
  var ConceptForm, c, charts, field, info, templates;
  c = arguments[0], field = arguments[1], charts = arguments[2], info = arguments[3], templates = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
  templates = c._.object(['form'], templates);
  ConceptForm = (function(_super) {
    __extends(ConceptForm, _super);

    ConceptForm.prototype.className = 'concept-form';

    ConceptForm.prototype.template = templates.form;

    function ConceptForm() {
      var session;
      ConceptForm.__super__.constructor.apply(this, arguments);
      session = c.data.contexts.getSession();
      this.context = session.root.find({
        concept: this.model.id
      }, {
        create: 'branch'
      });
      this.listenTo(this.context, 'change', this.setState, this);
    }

    ConceptForm.prototype.events = {
      'click .actions [data-toggle=add]': 'save',
      'click .actions [data-toggle=update]': 'save',
      'click .actions [data-toggle=remove]': 'clear'
    };

    ConceptForm.prototype.ui = {
      actions: '.actions',
      add: '.actions [data-toggle=add]',
      remove: '.actions [data-toggle=remove]',
      update: '.actions [data-toggle=update]'
    };

    ConceptForm.prototype.regions = {
      info: '.info-region',
      fields: '.fields-region'
    };

    ConceptForm.prototype.onRender = function() {
      this.info.show(new info.ConceptInfo({
        model: this.model
      }));
      this.fields.show(new field.FieldFormCollection({
        collection: this.model.fields,
        context: this.context,
        hideSingleFieldInfo: true
      }));
      return this.setState();
    };

    ConceptForm.prototype.setState = function() {
      if (this.context.isSynced()) {
        return this.setUpdateState();
      } else {
        return this.setNewState();
      }
    };

    ConceptForm.prototype.setUpdateState = function() {
      this.ui.add.hide();
      this.ui.update.show();
      return this.ui.remove.show();
    };

    ConceptForm.prototype.setNewState = function() {
      this.ui.add.show();
      this.ui.update.hide();
      return this.ui.remove.hide();
    };

    ConceptForm.prototype.save = function() {
      if (this.context.save({
        deep: true
      })) {
        c.publish(c.CONTEXT_SAVE);
        return this.setUpdateState();
      }
    };

    ConceptForm.prototype.clear = function() {
      this.context.clear();
      return this.setNewState();
    };

    return ConceptForm;

  })(c.Marionette.Layout);
  return {
    ConceptForm: ConceptForm
  };
});

/*
//@ sourceMappingURL=form.js.map
*/