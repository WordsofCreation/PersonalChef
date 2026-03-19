const S="personalChef.sampleMenuBuilder",g={diningStyle:"Dining Style",starter:"Starter",mainCourseCategory:"Main Course Category",mainCourseSelection:"Main Course Selection",sauce:"Sauce",optionalAdditions:"Optional Additions",dessert:"Dessert",customConsiderations:"Custom Considerations"},y=()=>({diningStyle:"",starter:"",mainCourseCategory:"",mainCourseSelection:"",sauce:"",starchCategory:"",starchSelection:"",vegetableCategory:"",vegetableSelections:[],optionalAdditions:[],dessert:"",customConsiderations:""}),I=n=>Object.fromEntries(n.map(i=>[i.id,i])),J=(n=globalThis.sessionStorage)=>{if(!n)return y();try{const i=n.getItem(S);if(!i)return y();const r=JSON.parse(i),l=Array.isArray(r?.vegetableSelections)?r.vegetableSelections.filter(d=>typeof d=="string"):typeof r?.vegetable=="string"&&r.vegetable?[r.vegetable]:[];return{...y(),...r,starchSelection:typeof r?.starchSelection=="string"?r.starchSelection:typeof r?.starch=="string"?r.starch:"",vegetableSelections:l,optionalAdditions:Array.isArray(r?.optionalAdditions)?r.optionalAdditions.filter(d=>typeof d=="string"):[]}}catch{return y()}},P=(n,i=globalThis.sessionStorage)=>{i&&i.setItem(S,JSON.stringify(n))},O=(n,i,r)=>(n[i]||[]).find(l=>l.value===r),s=(n,i,r,l)=>l?r==="mainCourseSelection"?(n.mainCourseOptions[i.mainCourseCategory]||[]).find(m=>m.value===l)?.label||"":r==="starchSelection"?O(n.starchOptionsByCategory,i.starchCategory,l)?.label||"":r==="vegetableSelection"?O(n.vegetableOptionsByCategory,i.vegetableCategory,l)?.label||"":I(n.sections)[r]?.options?.find(m=>m.value===l)?.label||"":"";function U(n="/"){const i="/PersonalChef/".replace(/\/$/,""),r=n==="/"?"/":n.startsWith("/")?n:`/${n}`;return r==="/"?`${i}/`:`${i}${r}`}const M=document.getElementById("menu-builder-data");if(M?.textContent){const n=JSON.parse(M.textContent),i=document.querySelector("[data-summary-list]"),r=document.querySelector("[data-summary-empty]"),l=document.querySelector("[data-summary-considerations]"),d=document.querySelector("[data-main-course-options]"),m=document.querySelector("[data-main-course-helper]"),T=document.querySelector("[data-starch-options]"),B=document.querySelector("[data-starch-helper]"),q=document.querySelector("[data-vegetable-options]"),H=document.querySelector("[data-vegetable-helper]"),k=document.querySelector("[data-preview-button]"),w=document.querySelector("[data-menu-builder]"),C=document.querySelector("[data-builder-textarea]"),e=J()||y(),f=({container:o,helper:a,categoryValue:t,categorySectionId:u,selectionSectionId:p,selectedValue:j,collection:N,emptyTitle:D,emptyCopy:V,helperWhenEmpty:W,helperWhenFilled:F})=>{if(!o)return;const L=N[t]||[];if(!t||L.length===0){o.innerHTML=`
            <div class="builder-empty-state">
              <strong>${D}</strong>
              <p>${V}</p>
            </div>
          `,a&&(a.textContent=W);return}if(o.innerHTML=L.map(c=>`
          <label class="builder-option" for="${p}-${c.value}" data-option-card data-section="${p}" data-value="${c.value}">
            <input
              id="${p}-${c.value}"
              class="builder-option-input"
              type="radio"
              name="${p}"
              value="${c.value}"
              data-builder-input
              data-section="${p}"
              ${j===c.value?"checked":""}
            />
            <span class="builder-option-check" aria-hidden="true"></span>
            <span class="builder-option-copy">
              <strong>${c.label}</strong>
              <span>${c.description||""}</span>
              ${c.note?`<small class="builder-option-note">${c.note}</small>`:""}
            </span>
          </label>
        `).join(""),a){const c=s(n,e,u,t);a.textContent=F(c)}},x=()=>{Object.entries(e).forEach(([o,a])=>{if(o==="customConsiderations"){C instanceof HTMLTextAreaElement&&(C.value=a);return}if((o==="optionalAdditions"||o==="vegetableSelections")&&Array.isArray(a)){a.forEach(t=>{const u=document.querySelector(`input[name="${o==="vegetableSelections"?"vegetableSelection":"optionalAdditions"}"][value="${t}"]`);u instanceof HTMLInputElement&&(u.checked=!0)});return}if(typeof a=="string"&&a){const t=document.querySelector(`input[name="${o}"][value="${a}"]`);t instanceof HTMLInputElement&&(t.checked=!0)}})},b=()=>{P(e)},v=()=>{const o=e.mainCourseCategory,a=n.mainCourseOptions[o]||[];if(d){if(!o||a.length===0){d.innerHTML=`
            <div class="builder-empty-state">
              <strong>Select a main course category</strong>
              <p>Once you choose a main course style, matching entrées for that Pacific Northwest direction will appear here.</p>
            </div>
          `,m&&(m.textContent="Choose a main course style to unlock curated entrée selections.");return}if(d.innerHTML=a.map(t=>`
          <label class="builder-option" for="mainCourseSelection-${t.value}" data-option-card data-section="mainCourseSelection" data-value="${t.value}">
            <input
              id="mainCourseSelection-${t.value}"
              class="builder-option-input"
              type="radio"
              name="mainCourseSelection"
              value="${t.value}"
              data-builder-input
              data-section="mainCourseSelection"
              ${e.mainCourseSelection===t.value?"checked":""}
            />
            <span class="builder-option-check" aria-hidden="true"></span>
            <span class="builder-option-copy">
              <strong>${t.label}</strong>
              <span>${t.description||""}</span>
              ${t.note?`<small class="builder-option-note">${t.note}</small>`:""}
            </span>
          </label>
        `).join(""),m){const t=s(n,e,"mainCourseCategory",o);m.textContent=`${t} entrées ready to refine your menu.`}}},$=()=>{f({container:T,helper:B,categoryValue:e.starchCategory,categorySectionId:"starchCategory",selectionSectionId:"starchSelection",selectedValue:e.starchSelection,collection:n.starchOptionsByCategory,emptyTitle:"Select a starch category",emptyCopy:"Choose a starch direction first and the matching starches or grains will appear here.",helperWhenEmpty:"Choose a starch category to unlock curated starch and grain selections.",helperWhenFilled:o=>`${o} selections ready to complete the plate.`})},A=()=>{f({container:q,helper:H,categoryValue:e.vegetableCategory,categorySectionId:"vegetableCategory",selectionSectionId:"vegetableSelection",selectedValue:e.vegetableSelections[0]||"",collection:n.vegetableOptionsByCategory,emptyTitle:"Select a vegetable category",emptyCopy:"Choose a vegetable direction first and the matching accompaniments will appear here.",helperWhenEmpty:"Choose a vegetable category to unlock curated accompaniments.",helperWhenFilled:o=>`${o} accompaniments ready to balance the plate.`})},h=()=>{const o=e.vegetableSelections.map(t=>s(n,e,"vegetableSelection",t)).filter(Boolean),a=[e.diningStyle?{label:g.diningStyle,value:s(n,e,"diningStyle",e.diningStyle)}:null,e.starter?{label:g.starter,value:s(n,e,"starter",e.starter)}:null,e.mainCourseCategory?{label:g.mainCourseCategory,value:s(n,e,"mainCourseCategory",e.mainCourseCategory)}:null,e.mainCourseSelection?{label:g.mainCourseSelection,value:s(n,e,"mainCourseSelection",e.mainCourseSelection)}:null,e.sauce?{label:g.sauce,value:s(n,e,"sauce",e.sauce)}:null,e.starchSelection?{label:"Starch / Grain",value:s(n,e,"starchSelection",e.starchSelection),meta:s(n,e,"starchCategory",e.starchCategory)}:null,o.length?{label:"Vegetables",value:o.join(" · "),meta:s(n,e,"vegetableCategory",e.vegetableCategory)}:null,e.optionalAdditions.length?{label:g.optionalAdditions,value:e.optionalAdditions.map(t=>s(n,e,"optionalAdditions",t)).filter(Boolean).join(" · ")}:null,e.dessert?{label:g.dessert,value:s(n,e,"dessert",e.dessert)}:null,e.customConsiderations.trim()?{label:g.customConsiderations,value:e.customConsiderations.trim()}:null].filter(Boolean);!i||!r||(a.length===0?(r.hidden=!1,i.hidden=!0,i.innerHTML=""):(r.hidden=!0,i.hidden=!1,i.innerHTML=a.map(t=>`
            <article class="menu-summary-item">
              <p>${t.label}</p>
              <strong>${t.value}</strong>
              ${t.meta?`<span class="menu-summary-item-meta">${t.meta}</span>`:""}
            </article>
          `).join("")),l&&(l.textContent=e.customConsiderations.trim()?e.customConsiderations.trim():"No custom considerations yet. Use the notes field to mention allergies, celebration details, favorite ingredients, or dietary preferences."))},E=()=>{document.querySelectorAll("[data-option-card]").forEach(o=>{const a=o.getAttribute("data-section"),t=o.getAttribute("data-value"),u=a==="optionalAdditions"?e.optionalAdditions.includes(t):a==="vegetableSelection"?e.vegetableSelections.includes(t):e[a]===t;o.classList.toggle("is-selected",!!u)})};w?.addEventListener("change",o=>{const a=o.target;if(!(a instanceof HTMLInputElement))return;const t=a.dataset.section;t&&(t==="optionalAdditions"?e.optionalAdditions=Array.from(document.querySelectorAll('input[name="optionalAdditions"]:checked')).map(u=>u instanceof HTMLInputElement?u.value:"").filter(Boolean):t==="vegetableSelection"?e.vegetableSelections=a.checked?[a.value]:[]:e[t]=a.value,t==="mainCourseCategory"&&(e.mainCourseSelection="",v()),t==="starchCategory"&&(e.starchSelection="",$()),t==="vegetableCategory"&&(e.vegetableSelections=[],A()),b(),E(),h())}),C?.addEventListener("input",o=>{const a=o.target;a instanceof HTMLTextAreaElement&&(e.customConsiderations=a.value,b(),h())}),k?.addEventListener("click",()=>{b(),window.location.href=U("/menu-preview")}),sessionStorage.getItem(S)||b(),v(),$(),A(),x(),E(),h()}
