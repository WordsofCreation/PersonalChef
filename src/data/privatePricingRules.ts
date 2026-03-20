export type PricingStatus = 'placeholder' | 'partial' | 'estimated' | 'verified';
export type PricingStrategyId = 'cost-plus-minimum-floor';
export type MenuComplexityLevel = 'simple' | 'standard' | 'elevated' | 'luxury';
export type PricingTier = 'intimate' | 'signature' | 'elevated' | 'celebration';
export type TravelZone = 'local' | 'extended';

export type PrivatePricingRules = {
  rules_version: string;
  default_hourly_labor_rate: number;
  shopping_hours_default: number;
  planning_admin_hours_default: number;
  shopping_complexity_hours_by_level: Record<MenuComplexityLevel, number>;
  service_hours_by_dining_style: Record<string, number>;
  prep_hours_by_menu_complexity: Record<MenuComplexityLevel, number>;
  finishing_hours_by_complexity: Record<MenuComplexityLevel, number>;
  shopping_admin_hours_by_guest_count: Array<{
    up_to_guests: number;
    additional_hours: number;
  }>;
  travel_fee_local: number;
  travel_fee_extended: number;
  travel_fee_by_zone: Record<TravelZone, number>;
  overhead_flat_fee: number;
  overhead_per_guest: number;
  packaging_misc_by_dining_style: Record<string, number>;
  contingency_percent: number;
  default_markup_strategy: PricingStrategyId;
  markup_multiplier_by_complexity: Record<MenuComplexityLevel, number>;
  luxury_tier_markup_multiplier: number;
  minimum_booking_floor: number;
  per_person_floor: number;
  flat_event_base_fee: number;
  optional_addition_labor_adjustments: Record<string, number>;
  dessert_labor_adjustments: Record<string, number>;
  holiday_or_peak_adjustments: {
    enabled: boolean;
    multiplier: number;
    note: string;
  };
  dining_style_complexity_adjustments: Record<string, Partial<{
    prep_hours: number;
    service_hours: number;
    shopping_admin_hours: number;
    complexity_bump: number;
  }>>;
  complexity_keywords: {
    elevated: string[];
    luxury: string[];
  };
  pricing_tier_thresholds: Array<{
    max_total: number;
    tier: PricingTier;
    public_estimate_label: string;
  }>;
  notes: string[];
};

export const privatePricingRules: PrivatePricingRules = {
  rules_version: 'phase-4-v1',
  default_hourly_labor_rate: 55,
  shopping_hours_default: 1.25,
  planning_admin_hours_default: 0.75,
  shopping_complexity_hours_by_level: {
    simple: 0,
    standard: 0.25,
    elevated: 0.5,
    luxury: 0.75
  },
  service_hours_by_dining_style: {
    'olympic-coast-dinner': 1.75,
    'forest-and-field-supper': 1.5,
    'romantic-peninsula-dinner': 2,
    'pnw-family-table': 1.25,
    'seasonal-tasting-menu': 2.5,
    'coastal-brunch-table': 1.5,
    'harvest-celebration-dinner': 1.75,
    'wellness-from-the-northwest': 1.5
  },
  prep_hours_by_menu_complexity: {
    simple: 2,
    standard: 3.25,
    elevated: 4.5,
    luxury: 6
  },
  finishing_hours_by_complexity: {
    simple: 0.25,
    standard: 0.5,
    elevated: 0.75,
    luxury: 1.25
  },
  shopping_admin_hours_by_guest_count: [
    { up_to_guests: 2, additional_hours: 0 },
    { up_to_guests: 4, additional_hours: 0.25 },
    { up_to_guests: 8, additional_hours: 0.5 },
    { up_to_guests: 12, additional_hours: 0.75 },
    { up_to_guests: 999, additional_hours: 1.25 }
  ],
  travel_fee_local: 35,
  travel_fee_extended: 75,
  travel_fee_by_zone: {
    local: 35,
    extended: 75
  },
  overhead_flat_fee: 30,
  overhead_per_guest: 4,
  packaging_misc_by_dining_style: {
    'coastal-brunch-table': 16,
    'pnw-family-table': 20,
    'seasonal-tasting-menu': 24
  },
  contingency_percent: 0.08,
  default_markup_strategy: 'cost-plus-minimum-floor',
  markup_multiplier_by_complexity: {
    simple: 1.85,
    standard: 2,
    elevated: 2.15,
    luxury: 2.3
  },
  luxury_tier_markup_multiplier: 1.08,
  minimum_booking_floor: 325,
  per_person_floor: 65,
  flat_event_base_fee: 45,
  optional_addition_labor_adjustments: {
    'artisan-bread-service': 0.15,
    'cultured-butter-and-sea-salt': 0.05,
    'cheese-course': 0.35,
    'seasonal-salad': 0.25,
    'appetizer-board': 0.75,
    'soup-course': 0.5,
    'extra-vegetable-side': 0.25,
    'oyster-add-on': 1,
    'wine-pairing-notes': 0.15,
    'brunch-pastry-basket': 0.5,
    'local-jam-and-bread-board': 0.25,
    'northwest-cheese-board': 0.5
  },
  dessert_labor_adjustments: {
    'seasonal-fruit-with-whipped-mascarpone': 0.1,
    'apple-crisp': 0.35,
    'berry-shortcake': 0.35,
    'creme-brulee': 0.4,
    'hazelnut-chocolate-tart': 0.45,
    'pear-almond-tart': 0.4,
    'poached-pears-with-spiced-syrup': 0.35
  },
  holiday_or_peak_adjustments: {
    enabled: false,
    multiplier: 1.15,
    note: 'Reserved for future holiday, peak-season, or high-demand date surcharges.'
  },
  dining_style_complexity_adjustments: {
    'romantic-peninsula-dinner': { prep_hours: 0.4, service_hours: 0.35, complexity_bump: 1 },
    'pnw-family-table': { service_hours: -0.2, shopping_admin_hours: 0.2 },
    'seasonal-tasting-menu': { prep_hours: 0.75, service_hours: 0.5, shopping_admin_hours: 0.3, complexity_bump: 1 },
    'coastal-brunch-table': { prep_hours: 0.2, service_hours: 0.15 },
    'wellness-from-the-northwest': { shopping_admin_hours: 0.15 }
  },
  complexity_keywords: {
    elevated: ['salmon', 'halibut', 'crab', 'risotto', 'mushroom', 'tart', 'panna cotta', 'beurre blanc', 'jus'],
    luxury: ['oyster', 'tasting', 'short rib', 'crab cakes', 'brulee', 'crostini', 'plated', 'seafood']
  },
  pricing_tier_thresholds: [
    { max_total: 425, tier: 'intimate', public_estimate_label: 'Starting at' },
    { max_total: 850, tier: 'signature', public_estimate_label: 'Estimated Investment' },
    { max_total: 1400, tier: 'elevated', public_estimate_label: 'Signature Experience' },
    { max_total: Number.POSITIVE_INFINITY, tier: 'celebration', public_estimate_label: 'Celebration Estimate' }
  ],
  notes: [
    'Internal-only business pricing assumptions. Do not expose rates, formulas, or raw menu costs publicly.',
    'Tune hourly rate, floors, and markup multipliers as real booking data matures.',
    'Travel defaults currently support local and extended zones for Olympic Peninsula service planning.'
  ]
};

export const PRIVATE_PRICING_RULES_NOTE =
  'Internal pricing assumptions only. Keep unpublished and do not render formulas, rates, or raw internal totals on public-facing routes.';
