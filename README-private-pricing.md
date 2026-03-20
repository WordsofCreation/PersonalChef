# Private Menu Pricing Notes

This repository now includes a Phase 4 internal pricing layer that builds on the Phase 3 unpublished menu food-cost estimate engine.

## Where the Phase 4 pricing logic lives

- Business pricing assumptions live in `src/data/privatePricingRules.ts`.
- The Phase 4 pricing engine lives in `src/data/privateMenuPricing.ts`.
- Phase 3 food-cost composition continues to live in `src/data/privateMenuEstimates.ts`.
- Phase 2 recipe costing still comes from `src/generated/private-recipe-costing.json`.

## How Phase 4 pricing builds on Phase 3

The pricing engine accepts either:

1. a Phase 3 `PrivateMenuEstimate`, or
2. the same builder-style selection input used by the menu estimate layer.

It then:

1. reads the unpublished food-cost totals from Phase 3
2. classifies menu complexity from dining style and selected items
3. estimates prep, service, and shopping/admin time
4. adds travel and overhead assumptions
5. applies a contingency buffer
6. applies the default internal pricing strategy
7. outputs both internal totals and future-safe public estimate tier scaffolding

## Current internal assumptions

The default rules layer includes modular fields for:

- hourly labor rate
- shopping and planning/admin defaults
- prep and service hour assumptions by complexity and dining style
- travel zone fees
- overhead and packaging assumptions
- contingency percentage
- markup multipliers
- minimum booking floor and per-person floor
- optional addition and dessert labor adjustments
- future holiday / peak-date adjustment support

All of these values are internal-only and should be updated in `src/data/privatePricingRules.ts`.

## Complexity logic

Phase 4 adds a maintainable complexity classifier that can increase labor when menus suggest:

- plated or tasting-style service
- seafood-heavy sourcing
- refined sauces or braises
- multiple add-ons
- additional vegetable components
- specialty desserts

The pricing output records:

- `complexity_level`
- `complexity_notes`
- `estimated_prep_hours`
- `estimated_service_hours`
- `estimated_shopping_admin_hours`

## Pricing strategy

The default strategy is currently `cost-plus-minimum-floor`.

At a high level, the engine:

1. starts with the Phase 3 food-cost total
2. adds labor, shopping/admin, travel, and overhead
3. applies contingency
4. applies internal markup logic
5. enforces both minimum booking and per-person floors
6. returns a suggested client price and a suggested price per person

The implementation is structured so additional strategies can be added later without moving formulas into UI files.

## Public-safe tier scaffolding

Phase 4 also generates internal-only future-facing fields such as:

- `public_estimate_label`
- `public_estimate_range_low`
- `public_estimate_range_high`
- `pricing_tier`
- `tier_notes` via pricing notes and summary context

These remain private in this phase. They are only intended to prepare for a later release that may show customer-safe “starting at” or estimated investment language.

## Handling incomplete data

If recipe costing or mapped inputs are incomplete:

- the pricing engine still returns an object
- `pricing_status` is downgraded to `partial` where appropriate
- missing inputs are preserved for review
- notes explain whether the estimate should be verified before operational use

## Internal validation fixtures

Private sample pricing fixtures live in `src/data/privateMenuPricing.ts` for internal validation only, including:

- romantic seafood dinner for 2
- family-style chicken dinner for 6
- braised short rib plated dinner for 8
- vegetarian celebration dinner for 4

Do **not** render raw pricing formulas, raw food-cost totals, or pricing components on public-facing routes in this phase.
