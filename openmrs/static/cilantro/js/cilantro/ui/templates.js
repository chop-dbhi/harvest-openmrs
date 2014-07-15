define(["underscore","loglevel","tpl!templates/count.html","tpl!templates/notification.html","tpl!templates/paginator.html","tpl!templates/panel.html","tpl!templates/search.html","tpl!templates/welcome.html","tpl!templates/accordion/group.html","tpl!templates/accordion/section.html","tpl!templates/accordion/item.html","tpl!templates/base/error-overlay.html","tpl!templates/button/select-option.html","tpl!templates/button/select.html","tpl!templates/charts/chart.html","tpl!templates/charts/editable-chart.html","tpl!templates/concept/columns/available-group.html","tpl!templates/concept/columns/available-section.html","tpl!templates/concept/columns/available-item.html","tpl!templates/concept/columns/selected-item.html","tpl!templates/concept/columns/layout.html","tpl!templates/concept/columns/dialog.html","tpl!templates/concept/error.html","tpl!templates/concept/form.html","tpl!templates/concept/info.html","tpl!templates/concept/panel.html","tpl!templates/concept/workspace.html","tpl!templates/concept/popover.html","tpl!templates/export/dialog.html","tpl!templates/export/option.html","tpl!templates/export/batch.html","tpl!templates/export/progress.html","tpl!templates/context/panel.html","tpl!templates/context/actions.html","tpl!templates/context/info.html","tpl!templates/context/empty.html","tpl!templates/context/filter.html","tpl!templates/controls/infograph/bar.html","tpl!templates/controls/infograph/layout.html","tpl!templates/controls/infograph/toolbar.html","tpl!templates/controls/range/layout.html","tpl!templates/controls/select/layout.html","tpl!templates/controls/select/list.html","tpl!templates/controls/search/layout.html","tpl!templates/controls/search/item.html","tpl!templates/controls/null/layout.html","tpl!templates/controls/text/layout.html","tpl!templates/controls/text/preview-list.html","tpl!templates/controls/text/preview-item.html","tpl!templates/controls/vocab/layout.html","tpl!templates/controls/vocab/path.html","tpl!templates/controls/vocab/item.html","tpl!templates/controls/vocab/bucket.html","tpl!templates/controls/vocab/bucket-item.html","tpl!templates/field/form-condensed.html","tpl!templates/field/form.html","tpl!templates/field/info.html","tpl!templates/field/stats.html","tpl!templates/field/links.html","tpl!templates/field/link.html","tpl!templates/query/delete-dialog.html","tpl!templates/query/edit-dialog.html","tpl!templates/query/item.html","tpl!templates/query/list.html","tpl!templates/query/loader.html","tpl!templates/values/item.html","tpl!templates/values/list.html","tpl!templates/workflows/query.html","tpl!templates/workflows/results.html","tpl!templates/workflows/workspace.html"],function(t,l){var e={},p={},m=function(t){return"/"===t.charAt(0)&&(t=t.substr(1)),t=t.replace(/\.\.\//g,""),t.replace(/templates\//,"").replace(/\.html$/,"")},o=[].slice.call(arguments,2);t.each(o,function(t){t.templateId=m(t._moduleName),e[t.templateId]=t});var a=0,s=function(t,e){a++,require([e],function(l){t||(t=l,l=null),c(t,l),a--},function(t){l.debug(t),a--})},c=function(t,l){if("function"==typeof t){if(l=t,!l._moduleName)throw new Error("cannot register anonymous template");t=m(l._moduleName)}else l||(l=t,t=null);switch(typeof l){case"function":p[t]=l;break;case"string":s(t,l);break;default:throw new Error("template must be a function or AMD module")}};return{get:function(t){return p[t]||e[t]},set:function(l,e){t.isArray(l)?t.each(l,function(t){this.set(t)},this):t.isFunction(l)?c(l):t.isObject(l)?t.each(l,function(t,l){this.set(l,t)},this):c(l,e)},ready:function(){return 0===a},clear:function(){p={}}}});
//# sourceMappingURL=templates.js.map