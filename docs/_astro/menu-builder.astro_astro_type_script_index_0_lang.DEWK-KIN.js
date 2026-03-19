const f=document.getElementById("menu-builder-data");if(f?.textContent){const r=JSON.parse(f.textContent),i=document.querySelector("[data-summary-list]"),u=document.querySelector("[data-summary-empty]"),y=document.querySelector("[data-summary-considerations]"),c=document.querySelector("[data-main-course-options]"),l=document.querySelector("[data-main-course-helper]"),b=document.querySelector("[data-preview-button]"),S=document.querySelector("[data-menu-builder]"),o={diningStyle:"",starter:"",mainCourseCategory:"",mainCourseSelection:"",sauce:"",starch:"",vegetable:"",optionalAdditions:[],dessert:"",customConsiderations:""},d={diningStyle:"Dining style",starter:"Starter",mainCourseSelection:"Entrée",sauce:"Sauce",starch:"Starch / Grain",vegetable:"Vegetable",optionalAdditions:"Optional additions",dessert:"Dessert",customConsiderations:"Custom considerations"},v=Object.fromEntries(r.sections.map(n=>[n.id,n])),m=(n,e)=>e?n==="mainCourseSelection"?(r.mainCourseOptions[o.mainCourseCategory]||[]).find(s=>s.value===e)?.label||"":v[n]?.options?.find(a=>a.value===e)?.label||"":"",C=()=>{const n=o.mainCourseCategory,e=r.mainCourseOptions[n]||[];if(c){if(!n||e.length===0){c.innerHTML=`
            <div class="builder-empty-state">
              <strong>Select a main course category</strong>
              <p>Once you choose a main course style, matching entrées for that Pacific Northwest direction will appear here.</p>
            </div>
          `,l&&(l.textContent="Choose a main course style to unlock curated entrée selections.");return}if(c.innerHTML=e.map(t=>`
          <label class="builder-option" for="mainCourseSelection-${t.value}" data-option-card data-section="mainCourseSelection" data-value="${t.value}">
            <input
              id="mainCourseSelection-${t.value}"
              class="builder-option-input"
              type="radio"
              name="mainCourseSelection"
              value="${t.value}"
              data-builder-input
              data-section="mainCourseSelection"
              ${o.mainCourseSelection===t.value?"checked":""}
            />
            <span class="builder-option-check" aria-hidden="true"></span>
            <span class="builder-option-copy">
              <strong>${t.label}</strong>
              <span>${t.description||""}</span>
              ${t.note?`<small class="builder-option-note">${t.note}</small>`:""}
            </span>
          </label>
        `).join(""),l){const t=m("mainCourseCategory",n);l.textContent=`${t} entrées ready to refine your menu.`}}},p=()=>{const n=r.summaryOrder.map(e=>{if(e==="customConsiderations")return o.customConsiderations.trim()?{label:d.customConsiderations,value:o.customConsiderations.trim()}:null;if(e==="optionalAdditions"){if(!o.optionalAdditions.length)return null;const a=o.optionalAdditions.map(s=>m("optionalAdditions",s)).filter(Boolean).join(" · ");return{label:d.optionalAdditions,value:a}}const t=o[e];return t?{label:d[e],value:m(e,t)}:null}).filter(Boolean);!i||!u||(n.length===0?(u.hidden=!1,i.hidden=!0,i.innerHTML=""):(u.hidden=!0,i.hidden=!1,i.innerHTML=n.map(e=>`
            <article class="menu-summary-item">
              <p>${e.label}</p>
              <strong>${e.value}</strong>
            </article>
          `).join("")),y&&(y.textContent=o.customConsiderations.trim()?o.customConsiderations.trim():"No custom considerations yet. Use the notes field to mention allergies, celebration details, favorite ingredients, or dietary preferences."))},g=()=>{document.querySelectorAll("[data-option-card]").forEach(n=>{const e=n.getAttribute("data-section"),t=n.getAttribute("data-value"),s=e==="optionalAdditions"?o.optionalAdditions.includes(t):o[e]===t;n.classList.toggle("is-selected",!!s)})};S?.addEventListener("change",n=>{const e=n.target;if(!(e instanceof HTMLInputElement))return;const t=e.dataset.section;t&&(t==="optionalAdditions"?o.optionalAdditions=Array.from(document.querySelectorAll('input[name="optionalAdditions"]:checked')).map(a=>a.value):o[t]=e.value,t==="mainCourseCategory"&&(o.mainCourseSelection="",C()),g(),p())}),document.querySelector("[data-builder-textarea]")?.addEventListener("input",n=>{const e=n.target;e instanceof HTMLTextAreaElement&&(o.customConsiderations=e.value,p())}),b?.addEventListener("click",()=>{document.querySelector(".menu-summary-panel")?.scrollIntoView({behavior:"smooth",block:"start"})}),C(),g(),p()}
