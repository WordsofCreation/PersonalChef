# Internal recipe and costing data

This project now includes a private, unpublished content foundation for future food costing and menu-estimate logic.

## Locations
- `src/content/privateRecipes/menu-builder-recipes.json` stores internal recipe records for every current Sample Menu Builder selection.
- `src/content/ingredientCosts/base-costs.json` stores reusable ingredient cost records that recipes reference by stable `linked_ingredient_cost_id` values.
- `src/content/menuBuilderMappings/current-builder.json` stores the mapping layer between current public menu-builder values and internal recipe ids.
- `src/data/privateMenuData.ts` centralizes collection names and a reminder that this content is operational only.

## Guardrails
- Every internal recipe record includes `published: false`.
- These files live in data collections only; no routes or public pages read or render them in Phase 1.
- Public menu-builder UX remains unchanged. This phase only adds internal architecture and starter content.
- Keep future costing logic server-side/build-time only unless a later phase intentionally exposes derived, non-sensitive outputs.

## Mapping strategy
- Simple single-select sections such as starters, sauces, desserts, and add-ons map a builder value directly to one internal recipe id.
- Category-driven sections such as mains, starches, and vegetables keep both category-to-allowed-recipes maps and direct selection-to-recipe maps.
- Vegetable mappings are arrays so later estimate logic can support composed or multi-selection vegetable sides without changing the schema.
- Dining styles are represented as internal pricing/service profiles so later pricing logic can apply style-based labor or service multipliers.

## Costing workflow for Phase 2
1. Replace placeholder ingredient costs with vendor-specific purchasing data.
2. Tighten recipe ingredient quantities into production-ready weights and yields.
3. Compute recipe totals from linked ingredient costs.
4. Aggregate selected recipe ids from the mapping file into menu-level estimate logic.

## Maintenance notes
- Prefer adding or updating shared ingredient cost records instead of copying price data into recipe files.
- Keep ids stable once referenced by mapping entries.
- If the public builder options change, update `src/data/menuBuilder.ts` and then add matching internal records/mappings before shipping.
