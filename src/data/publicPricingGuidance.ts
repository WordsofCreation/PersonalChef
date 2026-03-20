import type { MenuBuilderState } from '../utils/menuBuilderClient';

export type PublicPricingTier = 'intimate' | 'signature' | 'elevated' | 'celebration';
export type PublicEstimateDisplayMode = 'starting-at' | 'range' | 'custom-proposal';

export type PublicPricingGuidance = {
  isVisible: boolean;
  estimateQuality: 'ready' | 'limited' | 'custom-proposal';
  heading: string;
  tierLabel: string;
  tierDescriptor: string;
  displayMode: PublicEstimateDisplayMode;
  estimateLabel: string;
  rangeLow: number | null;
  rangeHigh: number | null;
  startingAtPerPerson: number | null;
  summary: string;
  supportingText: string;
  disclaimer: string;
};

type PublicPricingProfile = {
  tier: PublicPricingTier;
  tierLabel: string;
  tierDescriptor: string;
  heading: string;
  rangeLabel: string;
  perPersonLabel: string;
  baseGuestMinimum: number;
  rangePerGuest: [number, number];
  tierFloor: number;
};

const guestCountOrNull = (guestCount?: number | null) => {
  if (typeof guestCount !== 'number' || !Number.isFinite(guestCount) || guestCount <= 0) return null;
  return Math.round(guestCount);
};

const roundToNearestTwentyFive = (value: number, direction: 'down' | 'up') => {
  if (direction === 'down') return Math.floor(value / 25) * 25;
  return Math.ceil(value / 25) * 25;
};

const hasCoreMenuSelections = (state: MenuBuilderState) =>
  Boolean(state.diningStyle && state.mainCourseCategory && state.mainCourseSelection);

const getComplexityScore = (state: MenuBuilderState) => {
  let score = 0;

  if (state.starter) score += 1;
  if (state.sauce) score += 1;
  if (state.dessert) score += 1;
  if (state.optionalAdditions.length >= 1) score += 1;
  if (state.optionalAdditions.length >= 2) score += 1;
  if (state.vegetableSelections.length >= 2) score += 1;

  const premiumSignals = [
    state.mainCourseSelection,
    state.sauce,
    state.dessert,
    ...state.optionalAdditions,
    ...state.vegetableSelections
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/(oyster|crab|halibut|salmon|short-rib|risotto|beurre|veloute|jus|brulee|tart)/.test(premiumSignals)) {
    score += 1;
  }

  if (state.diningStyle === 'seasonal-tasting-menu') score += 2;
  if (state.diningStyle === 'romantic-peninsula-dinner') score += 1;
  if (state.diningStyle === 'harvest-celebration-dinner') score += 1;

  return score;
};

const profilesByTier: Record<PublicPricingTier, PublicPricingProfile> = {
  intimate: {
    tier: 'intimate',
    tierLabel: 'Intimate Dinner',
    tierDescriptor: 'A refined starting point for smaller private-chef gatherings.',
    heading: 'Estimated Investment',
    rangeLabel: 'Estimated Investment',
    perPersonLabel: 'Menus of this style typically begin at',
    baseGuestMinimum: 2,
    rangePerGuest: [85, 115],
    tierFloor: 325
  },
  signature: {
    tier: 'signature',
    tierLabel: 'Signature Dinner',
    tierDescriptor: 'Balanced, polished menu planning for a composed hosted meal.',
    heading: 'Planning Range',
    rangeLabel: 'Estimated Investment',
    perPersonLabel: 'Menus of this style typically begin at',
    baseGuestMinimum: 2,
    rangePerGuest: [105, 145],
    tierFloor: 425
  },
  elevated: {
    tier: 'elevated',
    tierLabel: 'Elevated Dinner',
    tierDescriptor: 'A more layered menu style with premium sourcing and finishing details.',
    heading: 'Sample Pricing Guidance',
    rangeLabel: 'Estimated Investment',
    perPersonLabel: 'Elevated menus of this style often begin at',
    baseGuestMinimum: 2,
    rangePerGuest: [135, 185],
    tierFloor: 625
  },
  celebration: {
    tier: 'celebration',
    tierLabel: 'Celebration Experience',
    tierDescriptor: 'Tailored event-style service best finalized through a custom proposal.',
    heading: 'Menu Planning Estimate',
    rangeLabel: 'Planning Range',
    perPersonLabel: 'Celebration-style menus often begin at',
    baseGuestMinimum: 4,
    rangePerGuest: [165, 225],
    tierFloor: 900
  }
};

const tierOverridesByDiningStyle: Partial<Record<MenuBuilderState['diningStyle'], PublicPricingTier>> = {
  'pnw-family-table': 'intimate',
  'coastal-brunch-table': 'intimate',
  'olympic-coast-dinner': 'signature',
  'forest-and-field-supper': 'signature',
  'wellness-from-the-northwest': 'signature',
  'romantic-peninsula-dinner': 'elevated',
  'harvest-celebration-dinner': 'elevated',
  'seasonal-tasting-menu': 'celebration'
};

