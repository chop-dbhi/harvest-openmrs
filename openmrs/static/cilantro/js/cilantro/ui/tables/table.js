define(["underscore","marionette","./body","./header","./footer"],function(e,t,i,o,n){var s=t.CollectionView.extend({tagName:"table",className:"table table-striped",itemView:i.Body,itemViewOptions:function(t){return e.defaults({collection:t.series},this.options)},collectionEvents:{"change:currentpage":"showCurrentPage"},initialize:function(){this.header=new o.Header(e.defaults({collection:this.collection.indexes},this.options)),this.footer=new n.Footer(e.defaults({collection:this.collection.indexes},this.options)),this.header.render(),this.footer.render(),this.$el.append(this.header.el,this.footer.el),this.listenTo(this.collection,"reset",function(){0===this.collection.objectCount?this.$el.hide():this.$el.show()})},showCurrentPage:function(e,t){this.children.each(function(e){e.$el.toggle(e.model.id===t)})}});return{Table:s}});
//# sourceMappingURL=table.js.map