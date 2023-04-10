"use strict";(self.webpackChunkfilters=self.webpackChunkfilters||[]).push([[592],{483:(e,t,i)=>{function r(e){var t=this;t.options=e,t.events={},t.items=[],t.filters={},t.active_filters=[],t.fields={},t.debounce,t.settings("debounce_duration",500),t.settings("filter_return","id")}i.d(t,{Z:()=>n}),r.prototype.settings=function(e,t){void 0!==this.options[e]?this[e]=this.options[e]:this[e]=t},r.prototype.set_items=function(e){this.items=e},r.prototype.set=function(e,t){this.filters[e]=t},r.prototype.add=function(e,t){this.filters[e].push(t)},r.prototype.remove=function(e,t){var i=this.filters[e].indexOf(t);-1!==i&&this.filters[e].splice(i,1)},r.prototype.update=function(){var e=this,t=e.filter_items();e.event_dispatcher("update",{items_to_show:t,active_filters:e.active_filters})},r.prototype.debounced_update=function(){var e=this;clearTimeout(e.debounce),e.debounce=setTimeout((function(){e.update()}),e.debounce_duration)},r.prototype.on=function(e,t){var i=this;void 0===i.events[e]&&(i.events[e]=[]),i.events[e].push(t)},r.prototype.event_dispatcher=function(e,t){void 0!==this.events[e]&&this.events[e].forEach((function(e){e(t)}))},r.prototype.add_field=function(e){var t=this;switch(e.type){case"items_single":t.init_type_items_single(e);break;case"items_multiple":t.init_type_items_multiple(e);break;case"dropdown":t.init_type_dropdown(e);break;case"dropdown_multiple":t.init_type_dropdown_multiple(e)}},r.prototype.prepare_field=function(e){var t;if("string"==typeof e.el){if(!(t=document.querySelector(e.el)))return void console.error("cannot find element ",e.el)}else void 0!==(t=e.el)[0]&&(t=t[0]);var i=void 0!==e.key?e.key:t.dataset.filterKey;this.fields[i]=e;var r=void 0!==e.key?e.filter_type:"default",n=this.fields[i];return n.el=t,n.key=i,n.filter_type=r,n},r.prototype.filter_items=function(){var e=this;e.active_filters=e.get_active_filters();var t=[];return"all"==e.filter_return?e.items.forEach((function(i){e.show_item(i,e.active_filters)&&t.push(i)})):e.items.forEach((function(i){e.show_item(i,e.active_filters)&&t.push(i[e.filter_return])})),t},r.prototype.show_item=function(e,t){for(var i=0;i<t.length;i++){var r=t[i],n=e[r.key];if(console.log(r.key,r.value),"range"!=this.fields[r.key].filter_type){if("object"==typeof r.value){if("object"==typeof n){for(var o=!1,s=0;s<n.length;s++)if(-1!==r.value.indexOf(n[s])){o=!0;break}if(!o)return!1}else if(-1===r.value.indexOf(n))return!1}else if("object"==typeof n){if(-1===n.indexOf(r.value))return!1}else if(n!=r.value)return!1}else{var a=r.value.split(","),l=parseInt(a[0]),c=parseInt(a[1]);if(console.log(l,c),l>n||c<n)return!1}}return!0},r.prototype.get_active_filters=function(){var e=this,t=[];return Object.keys(e.filters).forEach((function(i){var r=e.filters[i];("object"!=typeof r||r.length)&&r&&t.push({key:i,value:r})})),t},r.prototype.init_type_dropdown=function(e){var t=this,i=t.prepare_field(e);i.current_value="",e.el.addEventListener("change",(function(e){t.event_dispatcher("change_"+i.key,{el:e.target,value:this.value,key:i.key}),this.value!=i.current_value&&(i.current_value=this.value,t.set(i.key,this.value),t.update())})),void 0!==e.choices&&e.choices.forEach((function(t){e.el.append('<option value="'+t+'">'+t+"</option>")}))},r.prototype.init_type_dropdown_multiple=function(e){var t=this,i=t.prepare_field(e);t.filters[i.key]=[],e.el.addEventListener("change",(function(r){this.value&&-1===t.filters[i.key].indexOf(this.value)&&(t.event_dispatcher("change_"+i.key,{el:r.target,value:this.value,key:i.key}),t.add(i.key,this.value),t.update(),e.el.value="")})),void 0!==e.choices&&e.choices.forEach((function(t){e.el.append('<option value="'+t+'">'+t+"</option>")}))},r.prototype.init_type_items_single=function(e){var t=this,i=t.prepare_field(e);i.items=e.el.querySelectorAll(".filter-item"),i.current_selected=e.el.querySelector(".selected"),i.items.forEach((r=>{r.addEventListener("click",(n=>{if(r.classList.contains("selected")){if(void 0!==e.unselect&&!e.unselect)return;r.classList.remove("selected"),i.current_selected=null;var o=""}else r.classList.add("selected"),i.current_selected&&i.current_selected.classList.remove("selected"),i.current_selected=r,o=r.dataset.filterValue;t.set(i.key,o),t.event_dispatcher("change_"+i.key,{el:n.target,value:o,key:i.key}),t.update()}))}))},r.prototype.init_type_items_multiple=function(e){var t=this,i=t.prepare_field(e);t.filters[i.key]=[],i.items=e.el.querySelectorAll(".filter-item"),i.items.forEach((e=>{e.addEventListener("click",(r=>{var n=e.dataset.filterValue;e.classList.toggle("selected"),e.classList.contains("selected")?t.add(i.key,n):t.remove(i.key,n),t.event_dispatcher("change_"+i.key,{el:r.target,value:n,key:i.key}),t.debounced_update()}))}))};const n=r},491:(e,t,i)=>{var r=i(483);console.log(items_data),function(){var e=document.querySelector(".items"),t={tags:[]},i=[];items_data.posts.forEach((r=>{var n=document.createElement("div");n.classList.add("item"),n.innerHTML=r.title,e.appendChild(n),r.el=n,i.push(r),r.tags.forEach((e=>{-1===t.tags.indexOf(e)&&t.tags.push(e)}))})),t.tags.sort();var n=document.querySelector(".filter_tags_buttons"),o="";t.tags.forEach((e=>{o+='<button class="filter-item" data-filter-value="'+e+'">'+e+"</button>"})),n.innerHTML=o;var s=new r.Z({filter_return:"all"});s.set_items(i),s.add_field({type:"items_multiple",el:".filter_tags_buttons"}),s.add_field({key:"reactions",type:"dropdown",el:".filter_reactions",filter_type:"range"}),s.on("update",(t=>{e.innerHTML="",t.items_to_show.forEach((t=>{e.append(t.el)}))})),window.filters=s}()},294:(e,t,i)=>{var r=i(483);!function(){var e=document.querySelector(".items"),t={brand:[],category:[]},i=[];items_data.products.forEach((r=>{var n=document.createElement("div");n.classList.add("item"),n.style.backgroundImage="url("+r.thumbnail+")",e.appendChild(n),r.el=n,i.push(r),-1===t.brand.indexOf(r.brand)&&t.brand.push(r.brand),-1===t.category.indexOf(r.category)&&t.category.push(r.category)})),t.brand.sort(),t.category.sort();var n=document.querySelector(".filter_brand"),o='<option value="">Brand</option>';t.brand.forEach((e=>{o+='<option value="'+e+'">'+e+"</option>"})),n.innerHTML=o,n=document.querySelector(".filter_category"),o="",t.category.forEach((e=>{o+='<button class="filter-item" data-filter-value="'+e+'">'+e+"</button>"})),n.innerHTML=o;var s=new r.Z({filter_return:"el"}),a=[],l=document.querySelector(".filter_brand_con .selected_options");s.on("change_brand",(e=>{var t=e.value;if(t&&(console.log("change_brand"),-1===a.indexOf(t))){a.push(t);var i=document.createElement("button");i.innerText="x "+t,i.addEventListener("click",(()=>{var e=a.indexOf(t);console.log("remove",e,t),i.remove(),a.splice(e,1),s.filters.brand.splice(e,1),s.update()})),l.appendChild(i)}})),s.set_items(i),s.add_field({type:"dropdown_multiple",el:".filter_brand"}),s.add_field({type:"items_multiple",el:".filter_category"}),s.add_field({key:"price",type:"dropdown",el:".filter_price",filter_type:"range"}),s.on("update",(t=>{console.log("update",t.items_to_show,t.active_filters),e.innerHTML="",t.items_to_show.forEach((t=>{e.append(t)}))})),window.filters=s}()}}]);