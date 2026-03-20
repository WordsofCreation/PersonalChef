import {
  createPrivateMenuEstimate,
  type PrivateMenuEstimate,
  type PrivateMenuEstimateSelectionInput
} from './privateMenuEstimates';
import {
  privatePricingRules,
  type MenuComplexityLevel,
  type PricingStatus,
  type PricingStrategyId,
  type PricingTier,
  type TravelZone
} from './privatePricingRules';

const roundCurrency = (value: number) => Number(value.toFixed(2));
const roundHours = (value: number) => Number(value.toFixed(2));

const complexityOrder: MenuComplexityLevel[] = ['simple', 'standard', 'elevated', 'luxury'];

const clampComplexity = (score: number): MenuComplexityLevel => complexityOrder[Math.max(0, Math.min(score, complexityOrder.length - 1))] || 'standard';

const guestCountOrDefault = (guestCount: number | null) => (guestCount && guestCount > 0 ? guestCount : 1);

const getThresholdHours = (guestCount: number) =>
  privatePricingRules.shopping_admin_hours_by_guest_count.find((entry) => guestCount <= entry.up_to_guests)?.additional_hours || 0;

const getComponentBuilderValues = (menuEstimate: PrivateMenuEstimate, section: PrivateMenuEstimate['component_estimates'][number]['section']) =>
  menuEstimate.component_estimates.filter((component) => component.section === section).map((component) => component.builderValue);

const getPricingStatus = (menuEstimate: PrivateMenuEstimate, missingInputs: string[]): PricingStatus => {
  if (menuEstimate.estimate_status === 'placeholder') return 'placeholder';
  if (menuEstimate.estimate_status === 'partial' || missingInputs.length > 0) return 'partial';
  if (menuEstimate.estimate_status === 'verified') return 'verified';
  return 'estimated';
};

const classifyMenuComplexity = (menuEstimate: PrivateMenuEstimate) => {
  const snapshot = menuEstimate.selected_builder_items;
  const diningStyleValue = getComponentBuilderValues(menuEstimate, 'diningStyle')[0] || '';
  const lowerLabels = [
    snapshot.diningStyle,
    snapshot.starter,
    snapshot.mainCourseSelection,
    snapshot.sauce,
    snapshot.starchSelection,
    ...snapshot.vegetableSelections,
    ...snapshot.optionalAdditions,
    snapshot.dessert
  ]
    .filter(Boolean)
    .join(' | ')
    .toLowerCase();

  let score = 1;
  const notes: string[] = [];

  const additionCount = snapshot.optionalAdditions.length;
  const vegetableCount = snapshot.vegetableSelections.length;

  if (diningStyleValue === 'seasonal-tasting-menu') {
    score += 2;
    notes.push('Seasonal tasting dining style increases plating and progression complexity.');
  }

  if (diningStyleValue === 'romantic-peninsula-dinner') {
    score += 1;
    notes.push('Romantic dinner styling suggests more plated finishing and table-side polish.');
  }

  if (diningStyleValue === 'pnw-family-table') {
    notes.push('Family-table format keeps service more batch-oriented than plated service.');
  }

  if (additionCount >= 2) {
    score += 1;
    notes.push(`Multiple add-ons (${additionCount}) increase prep coordination and finishing load.`);
  }

  if (vegetableCount >= 2) {
    score += 1;
    notes.push('Multiple vegetable sides increase component timing and station coordination.');
  }

  if (/seafood|salmon|halibut|crab|oyster/.test(lowerLabels)) {
    score += 1;
    notes.push('Seafood-forward selections raise sourcing sensitivity and finishing complexity.');
  }

  if (/short rib|risotto|beurre blanc|veloute|jus|tart|brulee/.test(lowerLabels)) {
    score += 1;
    notes.push('Refined sauces, braises, or pastry-style components add technical labor.');
  }

  if (privatePricingRules.complexity_keywords.luxury.some((keyword) => lowerLabels.includes(keyword))) {
    score += 1;
  } else if (privatePricingRules.complexity_keywords.elevated.some((keyword) => lowerLabels.includes(keyword))) {
    notes.push('Ingredient and format cues suggest an elevated private-dining build.');
  }

  const styleAdjustment = privatePricingRules.dining_style_complexity_adjustments[diningStyleValue];
  if (styleAdjustment?.complexity_bump) {
    score += styleAdjustment.complexity_bump;
  }

  const complexityLevel = clampComplexity(score);
  return {
    complexity_level: complexityLevel,
    complexity_notes: notes.length ? notes : ['Standard composed-menu complexity based on current selections.']
  };
};

