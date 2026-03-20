import{r as N,c as P,M as V,g as r,w as D,s as u}from"./menuBuilderClient.DBhrRffN.js";function F(o="/"){const l="/PersonalChef/".replace(/\/$/,""),c=o==="/"?"/":o.startsWith("/")?o:`/${o}`;if(c==="/")return`${l}/`;const d=c.match(/^[^?#]*/)?.[0]??c,p=c.slice(d.length),m=d.endsWith("/")?d:`${d}/`;return`${l}${m}${p}`}const E=document.getElementById("menu-builder-data");if(E?.textContent){const o=JSON.parse(E.textContent),l=document.querySelector("[data-summary-list]"),c=document.querySelector("[data-summary-empty]"),d=document.querySelector("[data-summary-considerations]"),p=document.querySelector("[data-main-course-options]"),m=document.querySelector("[data-main-course-helper]"),A=document.querySelector("[data-starch-options]"),T=document.querySelector("[data-starch-helper]"),q=document.querySelector("[data-vegetable-options]"),M=document.querySelector("[data-vegetable-helper]"),H=document.querySelector("[data-preview-button]"),B=document.querySelector("[data-menu-builder]"),h=document.querySelector("[data-builder-textarea]"),e=N()||P(),C=({container:n,helper:a,categoryValue:t,categorySectionId:i,selectionSectionId:g,selectedValue:w,collection:x,emptyTitle:O,emptyCopy:W,helperWhenEmpty:j,helperWhenFilled:I})=>{if(!n)return;const L=x[t]||[];if(!t||L.length===0){n.innerHTML=`
            <div class="builder-empty-state">
              <strong>${O}</strong>
              <p>${W}</p>
            </div>
          `,a&&(a.textContent=j);return}if(n.innerHTML=L.map(s=>`
          <label class="builder-option" for="${g}-${s.value}" data-option-card data-section="${g}" data-value="${s.value}">
            <input
              id="${g}-${s.value}"
              class="builder-option-input"
              type="radio"
              name="${g}"
              value="${s.value}"
              data-builder-input
              data-section="${g}"
              ${w===s.value?"checked":""}
            />
            <span class="builder-option-check" aria-hidden="true"></span>
            <span class="builder-option-copy">
              <strong>${s.label}</strong>
              <span>${s.description||""}</span>
              ${s.note?`<small class="builder-option-note">${s.note}</small>`:""}
            </span>
          </label>
        `).join(""),a){const s=r(o,e,i,t);a.textContent=I(s)}},k=()=>{Object.entries(e).forEach(([n,a])=>{if(n==="customConsiderations"){h instanceof HTMLTextAreaElement&&(h.value=a);return}if((n==="optionalAdditions"||n==="vegetableSelections")&&Array.isArray(a)){a.forEach(t=>{const i=document.querySelector(`input[name="${n==="vegetableSelections"?"vegetableSelection":"optionalAdditions"}"][value="${t}"]`);i instanceof HTMLInputElement&&(i.checked=!0)});return}if(typeof a=="string"&&a){const t=document.querySelector(`input[name="${n}"][value="${a}"]`);t instanceof HTMLInputElement&&(t.checked=!0)}})},y=()=>{D(e)},v=()=>{const n=e.mainCourseCategory,a=o.mainCourseOptions[n]||[];if(p){if(!n||a.length===0){p.innerHTML=`
            <div class="builder-empty-state">
              <strong>Select a main course category</strong>
              <p>Once you choose a main course style, matching entrées for that Pacific Northwest direction will appear here.</p>
            </div>
          `,m&&(m.textContent="Choose a main course style to unlock curated entrée selections.");return}if(p.innerHTML=a.map(t=>`
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
        `).join(""),m){const t=r(o,e,"mainCourseCategory",n);m.textContent=`${t} entrées ready to refine your menu.`}}},S=()=>{C({container:A,helper:T,categoryValue:e.starchCategory,categorySectionId:"starchCategory",selectionSectionId:"starchSelection",selectedValue:e.starchSelection,collection:o.starchOptionsByCategory,emptyTitle:"Select a starch category",emptyCopy:"Choose a starch direction first and the matching starches or grains will appear here.",helperWhenEmpty:"Choose a starch category to unlock curated starch and grain selections.",helperWhenFilled:n=>`${n} selections ready to complete the plate.`})},f=()=>{C({container:q,helper:M,categoryValue:e.vegetableCategory,categorySectionId:"vegetableCategory",selectionSectionId:"vegetableSelection",selectedValue:e.vegetableSelections[0]||"",collection:o.vegetableOptionsByCategory,emptyTitle:"Select a vegetable category",emptyCopy:"Choose a vegetable direction first and the matching accompaniments will appear here.",helperWhenEmpty:"Choose a vegetable category to unlock curated accompaniments.",helperWhenFilled:n=>`${n} accompaniments ready to balance the plate.`})},b=()=>{const n=e.vegetableSelections.map(t=>r(o,e,"vegetableSelection",t)).filter(Boolean),a=[e.diningStyle?{label:u.diningStyle,value:r(o,e,"diningStyle",e.diningStyle)}:null,e.starter?{label:u.starter,value:r(o,e,"starter",e.starter)}:null,e.mainCourseCategory?{label:u.mainCourseCategory,value:r(o,e,"mainCourseCategory",e.mainCourseCategory)}:null,e.mainCourseSelection?{label:u.mainCourseSelection,value:r(o,e,"mainCourseSelection",e.mainCourseSelection)}:null,e.sauce?{label:u.sauce,value:r(o,e,"sauce",e.sauce)}:null,e.starchSelection?{label:"Starch / Grain",value:r(o,e,"starchSelection",e.starchSelection),meta:r(o,e,"starchCategory",e.starchCategory)}:null,n.length?{label:"Vegetables",value:n.join(" · "),meta:r(o,e,"vegetableCategory",e.vegetableCategory)}:null,e.optionalAdditions.length?{label:u.optionalAdditions,value:e.optionalAdditions.map(t=>r(o,e,"optionalAdditions",t)).filter(Boolean).join(" · ")}:null,e.dessert?{label:u.dessert,value:r(o,e,"dessert",e.dessert)}:null,e.customConsiderations.trim()?{label:u.customConsiderations,value:e.customConsiderations.trim()}:null].filter(Boolean);!l||!c||(a.length===0?(c.hidden=!1,l.hidden=!0,l.innerHTML=""):(c.hidden=!0,l.hidden=!1,l.innerHTML=a.map(t=>`
            <article class="menu-summary-item">
              <p>${t.label}</p>
              <strong>${t.value}</strong>
              ${t.meta?`<span class="menu-summary-item-meta">${t.meta}</span>`:""}
            </article>
          `).join("")),d&&(d.textContent=e.customConsiderations.trim()?e.customConsiderations.trim():"No custom considerations yet. Use the notes field to mention allergies, celebration details, favorite ingredients, or dietary preferences."))},$=()=>{document.querySelectorAll("[data-option-card]").forEach(n=>{const a=n.getAttribute("data-section"),t=n.getAttribute("data-value"),i=a==="optionalAdditions"?e.optionalAdditions.includes(t):a==="vegetableSelection"?e.vegetableSelections.includes(t):e[a]===t;n.classList.toggle("is-selected",!!i)})};B?.addEventListener("change",n=>{const a=n.target;if(!(a instanceof HTMLInputElement))return;const t=a.dataset.section;t&&(t==="optionalAdditions"?e.optionalAdditions=Array.from(document.querySelectorAll('input[name="optionalAdditions"]:checked')).map(i=>i instanceof HTMLInputElement?i.value:"").filter(Boolean):t==="vegetableSelection"?e.vegetableSelections=a.checked?[a.value]:[]:e[t]=a.value,t==="mainCourseCategory"&&(e.mainCourseSelection="",v()),t==="starchCategory"&&(e.starchSelection="",S()),t==="vegetableCategory"&&(e.vegetableSelections=[],f()),y(),$(),b())}),h?.addEventListener("input",n=>{const a=n.target;a instanceof HTMLTextAreaElement&&(e.customConsiderations=a.value,y(),b())}),H?.addEventListener("click",()=>{y(),window.location.href=F("/menu-preview")}),sessionStorage.getItem(V)||y(),v(),S(),f(),k(),$(),b()}
