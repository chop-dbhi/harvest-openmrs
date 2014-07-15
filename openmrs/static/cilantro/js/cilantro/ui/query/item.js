define(["underscore","marionette","../base","../core","../context/filters"],function(e,t,i,s,o){var n=i.LoadView.extend({align:"left"}),a=t.ItemView.extend({className:"query-item",template:"query/item",options:{editable:!1},ui:{owner:".owner",nonOwner:".non-owner",shareCount:".share-count",publicIcon:".public-icon",details:"[data-target=details]",toggleDetails:"[data-target=toggle-details]",actions:".owner button"},events:{"click [data-toggle=delete-query-modal]":"showDeleteQueryModal","click [data-toggle=edit-query-modal]":"showEditQueryModal","click [data-target=query]":"loadQuery","click @ui.toggleDetails":"toggleDetails",mouseover:"showActions",mouseout:"hideActions"},modelEvents:{sync:"render"},initialize:function(){if(this.data={},!(this.data.context=this.options.context))throw new Error("context model required");if(!(this.data.view=this.options.view))throw new Error("view model required")},serializeData:function(){var e=this.model.toJSON();return e.shared_users||(e.shared_users=[]),e.user||(e.user={}),e},showActions:function(){this.ui.actions.show()},hideActions:function(){this.ui.actions.hide()},loadQuery:function(e){e.preventDefault(),e.stopPropagation(),this.data.view.save("json",this.model.get("view_json")),this.data.context.save("json",this.model.get("context_json"),{reset:!0}),s.router.navigate("results",{trigger:!0})},showEditQueryModal:function(){this.trigger("showEditQueryModal",this.model)},showDeleteQueryModal:function(){this.trigger("showDeleteQueryModal",this.model)},toggleDetails:function(e){e.preventDefault(),this.ui.details.is(":visible")?(this.ui.toggleDetails.text("Show details"),this.ui.details.hide()):(this.ui.toggleDetails.text("Hide details"),this.ui.details.show())},renderDetails:function(){var t=[];this.model.get("description")&&t.push("<span class=muted>"+this.model.get("description")+"</span>"),t.push("<div class=row-fluid><div class=span6><h6>Filters</h6>");var i=this.model.context.get("json");!i||e.isEmpty(i)?t.push("<p class=muted>No filters were specified for this query.</p>"):o.flattenLanguage(i,t),t.push("</div><div class=span6>"),s.config.get("session.defaults.data.preview")||(t.push("<h6>Columns</h6>"),this.model.view.facets.length?(t.push("<ul>"),this.model.view.facets.each(function(e){var i=s.data.concepts.get(e.get("concept")).get("name"),o=e.get("sort");t.push("<li>"+i),"asc"===o?t.push(' <i class=icon-caret-up title="Ascending Order"></i>'):"desc"===o&&t.push(' <i class=icon-caret-down title="Descending Order"></i>'),t.push("</li>")}),t.push("</ul>")):t.push("<p class=muted>No columns were selected this query.</p>")),t.push("</div></div>"),this.ui.details.html(t.join(""))},onRender:function(){if(this.renderDetails(),!this.options.editable)return this.ui.publicIcon.hide(),this.ui.nonOwner.hide(),void this.ui.owner.hide();if(this.model.get("public")&&this.ui.publicIcon.removeClass("muted").attr("title","Public query"),this.ui.publicIcon.tooltip({html:!0,animation:!1,placement:"right",container:"body"}),this.model.get("is_owner")){this.ui.nonOwner.hide();var t=e.pluck(this.model.get("shared_users"),"email");t.length&&this.ui.shareCount.removeClass("muted").attr("title",t.join(", ")),this.ui.shareCount.tooltip({html:!0,animation:!1,placement:"right",container:"body"})}else this.ui.owner.hide()}});return{LoadingQueryItem:n,QueryItem:a}});
//# sourceMappingURL=item.js.map