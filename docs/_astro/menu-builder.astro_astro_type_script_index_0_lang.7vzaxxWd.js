import{r as N,c as V,M as D,g as r,w as F,s as c}from"./menuBuilderClient.DBA53Cq0.js";function P(o="/"){const i="/PersonalChef/".replace(/\/$/,""),u=o==="/"?"/":o.startsWith("/")?o:`/${o}`;return u==="/"?`${i}/`:`${i}${u}`}const E=document.getElementById("menu-builder-data");if(E?.textContent){const o=JSON.parse(E.textContent),i=document.querySelector("[data-summary-list]"),u=document.querySelector("[data-summary-empty]"),b=document.querySelector("[data-summary-considerations]"),g=document.querySelector("[data-main-course-options]"),m=document.querySelector("[data-main-course-helper]"),A=document.querySelector("[data-starch-options]"),T=document.querySelector("[data-starch-helper]"),q=document.querySelector("[data-vegetable-options]"),M=document.querySelector("[data-vegetable-helper]"),H=document.querySelector("[data-preview-button]"),B=document.querySelector("[data-menu-builder]"),y=document.querySelector("[data-builder-textarea]"),e=N()||V(),C=({container:n,helper:a,categoryValue:t,categorySectionId:l,selectionSectionId:d,selectedValue:w,collection:O,emptyTitle:x,emptyCopy:j,helperWhenEmpty:I,helperWhenFilled:W})=>{if(!n)return;const L=O[t]||[];if(!t||L.length===0){n.innerHTML=`
            <div class="builder-empty-state">
              <strong>${x}</strong>
              <p>${j}</p>
            </div>
          `,a&&(a.textContent=I);return}if(n.innerHTML=L.map(s=>`
          <label class="builder-option" for="${d}-${s.value}" data-option-card data-section="${d}" data-value="${s.value}">
            <input
              id="${d}-${s.value}"
              class="builder-option-input"
              type="radio"
              name="${d}"
              value="${s.value}"
              data-builder-input
              data-section="${d}"
              ${w===s.value?"checked":""}
            />
            <span class="builder-option-check" aria-hidden="true"></span>
            <span class="builder-option-copy">
              <strong>${s.label}</strong>
              <span>${s.description||""}</span>
              ${s.note?`<small class="builder-option-note">${s.note}</small>`:""}
            </span>
          </label>
        `).join(""),a){const s=r(o,e,l,t);a.textContent=W(s)}},k=()=>{Object.entries(e).forEach(([n,a])=>{if(n==="customConsiderations"){y instanceof HTMLTextAreaElement&&(y.value=a);return}if((n==="optionalAdditions"||n==="vegetableSelections")&&Array.isArray(a)){a.forEach(t=>{const l=document.querySelector(`input[name="${n==="vegetableSelections"?"vegetableSelection":"optionalAdditions"}"][value="${t}"]`);l instanceof HTMLInputElement&&(l.checked=!0)});return}if(typeof a=="string"&&a){const t=document.querySelector(`input[name="${n}"][value="${a}"]`);t instanceof HTMLInputElement&&(t.checked=!0)}})},p=()=>{F(e)},v=()=>{const n=e.mainCourseCategory,a=o.mainCourseOptions[n]||[];if(g){if(!n||a.length===0){g.innerHTML=`
            <div class="builder-empty-state">
              <strong>Select a main course category</strong>
              <p>Once you choose a main course style, matching entrées for that Pacific Northwest direction will appear here.</p>
            </div>
          `,m&&(m.textContent="Choose a main course style to unlock curated entrée selections.");return}if(g.innerHTML=a.map(t=>`
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
        `).join(""),m){const t=r(o,e,"mainCourseCategory",n);m.textContent=`${t} entrées ready to refine your menu.`}}},S=()=>{C({container:A,helper:T,categoryValue:e.starchCategory,categorySectionId:"starchCategory",selectionSectionId:"starchSelection",selectedValue:e.starchSelection,collection:o.starchOptionsByCategory,emptyTitle:"Select a starch category",emptyCopy:"Choose a starch direction first and the matching starches or grains will appear here.",helperWhenEmpty:"Choose a starch category to unlock curated starch and grain selections.",helperWhenFilled:n=>`${n} selections ready to complete the plate.`})},f=()=>{C({container:q,helper:M,categoryValue:e.vegetableCategory,categorySectionId:"vegetableCategory",selectionSectionId:"vegetableSelection",selectedValue:e.vegetableSelections[0]||"",collection:o.vegetableOptionsByCategory,emptyTitle:"Select a vegetable category",emptyCopy:"Choose a vegetable direction first and the matching accompaniments will appear here.",helperWhenEmpty:"Choose a vegetable category to unlock curated accompaniments.",helperWhenFilled:n=>`${n} accompaniments ready to balance the plate.`})},h=()=>{const n=e.vegetableSelections.map(t=>r(o,e,"vegetableSelection",t)).filter(Boolean),a=[e.diningStyle?{label:c.diningStyle,value:r(o,e,"diningStyle",e.diningStyle)}:null,e.starter?{label:c.starter,value:r(o,e,"starter",e.starter)}:null,e.mainCourseCategory?{label:c.mainCourseCategory,value:r(o,e,"mainCourseCategory",e.mainCourseCategory)}:null,e.mainCourseSelection?{label:c.mainCourseSelection,value:r(o,e,"mainCourseSelection",e.mainCourseSelection)}:null,e.sauce?{label:c.sauce,value:r(o,e,"sauce",e.sauce)}:null,e.starchSelection?{label:"Starch / Grain",value:r(o,e,"starchSelection",e.starchSelection),meta:r(o,e,"starchCategory",e.starchCategory)}:null,n.length?{label:"Vegetables",value:n.join(" · "),meta:r(o,e,"vegetableCategory",e.vegetableCategory)}:null,e.optionalAdditions.length?{label:c.optionalAdditions,value:e.optionalAdditions.map(t=>r(o,e,"optionalAdditions",t)).filter(Boolean).join(" · ")}:null,e.dessert?{label:c.dessert,value:r(o,e,"dessert",e.dessert)}:null,e.customConsiderations.trim()?{label:c.customConsiderations,value:e.customConsiderations.trim()}:null].filter(Boolean);!i||!u||(a.length===0?(u.hidden=!1,i.hidden=!0,i.innerHTML=""):(u.hidden=!0,i.hidden=!1,i.innerHTML=a.map(t=>`
            <article class="menu-summary-item">
              <p>${t.label}</p>
              <strong>${t.value}</strong>
              ${t.meta?`<span class="menu-summary-item-meta">${t.meta}</span>`:""}
            </article>
          `).join("")),b&&(b.textContent=e.customConsiderations.trim()?e.customConsiderations.trim():"No custom considerations yet. Use the notes field to mention allergies, celebration details, favorite ingredients, or dietary preferences."))},$=()=>{document.querySelectorAll("[data-option-card]").forEach(n=>{const a=n.getAttribute("data-section"),t=n.getAttribute("data-value"),l=a==="optionalAdditions"?e.optionalAdditions.includes(t):a==="vegetableSelection"?e.vegetableSelections.includes(t):e[a]===t;n.classList.toggle("is-selected",!!l)})};B?.addEventListener("change",n=>{const a=n.target;if(!(a instanceof HTMLInputElement))return;const t=a.dataset.section;t&&(t==="optionalAdditions"?e.optionalAdditions=Array.from(document.querySelectorAll('input[name="optionalAdditions"]:checked')).map(l=>l instanceof HTMLInputElement?l.value:"").filter(Boolean):t==="vegetableSelection"?e.vegetableSelections=a.checked?[a.value]:[]:e[t]=a.value,t==="mainCourseCategory"&&(e.mainCourseSelection="",v()),t==="starchCategory"&&(e.starchSelection="",S()),t==="vegetableCategory"&&(e.vegetableSelections=[],f()),p(),$(),h())}),y?.addEventListener("input",n=>{const a=n.target;a instanceof HTMLTextAreaElement&&(e.customConsiderations=a.value,p(),h())}),H?.addEventListener("click",()=>{p(),window.location.href=P("/menu-preview")}),sessionStorage.getItem(D)||p(),v(),S(),f(),k(),$(),h()}
