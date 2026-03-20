# Private Recipe Costing Notes

This repository now includes a Phase 2 private costing layer for unpublished recipe and menu-estimate work.

## What the costing script does

- Source recipes live in `src/content/privateRecipes/menu-builder-recipes.json`.
- Source ingredient purchase records live in `src/content/ingredientCosts/base-costs.json`.
- The build-time generator in `scripts/generate-private-costing.mjs` calls `generatePrivateRecipeCosting()` from `scripts/lib/privateCosting.mjs`.
- The generator writes enriched internal-only output to `src/generated/private-recipe-costing.json`.

## How recipe ingredients link to ingredient costs

Each recipe ingredient uses `linked_ingredient_cost_id` to connect to a private ingredient purchase record.

The costing engine derives:

1. `purchase_unit_cost = purchase_price / purchase_quantity`
2. `edible_unit_cost = purchase_unit_cost / usable_yield_percent` when a direct edible cost is not already supplied
3. `cost_of_quantity_used = edible_unit_cost * normalized_recipe_quantity`

The script also normalizes common unit conversions such as:

- ounces ↔ pounds
- teaspoons / tablespoons / cups ↔ fluid ounces
- fluid ounces ↔ milliliters
- each-style count units where supported
- ingredient-specific purchase mappings such as loaf → slices / ounces or box → packets when the private ingredient cost record includes `recipe_unit_mappings`

## Recipe totals produced by the generator

For every private recipe, the generator outputs:

- `estimated_total_recipe_cost`
- `estimated_cost_per_portion`
- `ingredient_cost_breakdown`
- `costing_status`
- `last_costed`
- `costing_notes`
- `portion_count`

## Handling incomplete costing

If a linked ingredient record is missing, lacks enough data, or cannot be converted cleanly:

- the build does **not** fail
- the recipe remains in the private dataset
- the recipe gets warning notes
- `costing_status` is set to `incomplete` when partial costing is available

Current intended statuses:

- `placeholder`
- `estimated`
- `verified`
- `incomplete`

## Updating ingredient prices

When vendor costs change:

1. Update the matching record in `src/content/ingredientCosts/base-costs.json`.
2. Run `npm run build:private-costing`.
3. Review the regenerated `src/generated/private-recipe-costing.json` output.

If a recipe starts warning on unit conversions, add or adjust `recipe_unit_mappings` on the related ingredient record so the generator can translate recipe usage units back to the purchase unit cleanly.

## Internal-only reminder

Do not expose `src/generated/private-recipe-costing.json` or any raw recipe/ingredient cost values on public-facing routes in this phase.

## Future Phase 3 preparation

The generated file now also includes:

- `summary_by_status`
- `summary_by_category`

These are internal-only rollups intended to support future menu-level estimate composition without moving costing formulas into public UI files.
