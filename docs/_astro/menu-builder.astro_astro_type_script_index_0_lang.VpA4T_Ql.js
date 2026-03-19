const h="personalChef.sampleMenuBuilder",S={diningStyle:"Dining Style",starter:"Starter",mainCourseCategory:"Main Course Category",mainCourseSelection:"Main Course Selection",sauce:"Sauce",starch:"Starch / Grain",vegetable:"Vegetable Accompaniment",optionalAdditions:"Optional Additions",dessert:"Dessert",customConsiderations:"Custom Considerations"},u=()=>({diningStyle:"",starter:"",mainCourseCategory:"",mainCourseSelection:"",sauce:"",starch:"",vegetable:"",optionalAdditions:[],dessert:"",customConsiderations:""}),L=n=>Object.fromEntries(n.map(i=>[i.id,i])),O=(n=globalThis.sessionStorage)=>{if(!n)return u();try{const i=n.getItem(h);if(!i)return u();const r=JSON.parse(i);return{...u(),...r,optionalAdditions:Array.isArray(r?.optionalAdditions)?r.optionalAdditions.filter(l=>typeof l=="string"):[]}}catch{return u()}},T=(n,i=globalThis.sessionStorage)=>{i&&i.setItem(h,JSON.stringify(n))},b=(n,i,r,l)=>l?r==="mainCourseSelection"?(n.mainCourseOptions[i.mainCourseCategory]||[]).find(y=>y.value===l)?.label||"":L(n.sections)[r]?.options?.find(m=>m.value===l)?.label||"":"";function q(n="/"){const i="/PersonalChef/".replace(/\/$/,""),r=n==="/"?"/":n.startsWith("/")?n:`/${n}`;return r==="/"?`${i}/`:`${i}${r}`}const E=document.getElementById("menu-builder-data");if(E?.textContent){const n=JSON.parse(E.textContent),i=document.querySelector("[data-summary-list]"),r=document.querySelector("[data-summary-empty]"),l=document.querySelector("[data-summary-considerations]"),d=document.querySelector("[data-main-course-options]"),c=document.querySelector("[data-main-course-helper]"),m=document.querySelector("[data-preview-button]"),y=document.querySelector("[data-menu-builder]"),C=document.querySelector("[data-builder-textarea]"),o=O()||u(),M=()=>{Object.entries(o).forEach(([a,e])=>{if(a==="customConsiderations"){C instanceof HTMLTextAreaElement&&(C.value=e);return}if(a==="optionalAdditions"&&Array.isArray(e)){e.forEach(t=>{const s=document.querySelector(`input[name="optionalAdditions"][value="${t}"]`);s instanceof HTMLInputElement&&(s.checked=!0)});return}if(typeof e=="string"&&e){const t=document.querySelector(`input[name="${a}"][value="${e}"]`);t instanceof HTMLInputElement&&(t.checked=!0)}})},p=()=>{T(o)},A=()=>{const a=o.mainCourseCategory,e=n.mainCourseOptions[a]||[];if(d){if(!a||e.length===0){d.innerHTML=`
            <div class="builder-empty-state">
              <strong>Select a main course category</strong>
              <p>Once you choose a main course style, matching entrées for that Pacific Northwest direction will appear here.</p>
            </div>
          `,c&&(c.textContent="Choose a main course style to unlock curated entrée selections.");return}if(d.innerHTML=e.map(t=>`
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
        `).join(""),c){const t=b(n,o,"mainCourseCategory",a);c.textContent=`${t} entrées ready to refine your menu.`}}},g=()=>{const a=n.summaryOrder.map(e=>{if(e==="customConsiderations")return o.customConsiderations.trim()?{label:S.customConsiderations,value:o.customConsiderations.trim()}:null;if(e==="optionalAdditions"){if(!o.optionalAdditions.length)return null;const f=o.optionalAdditions.map($=>b(n,o,"optionalAdditions",$)).filter(Boolean).join(" · ");return f?{label:S.optionalAdditions,value:f}:null}const t=o[e];if(!t)return null;const s=b(n,o,e,t);return s?{label:S[e]||e,value:s}:null}).filter(Boolean);!i||!r||(a.length===0?(r.hidden=!1,i.hidden=!0,i.innerHTML=""):(r.hidden=!0,i.hidden=!1,i.innerHTML=a.map(e=>`
            <article class="menu-summary-item">
              <p>${e.label}</p>
              <strong>${e.value}</strong>
            </article>
          `).join("")),l&&(l.textContent=o.customConsiderations.trim()?o.customConsiderations.trim():"No custom considerations yet. Use the notes field to mention allergies, celebration details, favorite ingredients, or dietary preferences."))},v=()=>{document.querySelectorAll("[data-option-card]").forEach(a=>{const e=a.getAttribute("data-section"),t=a.getAttribute("data-value"),f=e==="optionalAdditions"?o.optionalAdditions.includes(t):o[e]===t;a.classList.toggle("is-selected",!!f)})};y?.addEventListener("change",a=>{const e=a.target;if(!(e instanceof HTMLInputElement))return;const t=e.dataset.section;t&&(t==="optionalAdditions"?o.optionalAdditions=Array.from(document.querySelectorAll('input[name="optionalAdditions"]:checked')).map(s=>s instanceof HTMLInputElement?s.value:"").filter(Boolean):o[t]=e.value,t==="mainCourseCategory"&&(o.mainCourseSelection="",A()),p(),v(),g())}),C?.addEventListener("input",a=>{const e=a.target;e instanceof HTMLTextAreaElement&&(o.customConsiderations=e.value,p(),g())}),m?.addEventListener("click",()=>{p(),window.location.href=q("/menu-preview")}),sessionStorage.getItem(h)||p(),A(),M(),v(),g()}
