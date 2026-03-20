# Private Menu Estimate Notes

This repository now includes a Phase 3 internal menu-estimate layer that composes Phase 2 recipe costing into unpublished menu-level food-cost rollups.

## Where the Phase 3 estimate logic lives

- Internal estimate utilities live in `src/data/privateMenuEstimates.ts`.
- Phase 2 recipe costing still comes from `src/generated/private-recipe-costing.json`.
- Builder-to-private-recipe mappings still come from `src/content/menuBuilderMappings/current-builder.json`.

## How composed menu estimates are built

The estimate layer accepts current Sample Menu Builder-style selections and:

1. reads the selected builder values
2. resolves the current builder labels for clean internal summaries
3. looks up the linked private recipe ids through the Phase 1 mapping layer
4. reads Phase 2 `estimated_cost_per_portion` recipe costing values
5. rolls those recipe records into a menu-level estimate

The current rollup supports these menu sections:

- dining style
- starter
- main course
- sauce
- starch / grain
- vegetable selections
- optional additions
- dessert

## Multi-select behavior

- `vegetableSelections` supports multiple selections and rolls each mapped vegetable recipe into the estimate.
- `optionalAdditions` supports multiple add-ons and rolls each mapped add-on recipe into the estimate.
- If a single builder selection maps to multiple private recipe ids, all linked recipe costs are included in that component rollup.

## Guest-count behavior

The estimate engine is structured around a per-person food-cost baseline.

- `estimated_cost_per_person` is the sum of each linked recipe's per-portion cost.
- `estimated_total_food_cost` scales from that baseline using `guestCount` when provided.
- If no guest count is supplied yet, the total currently reflects a single per-person composition baseline so the builder can add guest-count logic later without changing the cost architecture.

## Handling incomplete data

The estimate engine does not fail when costing data is incomplete.

Instead it:

- keeps the estimate object intact
- tracks `missing_cost_inputs`
- marks the estimate as `partial` when mapped recipe costing is incomplete or missing
- stores `estimate_notes` that identify what needs verification

Current estimate statuses are:

- `placeholder`
- `partial`
- `estimated`
- `verified`

## Internal summary output

Each estimate returns a `generated_summary` object intended for future internal workflows such as:

- admin review
- proposal scaffolding
- future pricing-tier derivation
- future contact-form or inquiry support

The summary is structured to read cleanly while keeping raw internal cost numbers unpublished.

## Future pricing-layer preparation

This Phase 3 layer only composes food-cost rollups.

It is intentionally structured so later phases can add:

- labor assumptions
- shopping overhead
- travel fees
- service fees
- markup / margin logic
- customer-facing starting-at pricing
- pricing-tier labels

Do **not** publish raw recipe costs, ingredient costs, or menu food-cost totals on public-facing routes in this phase.
