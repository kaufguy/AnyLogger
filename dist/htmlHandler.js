!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.HTMLHandler=t()}(this,function(){var e=function(e,t){if(t.logToHtml){var r,n,o,a,l=0,i=function(){var e,t,r,n,o,a,l;return e="table[data-sortable]",n=/^-?[£$¤]?[\d,.]+%?$/,l=/^\s+|\s+$/g,r=["click"],a="ontouchstart"in document.documentElement,a&&r.push("touchstart"),t=function(e,t,r){return null!=e.addEventListener?e.addEventListener(t,r,!1):e.attachEvent("on"+t,r)},o={init:function(t){var r,n,a,l,i;for(null==t&&(t={}),null==t.selector&&(t.selector=e),n=document.querySelectorAll(t.selector),i=[],a=0,l=n.length;a<l;a++)r=n[a],i.push(o.initTable(r));return i},initTable:function(e){var t,r,n,a,l,i;if(1===(null!=(i=e.tHead)?i.rows.length:void 0)&&"true"!==e.getAttribute("data-sortable-initialized")){for(e.setAttribute("data-sortable-initialized","true"),n=e.querySelectorAll("th"),t=a=0,l=n.length;a<l;t=++a)r=n[t],"false"!==r.getAttribute("data-sortable")&&o.setupClickableTH(e,r,t);return e}},setupClickableTH:function(e,n,a){var l,i,d,s,c,u;for(d=o.getColumnType(e,a),i=function(t){var r,l,i,s,c,u,p,h,g,b,f,m,y,v,T,x,C,A,E,w,H,k,L,S;if(t.handled===!0)return!1;for(t.handled=!0,p="true"===this.getAttribute("data-sorted"),h=this.getAttribute("data-sorted-direction"),i=p?"ascending"===h?"descending":"ascending":d.defaultSortDirection,b=this.parentNode.querySelectorAll("th"),y=0,C=b.length;y<C;y++)n=b[y],n.setAttribute("data-sorted","false"),n.removeAttribute("data-sorted-direction");if(this.setAttribute("data-sorted","true"),this.setAttribute("data-sorted-direction",i),g=e.tBodies[0],u=[],p){for(S=g.rows,x=0,w=S.length;x<w;x++)l=S[x],u.push(l);for(u.reverse(),k=0,H=u.length;k<H;k++)c=u[k],g.appendChild(c)}else{for(m=null!=d.compare?d.compare:function(e,t){return t-e},r=function(e,t){return e[0]===t[0]?e[2]-t[2]:d.reverse?m(t[0],e[0]):m(e[0],t[0])},L=g.rows,s=v=0,A=L.length;v<A;s=++v)c=L[s],f=o.getNodeValue(c.cells[a]),null!=d.comparator&&(f=d.comparator(f)),u.push([f,c,s]);for(u.sort(r),T=0,E=u.length;T<E;T++)c=u[T],g.appendChild(c[1])}return"function"==typeof window.CustomEvent&&"function"==typeof e.dispatchEvent?e.dispatchEvent(new CustomEvent("Sortable.sorted",{bubbles:!0})):void 0},u=[],s=0,c=r.length;s<c;s++)l=r[s],u.push(t(n,l,i));return u},getColumnType:function(e,t){var r,n,a,l,i,d,s,c,u,p,h;if(n=null!=(u=e.querySelectorAll("th")[t])?u.getAttribute("data-sortable-type"):void 0,null!=n)return o.typesObject[n];for(p=e.tBodies[0].rows,i=0,s=p.length;i<s;i++)for(r=p[i],a=o.getNodeValue(r.cells[t]),h=o.types,d=0,c=h.length;d<c;d++)if(l=h[d],l.match(a))return l;return o.typesObject.alpha},getNodeValue:function(e){var t;return e?(t=e.getAttribute("data-value"),null!==t?t:"undefined"!=typeof e.innerText?e.innerText.replace(l,""):e.textContent.replace(l,"")):""},setupTypes:function(e){var t,r,n,a;for(o.types=e,o.typesObject={},a=[],r=0,n=e.length;r<n;r++)t=e[r],a.push(o.typesObject[t.name]=t);return a}},o.setupTypes([{name:"numeric",defaultSortDirection:"descending",match:function(e){return e.match(n)},comparator:function(e){return parseFloat(e.replace(/[^0-9.-]/g,""),10)||0}},{name:"date",defaultSortDirection:"ascending",reverse:!0,match:function(e){return!isNaN(Date.parse(e))},comparator:function(e){return Date.parse(e)||0}},{name:"alpha",defaultSortDirection:"ascending",match:function(){return!0},compare:function(e,t){return e.localeCompare(t)}}]),o},d=function(e){n.tHead.getElementsByTagName("th")[e].click()},s=function(e){var t,r,n=0;if("string"==typeof e)r=e;else{var a=document.getElementById("logTableFilter");r=a.value}r=r.toUpperCase();for(var l=o.getElementsByTagName("tr"),i=0;i<l.length;i++){t=l[i].getElementsByTagName("td");for(var d=0;d<t.length;d++)if(t[d]){if(t[d].innerHTML.toUpperCase().indexOf(r)>-1){l[i].style.display="",n++;break}d===t.length-1&&(l[i].style.display="none")}}return n},c=function(){var e=document.createElement("style");r.appendChild(e),e.innerHTML="#logTable{border-collapse: collapse; height: 100%; width: 100%; display: block;}.log-table-row td{border: 1px solid black;} .log-table-row:nth-child(even){background-color: #d3d3d3}.log-table-row:hover {background-color: #ffffe0}.log-table-header {background-color: #90ee90;}.log-table-header th[data-sortable='false']{cursor: auto;}.log-table-header th{border: 1px solid black; cursor: pointer;}.log-table-header th[data-sorted='true']:after {visibility: visible;}.log-table-header th[data-sorted-direction='descending']:after {border-top-color: inherit;margin-top: 8px;}.log-table-header th[data-sorted-direction='ascending']:after {border-bottom-color: inherit;margin-top: 3px;}.log-table-header th:after {content: ''; visibility: hidden;\tdisplay: inline-block; vertical-align: inherit; height: 0; width: 0; border-width: 5px;\tborder-style: solid; border-color: transparent;\tmargin-right: 1px; margin-left: 10px; float: right;}#logTableFilter {font-size: 16px; padding: 5px 5px 5px 10px; border: 1px solid #ddd; margin: 0 0 12px 0;}#logTableClear {padding: 4px 32px; display: inline-block; cursor: pointer; font-size: 16px; margin: 0 16px 12px 0}";var t=document.createElement("button");t.innerHTML="Clear",t.setAttribute("id","logTableClear"),t.addEventListener("click",u),r.appendChild(t);var l=document.createElement("input");l.setAttribute("type","text"),l.setAttribute("id","logTableFilter"),l.setAttribute("placeholder","Filter"),l.addEventListener("keyup",s),r.appendChild(l),n=document.createElement("table"),n.id="logTable",n.innerHTML='<thead class="log-table-header"><tr><th>Order</th><th>Date</th><th>Module</th><th>Scope</th><th style="width:100%;">Message</th><th>Level</th></tr></thead><tbody class="log-table-body"></tbody>',r.appendChild(n),o=n.tBodies[0],a=i(),a.initTable(n)},u=function(){l=0,o.innerHTML=""},p=function(e){return e?e:""},h=function(e,t,r,n,a){var i=o.insertRow(-1);i.className="log-table-row",i.innerHTML="<td>"+l+"</td><td>"+a.toLocaleString()+"</td><td>"+p(e)+"</td><td>"+p(t)+"</td><td>"+p(r)+"</td><td>"+n.name+"</td>",l++};t.logToHtml.container?r=t.logToHtml.container:(r=document.createElement("div"),r.style.width="100%",r.style["z-index"]="9999999",document.body.appendChild(r)),c(),e.addHandler({type:"html",write:function(e,t,r){h(r.module,r.scope,e,t,r.date)},sort:d,filter:s,clear:u})}};return{create:e}});