const getPublicTier = (suggestedClientPrice: number): { pricing_tier: PricingTier; public_estimate_label: string } => {
  const match = privatePricingRules.pricing_tier_thresholds.find((threshold) => suggestedClientPrice <= threshold.max_total);
  return {
    pricing_tier: match?.tier || 'celebration',
    public_estimate_label: match?.public_estimate_label || 'Estimated Investment'
  };
};

export type PrivateMenuPricingComplexity = {
  complexity_level: MenuComplexityLevel;
  complexity_notes: string[];
  estimated_prep_hours: number;
  estimated_service_hours: number;
  estimated_shopping_admin_hours: number;
};

export type PrivateMenuPricingSummary = {
  dining_style: string | null;
  selected_menu_components: string[];
  food_cost_status: PrivateMenuEstimate['estimate_status'];
  pricing_status: PricingStatus;
  food_cost: number;
  labor_estimate: number;
  shopping_admin: number;
  travel_overhead: number;
  suggested_client_price: number;
  suggested_price_per_person: number;
  pricing_tier: PricingTier;
  notes: string[];
  internal_visibility: 'private';
};

export type PrivateMenuPricingEstimate = {
  pricing_estimate_id: string;
  menu_estimate_id: string;
  pricing_strategy: PricingStrategyId;
  pricing_status: PricingStatus;
  estimate_source: 'phase-3-menu-estimate';
  menu_estimate: PrivateMenuEstimate;
  guest_count: number | null;
  travel_zone: TravelZone;
  complexity: PrivateMenuPricingComplexity;
  estimated_total_food_cost: number;
  estimated_cost_per_person: number;
  estimated_labor_cost: number;
  estimated_shopping_admin_cost: number;
  estimated_travel_cost: number;
  estimated_overhead_cost: number;
  estimated_contingency_amount: number;
  estimated_internal_total_cost: number;
  suggested_client_price: number;
  suggested_price_per_person: number;
  public_estimate_label: string;
  public_estimate_range_low: number;
  public_estimate_range_high: number;
  pricing_tier: PricingTier;
  tier_notes: string[];
  pricing_notes: string[];
  missing_inputs: string[];
  generated_summary: PrivateMenuPricingSummary;
};

export type PrivateMenuPricingOptions = {
  travelZone?: TravelZone;
  applyHolidayAdjustment?: boolean;
};

export const PRIVATE_MENU_PRICING_NOTE =
  'Internal business pricing estimates only. Do not expose formulas, raw cost components, or internal totals on public-facing routes.';