const getTierFromState = (state: MenuBuilderState): PublicPricingTier => {
  const baseTier = tierOverridesByDiningStyle[state.diningStyle];
  const complexityScore = getComplexityScore(state);

  if (!baseTier) {
    if (complexityScore >= 5) return 'celebration';
    if (complexityScore >= 3) return 'elevated';
    if (complexityScore >= 1) return 'signature';
    return 'intimate';
  }

  if (baseTier === 'intimate' && complexityScore >= 4) return 'signature';
  if (baseTier === 'signature' && complexityScore >= 4) return 'elevated';
  if (baseTier === 'elevated' && complexityScore >= 6) return 'celebration';
  return baseTier;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);

export const PUBLIC_PRICING_SAFE_FIELDS = [
  'tierLabel',
  'tierDescriptor',
  'estimateLabel',
  'rangeLow',
  'rangeHigh',
  'startingAtPerPerson',
  'summary',
  'supportingText',
  'disclaimer'
] as const;

export const PUBLIC_PRICING_PRIVATE_FIELDS = [
  'estimated_total_food_cost',
  'estimated_cost_per_person',
  'estimated_labor_cost',
  'estimated_shopping_admin_cost',
  'estimated_travel_cost',
  'estimated_overhead_cost',
  'estimated_internal_total_cost',
  'suggested_client_price',
  'pricing_notes',
  'tier_notes'
] as const;

export const PUBLIC_PRICING_DISCLAIMER =
  'This planning estimate is intended as a helpful guide. Final proposals are tailored to guest count, seasonal sourcing, service style, and event details.';

export const PUBLIC_PRICING_FALLBACK_MESSAGE =
  'A custom proposal will be provided after review of your menu selections and event details.';

export const createPublicPricingGuidance = (
  state: MenuBuilderState,
  options: {
    guestCount?: number | null;
  } = {}
): PublicPricingGuidance => {
  if (!hasCoreMenuSelections(state)) {
    return {
      isVisible: false,
      estimateQuality: 'limited',
      heading: 'Menu Planning Estimate',
      tierLabel: '',
      tierDescriptor: '',
      displayMode: 'custom-proposal',
      estimateLabel: 'Custom Proposal',
      rangeLow: null,
      rangeHigh: null,
      startingAtPerPerson: null,
      summary: '',
      supportingText: '',
      disclaimer: PUBLIC_PRICING_DISCLAIMER
    };
  }

  const tier = getTierFromState(state);
  const profile = profilesByTier[tier];
  const guestCount = guestCountOrNull(options.guestCount);
  const effectiveGuestCount = Math.max(profile.baseGuestMinimum, guestCount || profile.baseGuestMinimum);
  const [lowPerGuest, highPerGuest] = profile.rangePerGuest;
  const calculatedLow = Math.max(profile.tierFloor, roundToNearestTwentyFive(lowPerGuest * effectiveGuestCount, 'down'));
  const calculatedHigh = Math.max(calculatedLow + 50, roundToNearestTwentyFive(highPerGuest * effectiveGuestCount, 'up'));
  const startingAtPerPerson = roundToNearestTwentyFive(lowPerGuest, 'up');

  if (tier === 'celebration' && !guestCount) {
    return {
      isVisible: true,
      estimateQuality: 'custom-proposal',
      heading: profile.heading,
      tierLabel: profile.tierLabel,
      tierDescriptor: profile.tierDescriptor,
      displayMode: 'custom-proposal',
      estimateLabel: 'Custom Proposal',
      rangeLow: null,
      rangeHigh: null,
      startingAtPerPerson,
      summary: `${profile.tierLabel} | ${PUBLIC_PRICING_FALLBACK_MESSAGE}`,
      supportingText:
        'For more layered tasting or celebration-style menus, we confirm the final investment after guest count, sourcing priorities, and service details are reviewed.',
      disclaimer: PUBLIC_PRICING_DISCLAIMER
    };
  }

  const summary = guestCount
    ? `${profile.tierLabel} | ${profile.rangeLabel}: ${formatCurrency(calculatedLow)}–${formatCurrency(calculatedHigh)}`
    : `${profile.tierLabel} | ${profile.perPersonLabel} ${formatCurrency(startingAtPerPerson)} per guest`;

  const supportingText = guestCount
    ? 'Your selected menu points to a polished planning range that can be refined once service details and seasonal sourcing are confirmed.'
    : 'A guest-count range can be refined during your inquiry. For now, this gives a graceful starting point for menus with a similar pacing and finish.';

  return {
    isVisible: true,
    estimateQuality: guestCount ? 'ready' : 'limited',
    heading: profile.heading,
    tierLabel: profile.tierLabel,
    tierDescriptor: profile.tierDescriptor,
    displayMode: guestCount ? 'range' : 'starting-at',
    estimateLabel: guestCount ? profile.rangeLabel : profile.perPersonLabel,
    rangeLow: guestCount ? calculatedLow : null,
    rangeHigh: guestCount ? calculatedHigh : null,
    startingAtPerPerson,
    summary,
    supportingText,
    disclaimer: PUBLIC_PRICING_DISCLAIMER
  };
};
