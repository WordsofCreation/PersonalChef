# Internal recipe and costing data

This project includes a private, unpublished recipe and ingredient-cost foundation that is used only for internal costing workflows and future menu estimate logic.

## Locations
- `src/content/privateRecipes/menu-builder-recipes.json` stores the source private recipe records for each current menu-builder selection.
- `src/content/ingredientCosts/base-costs.json` stores the shared ingredient purchase records that recipe ingredients link to by `linked_ingredient_cost_id`.
- `src/content/menuBuilderMappings/current-builder.json` stores the bridge between current public builder values and internal recipe ids.
- `scripts/lib/privateCosting.mjs` contains the costing formulas, unit conversion helpers, and incomplete-data handling rules.
- `scripts/generate-private-costing.mjs` generates the enriched internal costing output at build time.
- `src/generated/private-recipe-costing.json` stores the generated internal-only costing output used by future pricing utilities.
- `src/data/privateCosting.ts` provides typed helpers for future internal consumers.

## Guardrails
- Every internal recipe record remains unpublished and includes `published: false`.
- Raw costing data is not rendered on any public route in this phase.
- The public menu builder, public sample menus, and public booking flow remain visually unchanged.
- Costing logic is kept in build-time/internal utilities so the system stays static-site friendly.

## How recipe costing works
1. Each recipe ingredient points to a shared ingredient cost record using `linked_ingredient_cost_id`.
2. The costing generator derives a purchase unit cost from `purchase_price / purchase_quantity`.
3. It derives an edible unit cost by adjusting for `usable_yield_percent`.
4. It converts the recipe quantity used into the ingredient purchase measure where a supported conversion exists.
5. It multiplies the normalized recipe quantity by the edible unit cost to calculate ingredient usage cost.
6. It rolls those ingredient costs up into:
   - `estimated_total_recipe_cost`
   - `estimated_cost_per_portion`
   - `ingredient_cost_breakdown`
   - `costing_status`
   - `last_costed`
   - `costing_notes`

## Incomplete costing handling
- Missing cost records do not break the build.
- Ingredients with unsupported unit conversions or missing purchase inputs are marked as incomplete in the generated breakdown.
- Recipes with unresolved ingredients are marked `incomplete` instead of failing the build.
- Recipes that only contain unresolved placeholder data remain in the system with warnings so they can be refined later.

## Updating ingredient prices
1. Update the relevant record in `src/content/ingredientCosts/base-costs.json`.
2. Keep the stable `id` unchanged so linked recipes continue to resolve correctly.
3. Run `npm run build:private-costing` to regenerate the internal costing output.
4. Review the warnings in `src/generated/private-recipe-costing.json` for any recipes that still need normalization or missing conversions.

## Output strategy
- The source recipe file remains the authoritative private recipe input.
- The generated costing file is the authoritative internal costing output for future menu-estimate work.
- Phase 3 can safely consume `src/generated/private-recipe-costing.json` or `src/data/privateCosting.ts` without exposing raw purchase records publicly.

## Maintenance notes
- Prefer updating shared ingredient cost records instead of copying price data into recipe files.
- Keep ids stable once referenced by recipe ingredients or mapping entries.
- If builder options change, update `src/data/menuBuilder.ts`, add matching internal recipe records, and regenerate the costing output before shipping.
