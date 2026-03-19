const f=document.getElementById("menu-builder-data");if(f?.textContent){const s=JSON.parse(f.textContent),i=document.querySelector("[data-summary-list]"),u=document.querySelector("[data-summary-empty]"),y=document.querySelector("[data-summary-considerations]"),c=document.querySelector("[data-main-course-options]"),l=document.querySelector("[data-main-course-helper]"),S=document.querySelector("[data-preview-button]"),b=document.querySelector("[data-menu-builder]"),o={diningStyle:"",starter:"",mainCourseCategory:"",mainCourseSelection:"",sauce:"",starch:"",vegetable:"",optionalAdditions:[],dessert:"",customConsiderations:""},d={diningStyle:"Dining style",starter:"Starter",mainCourseSelection:"Entrée",sauce:"Sauce",starch:"Starch / Grain",vegetable:"Vegetable",optionalAdditions:"Optional additions",dessert:"Dessert",customConsiderations:"Custom considerations"},v=Object.fromEntries(s.sections.map(t=>[t.id,t])),m=(t,e)=>e?t==="mainCourseSelection"?(s.mainCourseOptions[o.mainCourseCategory]||[]).find(r=>r.value===e)?.label||"":v[t]?.options?.find(a=>a.value===e)?.label||"":"",C=()=>{const t=o.mainCourseCategory,e=s.mainCourseOptions[t]||[];if(c){if(!t||e.length===0){c.innerHTML=`
            <div class="builder-empty-state">
              <strong>Select a main course category</strong>
              <p>Once you choose Seafood, Poultry, or Vegetarian, matching entrée selections will appear here.</p>
            </div>
          `,l&&(l.textContent="Choose a main course category to unlock entrée selections.");return}if(c.innerHTML=e.map(n=>`
          <label class="builder-option" for="mainCourseSelection-${n.value}" data-option-card data-section="mainCourseSelection" data-value="${n.value}">
            <input
              id="mainCourseSelection-${n.value}"
              class="builder-option-input"
              type="radio"
              name="mainCourseSelection"
              value="${n.value}"
              data-builder-input
              data-section="mainCourseSelection"
              ${o.mainCourseSelection===n.value?"checked":""}
            />
            <span class="builder-option-check" aria-hidden="true"></span>
            <span class="builder-option-copy">
              <strong>${n.label}</strong>
              <span>${n.description||""}</span>
            </span>
          </label>
        `).join(""),l){const n=m("mainCourseCategory",t);l.textContent=`${n} entrées ready to refine your menu.`}}},p=()=>{const t=s.summaryOrder.map(e=>{if(e==="customConsiderations")return o.customConsiderations.trim()?{label:d.customConsiderations,value:o.customConsiderations.trim()}:null;if(e==="optionalAdditions"){if(!o.optionalAdditions.length)return null;const a=o.optionalAdditions.map(r=>m("optionalAdditions",r)).filter(Boolean).join(" · ");return{label:d.optionalAdditions,value:a}}const n=o[e];return n?{label:d[e],value:m(e,n)}:null}).filter(Boolean);!i||!u||(t.length===0?(u.hidden=!1,i.hidden=!0,i.innerHTML=""):(u.hidden=!0,i.hidden=!1,i.innerHTML=t.map(e=>`
            <article class="menu-summary-item">
              <p>${e.label}</p>
              <strong>${e.value}</strong>
            </article>
          `).join("")),y&&(y.textContent=o.customConsiderations.trim()?o.customConsiderations.trim():"No custom considerations yet. Use the notes field to mention dietary needs, event tone, or ingredient preferences."))},g=()=>{document.querySelectorAll("[data-option-card]").forEach(t=>{const e=t.getAttribute("data-section"),n=t.getAttribute("data-value"),r=e==="optionalAdditions"?o.optionalAdditions.includes(n):o[e]===n;t.classList.toggle("is-selected",!!r)})};b?.addEventListener("change",t=>{const e=t.target;if(!(e instanceof HTMLInputElement))return;const n=e.dataset.section;n&&(n==="optionalAdditions"?o.optionalAdditions=Array.from(document.querySelectorAll('input[name="optionalAdditions"]:checked')).map(a=>a.value):o[n]=e.value,n==="mainCourseCategory"&&(o.mainCourseSelection="",C()),g(),p())}),document.querySelector("[data-builder-textarea]")?.addEventListener("input",t=>{const e=t.target;e instanceof HTMLTextAreaElement&&(o.customConsiderations=e.value,p())}),S?.addEventListener("click",()=>{document.querySelector(".menu-summary-panel")?.scrollIntoView({behavior:"smooth",block:"start"})}),C(),g(),p()}
