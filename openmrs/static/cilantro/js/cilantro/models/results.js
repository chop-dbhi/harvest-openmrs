define(["underscore","backbone","../core","../constants","../structs","./paginator"],function(e,t,i,n,r,s){var a=r.Frame.extend({idAttribute:"page_num",url:function(){var t=e.result(this.collection,"url");return i.utils.alterUrlParams(t,{page:this.id,per_page:this.collection.perPage})}}),o=r.FrameArray.extend({initialize:function(){e.bindAll(this,"fetch","markAsDirty","onWorkspaceUnload","onWorkspaceLoad","refresh"),this.isDirty=!0,this.isWorkspaceOpen=!1,this._refresh=e.debounce(this.refresh,n.CLICK_DELAY),i.on(i.VIEW_SYNCED,this.markAsDirty),i.on(i.CONTEXT_SYNCED,this.markAsDirty),this.on("workspace:load",this.onWorkspaceLoad),this.on("workspace:unload",this.onWorkspaceUnload)},onWorkspaceLoad:function(){this.isWorkspaceOpen=!0,this._refresh()},onWorkspaceUnload:function(){this.isWorkspaceOpen=!1},markAsDirty:function(){this.isDirty=!0,this._refresh()},cancel:function(){return this.pending&&(this.pending.abort&&this.pending.abort(),delete this.pending),t.ajax({type:"delete",url:e.result(this,"url"),contentType:"application/json"})},fetch:function(e){e||(e={});var t;if((t=i.config.get("session.defaults.data.preview"))&&(e.type="POST",e.contentType="application/json",e.data=JSON.stringify(t)),this.isDirty&&this.isWorkspaceOpen)return this.isDirty=!1,void 0===e.cache&&(e.cache=!1),r.FrameArray.prototype.fetch.call(this,e);var n=this;return{done:function(){return delete n.pending}}}});return e.extend(o.prototype,s.PaginatorMixin),o.prototype.getPage=function(e,t){if(t||(t={}),this.hasPage(e)){var n=this.get(e);if(!n&&t.load!==!1){n=new this.model({page_num:e}),n.pending=!0,this.add(n);var r,s={};(r=i.config.get("session.defaults.data.preview"))&&(s.type="POST",s.contentType="application/json",s.data=JSON.stringify(r)),n.fetch(s).done(function(){delete n.pending})}return n&&t.active!==!1&&this.setCurrentPage(e),n}},o.prototype.model=a,{Results:o}});
//# sourceMappingURL=results.js.map