export const createPrivateMenuPricingEstimate = (
  input: PrivateMenuEstimate | PrivateMenuEstimateSelectionInput,
  options: PrivateMenuPricingOptions = {}
): PrivateMenuPricingEstimate => {
  const menuEstimate = 'menu_estimate_id' in input ? input : createPrivateMenuEstimate(input);
  const guestCount = menuEstimate.selected_builder_items.guestCount;
  const normalizedGuestCount = guestCountOrDefault(guestCount);
  const travelZone = options.travelZone || 'local';
  const complexityBase = classifyMenuComplexity(menuEstimate);
  const diningStyleValue = getComponentBuilderValues(menuEstimate, 'diningStyle')[0] || '';
  const dessertValue = getComponentBuilderValues(menuEstimate, 'dessert')[0] || '';
  const optionalAdditionValues = getComponentBuilderValues(menuEstimate, 'optionalAdditions');
  const styleAdjustment = privatePricingRules.dining_style_complexity_adjustments[diningStyleValue] || {};

  const estimatedPrepHours = roundHours(
    privatePricingRules.prep_hours_by_menu_complexity[complexityBase.complexity_level] + (styleAdjustment.prep_hours || 0)
  );
  const estimatedServiceHours = roundHours(
    Math.max(
      0,
      (privatePricingRules.service_hours_by_dining_style[diningStyleValue] || 1.5) +
        privatePricingRules.finishing_hours_by_complexity[complexityBase.complexity_level] +
        (styleAdjustment.service_hours || 0)
    )
  );
  const estimatedShoppingAdminHours = roundHours(
    privatePricingRules.shopping_hours_default +
      privatePricingRules.planning_admin_hours_default +
      privatePricingRules.shopping_complexity_hours_by_level[complexityBase.complexity_level] +
      getThresholdHours(normalizedGuestCount) +
      (styleAdjustment.shopping_admin_hours || 0) +
      optionalAdditionValues.reduce(
        (total, addition) => total + (privatePricingRules.optional_addition_labor_adjustments[addition] || 0),
        0
      ) +
      (dessertValue ? privatePricingRules.dessert_labor_adjustments[dessertValue] || 0 : 0)
  );

  const estimatedLaborHours = roundHours(estimatedPrepHours + estimatedServiceHours);
  const estimatedLaborCost = roundCurrency(estimatedLaborHours * privatePricingRules.default_hourly_labor_rate);
  const estimatedShoppingAdminCost = roundCurrency(
    estimatedShoppingAdminHours * privatePricingRules.default_hourly_labor_rate
  );
  const estimatedTravelCost = roundCurrency(privatePricingRules.travel_fee_by_zone[travelZone]);
  const estimatedOverheadCost = roundCurrency(
    privatePricingRules.overhead_flat_fee +
      normalizedGuestCount * privatePricingRules.overhead_per_guest +
      (privatePricingRules.packaging_misc_by_dining_style[diningStyleValue] || 0)
  );

  const subtotalBeforeContingency =
    menuEstimate.estimated_total_food_cost +
    estimatedLaborCost +
    estimatedShoppingAdminCost +
    estimatedTravelCost +
    estimatedOverheadCost;
  const estimatedContingencyAmount = roundCurrency(subtotalBeforeContingency * privatePricingRules.contingency_percent);
  const estimatedInternalTotalCost = roundCurrency(subtotalBeforeContingency + estimatedContingencyAmount);

  const markupBase =
    estimatedInternalTotalCost * privatePricingRules.markup_multiplier_by_complexity[complexityBase.complexity_level] +
    privatePricingRules.flat_event_base_fee;
  const holidayMultiplier =
    options.applyHolidayAdjustment && privatePricingRules.holiday_or_peak_adjustments.enabled
      ? privatePricingRules.holiday_or_peak_adjustments.multiplier
      : 1;
  const luxuryMultiplier = complexityBase.complexity_level === 'luxury' ? privatePricingRules.luxury_tier_markup_multiplier : 1;
  const perPersonFloorTotal = normalizedGuestCount * privatePricingRules.per_person_floor;

  const suggestedClientPrice = roundCurrency(
    Math.max(
      markupBase * holidayMultiplier * luxuryMultiplier,
      privatePricingRules.minimum_booking_floor,
      perPersonFloorTotal
    )
  );
  const suggestedPricePerPerson = roundCurrency(suggestedClientPrice / normalizedGuestCount);
  const tier = getPublicTier(suggestedClientPrice);
  const rangeLow = Math.max(privatePricingRules.minimum_booking_floor, Math.floor(suggestedClientPrice * 0.93 / 25) * 25);
  const rangeHigh = Math.ceil(suggestedClientPrice * 1.07 / 25) * 25;

  const missingInputs = [
    ...menuEstimate.missing_cost_inputs.map((input) => `${input.section}:${input.builderValue}`),
    ...(guestCount ? [] : ['guestCount: missing guest count, using 1-person internal baseline'])
  ];
  const pricingStatus = getPricingStatus(menuEstimate, missingInputs);
  const selectedMenuComponents = [
    menuEstimate.selected_builder_items.starter,
    menuEstimate.selected_builder_items.mainCourseSelection,
    menuEstimate.selected_builder_items.sauce,
    menuEstimate.selected_builder_items.starchSelection,
    ...menuEstimate.selected_builder_items.vegetableSelections,
    ...menuEstimate.selected_builder_items.optionalAdditions,
    menuEstimate.selected_builder_items.dessert
  ].filter((value): value is string => Boolean(value));

  const tierNotes = [
    `${tier.public_estimate_label} band prepared for future customer-safe estimate display.`,
    `Internal tier classification: ${tier.pricing_tier}.`,
    guestCount ? `Range shaped around a ${guestCount}-guest event basis.` : 'Range currently reflects a single-guest internal baseline.'
  ];

  const pricingNotes = [
    ...complexityBase.complexity_notes,
    guestCount
      ? `Pricing scaled for ${guestCount} guest(s) with both total-event and per-person outputs.`
      : 'Guest count is not yet integrated from the public flow, so pricing currently uses a single-guest baseline for internal review.',
    `Travel zone assumption: ${travelZone}.`,
    `Default pricing strategy applied: ${privatePricingRules.default_markup_strategy}.`,
    menuEstimate.estimate_status === 'partial'
      ? 'Food-cost estimate is partial; verify missing recipe-cost inputs before using this pricing operationally.'
      : 'Food-cost baseline is available for pricing rollup.',
    `Public-safe tier scaffold prepared as ${tier.pricing_tier} with ${tier.public_estimate_label.toLowerCase()} range output.`
  ];

  return {
    pricing_estimate_id: `pricing-${menuEstimate.menu_estimate_id}`,
    menu_estimate_id: menuEstimate.menu_estimate_id,
    pricing_strategy: privatePricingRules.default_markup_strategy,
    pricing_status: pricingStatus,
    estimate_source: 'phase-3-menu-estimate',
    menu_estimate: menuEstimate,
    guest_count: guestCount,
    travel_zone: travelZone,
    complexity: {
      ...complexityBase,
      estimated_prep_hours: estimatedPrepHours,
      estimated_service_hours: estimatedServiceHours,
      estimated_shopping_admin_hours: estimatedShoppingAdminHours
    },
    estimated_total_food_cost: menuEstimate.estimated_total_food_cost,
    estimated_cost_per_person: menuEstimate.estimated_cost_per_person,
    estimated_labor_cost: estimatedLaborCost,
    estimated_shopping_admin_cost: estimatedShoppingAdminCost,
    estimated_travel_cost: estimatedTravelCost,
    estimated_overhead_cost: estimatedOverheadCost,
    estimated_contingency_amount: estimatedContingencyAmount,
    estimated_internal_total_cost: estimatedInternalTotalCost,
    suggested_client_price: suggestedClientPrice,
    suggested_price_per_person: suggestedPricePerPerson,
    public_estimate_label: tier.public_estimate_label,
    public_estimate_range_low: rangeLow,
    public_estimate_range_high: rangeHigh,
    pricing_tier: tier.pricing_tier,
    tier_notes: tierNotes,
    pricing_notes: pricingNotes,
    missing_inputs: missingInputs,
    generated_summary: {
      dining_style: menuEstimate.selected_builder_items.diningStyle,
      selected_menu_components: selectedMenuComponents,
      food_cost_status: menuEstimate.estimate_status,
      pricing_status: pricingStatus,
      food_cost: menuEstimate.estimated_total_food_cost,
      labor_estimate: roundCurrency(estimatedLaborCost + estimatedShoppingAdminCost),
      shopping_admin: estimatedShoppingAdminCost,
      travel_overhead: roundCurrency(estimatedTravelCost + estimatedOverheadCost),
      suggested_client_price: suggestedClientPrice,
      suggested_price_per_person: suggestedPricePerPerson,
      pricing_tier: tier.pricing_tier,
      notes: pricingNotes,
      internal_visibility: 'private'
    }
  };
};

