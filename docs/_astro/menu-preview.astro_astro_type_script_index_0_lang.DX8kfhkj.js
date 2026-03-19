import{r as w,p as f,a as h,b as q,g as r,s as S,d as C,e as A}from"./menuBuilderClient.DBA53Cq0.js";const g=document.getElementById("menu-preview-data");if(g?.textContent){const a=JSON.parse(g.textContent),e=w(),b=document.querySelector("[data-preview-empty]"),s=document.querySelectorAll("[data-preview-filled]"),d=document.querySelector("[data-preview-course-grid]"),u=document.querySelector("[data-preview-composed-lines]"),c=document.querySelector("[data-preview-notes]"),p=document.querySelector("[data-preview-notes-copy]"),i=document.querySelector("[data-preview-badge]"),m=document.querySelector("[data-preview-lead]"),y=document.querySelector("[data-submit-menu-request]");if(!f.some(t=>t==="optionalAdditions"?e.optionalAdditions.length>0:t==="vegetableSelection"?e.vegetableSelections.length>0:t==="customConsiderations"?!!e.customConsiderations.trim():!!e[t]))s.forEach(t=>{t.hidden=!0});else{b?.setAttribute("hidden","true"),s.forEach(o=>{o.hidden=!1});const t=h(a,e);if(i&&t.diningStyle&&(i.textContent=t.diningStyle,i.hidden=!1),m&&(m.textContent=t.lead),d){const o=f.map(n=>{if(n==="optionalAdditions")return e.optionalAdditions.length?{label:q.optionalAdditions,value:e.optionalAdditions.map(l=>r(a,e,"optionalAdditions",l)).filter(Boolean).join(" · ")}:null;if(n==="customConsiderations")return null;if(n==="vegetableSelection")return e.vegetableSelections.length?{label:S[n]||n,value:e.vegetableSelections.map(l=>r(a,e,"vegetableSelection",l)).filter(Boolean).join(" · ")}:null;const v=e[n];return v?{label:S[n]||n,value:r(a,e,n,v)}:null}).filter(Boolean);d.innerHTML=o.map(n=>`
            <article class="menu-preview-detail-card">
              <p>${n.label}</p>
              <strong>${n.value}</strong>
            </article>
          `).join("")}u&&(u.innerHTML=t.composedLines.map(o=>`
            <article class="menu-preview-composed-line">
              <p>${o.label}</p>
              <strong>${o.value}</strong>
              ${o.description?`<span>${o.description}</span>`:""}
            </article>
          `).join("")),c&&p&&t.details.customConsiderations&&(c.hidden=!1,p.textContent=t.details.customConsiderations),y?.addEventListener("click",()=>{C(A(a,e))})}}