export const privateMenuPricingFixtures = [
  {
    id: 'fixture-romantic-seafood-for-2',
    label: 'Romantic seafood dinner for 2',
    selection: {
      diningStyle: 'romantic-peninsula-dinner',
      starter: 'dungeness-crab-cakes-with-herb-aioli',
      mainCourseCategory: 'pnw-seafood',
      mainCourseSelection: 'cedar-plank-salmon',
      sauce: 'chive-beurre-blanc',
      starchCategory: 'rice-and-grain-sides',
      starchSelection: 'wild-rice-pilaf',
      vegetableCategory: 'green-vegetables',
      vegetableSelections: ['asparagus-with-lemon-and-herbs'],
      optionalAdditions: ['artisan-bread-service'],
      dessert: 'creme-brulee',
      guestCount: 2
    } satisfies PrivateMenuEstimateSelectionInput
  },
  {
    id: 'fixture-family-style-chicken-for-6',
    label: 'Family-style chicken dinner for 6',
    selection: {
      diningStyle: 'pnw-family-table',
      starter: 'little-gem-salad-with-herbs-and-champagne-vinaigrette',
      mainCourseCategory: 'woodland-poultry',
      mainCourseSelection: 'cider-brined-roast-chicken',
      sauce: 'herb-roasting-jus',
      starchCategory: 'potato-preparations',
      starchSelection: 'brown-butter-mashed-potatoes',
      vegetableCategory: 'green-vegetables',
      vegetableSelections: ['charred-broccolini'],
      optionalAdditions: ['artisan-bread-service', 'extra-vegetable-side'],
      dessert: 'apple-crisp',
      guestCount: 6
    } satisfies PrivateMenuEstimateSelectionInput
  },
  {
    id: 'fixture-short-rib-plated-for-8',
    label: 'Braised short rib plated dinner for 8',
    selection: {
      diningStyle: 'harvest-celebration-dinner',
      starter: 'caramelized-onion-and-gruyere-tart',
      mainCourseCategory: 'braised-and-roasted-meats',
      mainCourseSelection: 'beef-with-pinot-noir-jus',
      sauce: 'pinot-noir-jus',
      starchCategory: 'potato-preparations',
      starchSelection: 'pommes-puree',
      vegetableCategory: 'root-and-orchard-vegetables',
      vegetableSelections: ['glazed-carrots'],
      optionalAdditions: ['seasonal-salad'],
      dessert: 'chocolate-pot-de-creme',
      guestCount: 8
    } satisfies PrivateMenuEstimateSelectionInput
  },
  {
    id: 'fixture-vegetarian-celebration-for-4',
    label: 'Vegetarian celebration dinner for 4',
    selection: {
      diningStyle: 'seasonal-tasting-menu',
      starter: 'wild-mushroom-tartlet',
      mainCourseCategory: 'vegetarian-from-the-garden',
      mainCourseSelection: 'wild-mushroom-risotto',
      sauce: 'wild-mushroom-veloute',
      starchCategory: 'seasonal-rustic-sides',
      starchSelection: 'herb-grain-medley',
      vegetableCategory: 'seasonal-market-sides',
      vegetableSelections: ['seasonal-market-vegetables', 'chef-s-market-vegetable-selection'],
      optionalAdditions: ['northwest-cheese-board'],
      dessert: 'pear-almond-tart',
      guestCount: 4
    } satisfies PrivateMenuEstimateSelectionInput
  }
] as const;

export const getPrivateMenuPricingFixtures = () =>
  privateMenuPricingFixtures.map((fixture) => ({
    ...fixture,
    pricing: createPrivateMenuPricingEstimate(fixture.selection)
  }));
