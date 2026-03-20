import privateRecipeCosting from '../generated/private-recipe-costing.json';
import menuBuilderMappings from '../content/menuBuilderMappings/current-builder.json';
import {
  menuBuilderSections,
  starchOptionsByCategory,
  vegetableOptionsByCategory,
  type BuilderCategoryCollection,
  type BuilderOption,
  type BuilderSection,
  type MainCourseCollection,
  mainCourseOptions
} from './menuBuilder';
import type { MenuBuilderState } from '../utils/menuBuilderClient';

const roundCurrency = (value: number) => Number(value.toFixed(2));

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const singleValueSections = [
  'diningStyle',
  'starter',
  'mainCourseCategory',
  'mainCourseSelection',
  'sauce',
  'starchCategory',
  'starchSelection',
  'vegetableCategory',
  'dessert'
] as const;

type SingleValueSection = (typeof singleValueSections)[number];
type MultiValueSection = 'vegetableSelection' | 'optionalAdditions';
type EstimateStatus = 'placeholder' | 'partial' | 'estimated' | 'verified';

type PrivateRecipeCostingRecord = (typeof privateRecipeCosting.recipes)[number];

type BuilderSelectionState = Partial<MenuBuilderState> & {
  guestCount?: number | null;
};

export type PrivateMenuEstimateSelectionInput = BuilderSelectionState;

export type PrivateMenuEstimateMissingInput = {
  section: SingleValueSection | MultiValueSection;
  builderValue: string;
  recipeId: string | null;
  reason: string;
};

export type PrivateMenuEstimateComponent = {
  section: SingleValueSection | MultiValueSection;
  builderValue: string;
  builderLabel: string;
  recipeIds: string[];
  recipeNames: string[];
  costingStatuses: string[];
  estimatedCostPerPerson: number;
  notes: string[];
};

export type PrivateMenuEstimateSummary = {
  title: string;
  lines: string[];
  estimateStatus: EstimateStatus;
  internalCostVisibility: 'private';
};

export type PrivateMenuEstimate = {
  menu_estimate_id: string;
  selected_builder_items: {
    diningStyle: string | null;
    starter: string | null;
    mainCourseCategory: string | null;
    mainCourseSelection: string | null;
    sauce: string | null;
    starchCategory: string | null;
    starchSelection: string | null;
    vegetableCategory: string | null;
    vegetableSelections: string[];
    optionalAdditions: string[];
    dessert: string | null;
    guestCount: number | null;
  };
  linked_recipe_ids: string[];
  component_estimates: PrivateMenuEstimateComponent[];
  estimated_total_food_cost: number;
  estimated_cost_per_person: number;
  estimate_status: EstimateStatus;
  estimate_notes: string[];
  missing_cost_inputs: PrivateMenuEstimateMissingInput[];
  generated_summary: PrivateMenuEstimateSummary;
  future_pricing_inputs: {
    labor_assumptions_ready: boolean;
    shopping_overhead_ready: boolean;
    travel_fee_ready: boolean;
    service_fee_ready: boolean;
    margin_ready: boolean;
    public_pricing_tier_ready: boolean;
  };
};

export const PRIVATE_MENU_ESTIMATE_NOTE =
  'Internal menu food-cost rollups only. Do not expose raw menu, recipe, or ingredient cost values on public-facing routes.';

const recipeCostingById = new Map(privateRecipeCosting.recipes.map((recipe) => [recipe.id, recipe]));

const builderSectionMap = Object.fromEntries(menuBuilderSections.map((section) => [section.id, section])) as Record<
  BuilderSection['id'],
  BuilderSection
>;

const getCollectionOption = (
  collection: BuilderCategoryCollection | MainCourseCollection,
  categoryValue: string | undefined,
  value: string | undefined
) => {
  if (!categoryValue || !value) return undefined;
  return (collection[categoryValue] || []).find((option) => option.value === value);
};

const getSingleSectionOption = (sectionId: BuilderSection['id'], value: string | undefined) => {
  if (!value) return undefined;
  return builderSectionMap[sectionId]?.options?.find((option) => option.value === value);
};

const getBuilderLabel = (section: SingleValueSection | MultiValueSection, selection: BuilderSelectionState, value: string) => {
  const sectionId = section as BuilderSection['id'];

  if (section === 'mainCourseSelection') {
    return getCollectionOption(mainCourseOptions, selection.mainCourseCategory, value)?.label || value;
  }

  if (section === 'starchSelection') {
    return getCollectionOption(starchOptionsByCategory, selection.starchCategory, value)?.label || value;
  }

  if (section === 'vegetableSelection') {
    return getCollectionOption(vegetableOptionsByCategory, selection.vegetableCategory, value)?.label || value;
  }

  return getSingleSectionOption(sectionId, value)?.label || value;
};

const getMappedRecipeIds = (section: SingleValueSection | MultiValueSection, builderValue: string) => {
  const sectionMappings = menuBuilderMappings.sections[section] as Record<string, string | string[]> | undefined;
  const rawMatch = sectionMappings?.[builderValue];
  if (!rawMatch) return [];
  return Array.isArray(rawMatch) ? rawMatch : [rawMatch];
};

const buildEstimateId = (selection: BuilderSelectionState) => {
  const idBase = [
    selection.diningStyle,
    selection.starter,
    selection.mainCourseSelection,
    selection.sauce,
    selection.starchSelection,
    ...(selection.vegetableSelections || []),
    ...(selection.optionalAdditions || []),
    selection.dessert,
    selection.guestCount ? `guests-${selection.guestCount}` : 'guest-count-open'
  ]
    .filter(Boolean)
    .join('-');

  return `menu-estimate-${slugify(idBase || 'empty-selection')}`;
};

const summarizeComponentNotes = (recipe: PrivateRecipeCostingRecord) => {
  const notes = [recipe.costing_status !== 'estimated' ? `Recipe status: ${recipe.costing_status}.` : ''];
  if (recipe.costing_notes?.length) {
    notes.push(...recipe.costing_notes.map((note) => `Recipe note: ${note}`));
  }
  return notes.filter(Boolean);
};

const getEstimateStatus = (records: PrivateRecipeCostingRecord[], missing: PrivateMenuEstimateMissingInput[]): EstimateStatus => {
  if (!records.length && !missing.length) return 'placeholder';
  if (missing.length > 0 || records.some((record) => record.costing_status === 'incomplete')) return 'partial';
  if (records.length > 0 && records.every((record) => record.costing_status === 'placeholder')) return 'placeholder';
  if (records.length > 0 && records.every((record) => record.costing_status === 'verified')) return 'verified';
  return 'estimated';
};

const getSelectionSnapshot = (selection: BuilderSelectionState) => ({
  diningStyle: selection.diningStyle ? getBuilderLabel('diningStyle', selection, selection.diningStyle) : null,
  starter: selection.starter ? getBuilderLabel('starter', selection, selection.starter) : null,
  mainCourseCategory: selection.mainCourseCategory
    ? getBuilderLabel('mainCourseCategory', selection, selection.mainCourseCategory)
    : null,
  mainCourseSelection: selection.mainCourseSelection
    ? getBuilderLabel('mainCourseSelection', selection, selection.mainCourseSelection)
    : null,
  sauce: selection.sauce ? getBuilderLabel('sauce', selection, selection.sauce) : null,
  starchCategory: selection.starchCategory ? getBuilderLabel('starchCategory', selection, selection.starchCategory) : null,
  starchSelection: selection.starchSelection ? getBuilderLabel('starchSelection', selection, selection.starchSelection) : null,
  vegetableCategory: selection.vegetableCategory
    ? getBuilderLabel('vegetableCategory', selection, selection.vegetableCategory)
    : null,
  vegetableSelections: (selection.vegetableSelections || []).map((value) => getBuilderLabel('vegetableSelection', selection, value)),
  optionalAdditions: (selection.optionalAdditions || []).map((value) => getBuilderLabel('optionalAdditions', selection, value)),
  dessert: selection.dessert ? getBuilderLabel('dessert', selection, selection.dessert) : null,
  guestCount: selection.guestCount ?? null
});

const buildSummaryLines = (
  snapshot: ReturnType<typeof getSelectionSnapshot>,
  estimatedCostPerPerson: number,
  estimateStatus: EstimateStatus,
  notes: string[]
) => {
  const servedWith = [snapshot.starchSelection, ...snapshot.vegetableSelections].filter(Boolean);

  return [
    snapshot.diningStyle ? `Dining Style: ${snapshot.diningStyle}` : '',
    snapshot.starter ? `Starter: ${snapshot.starter}` : '',
    snapshot.mainCourseSelection ? `Main: ${snapshot.mainCourseSelection}` : '',
    snapshot.sauce ? `Sauce: ${snapshot.sauce}` : '',
    servedWith.length ? `Served With: ${servedWith.join('; ')}` : '',
    snapshot.optionalAdditions.length ? `Optional Additions: ${snapshot.optionalAdditions.join('; ')}` : '',
    snapshot.dessert ? `Dessert: ${snapshot.dessert}` : '',
    `Estimated Food Cost: internal only (${estimatedCostPerPerson > 0 ? 'rollup available' : 'pending inputs'})`,
    `Estimate Status: ${estimateStatus[0].toUpperCase()}${estimateStatus.slice(1)}`,
    snapshot.guestCount ? `Guest Count Basis: ${snapshot.guestCount}` : 'Guest Count Basis: per-person baseline only',
    notes.length ? `Internal Notes: ${notes.join(' | ')}` : ''
  ].filter(Boolean);
};

export const createPrivateMenuEstimate = (selection: PrivateMenuEstimateSelectionInput): PrivateMenuEstimate => {
  const normalizedSelection: BuilderSelectionState = {
    ...selection,
    vegetableSelections: (selection.vegetableSelections || []).filter(Boolean),
    optionalAdditions: (selection.optionalAdditions || []).filter(Boolean),
    guestCount:
      typeof selection.guestCount === 'number' && Number.isFinite(selection.guestCount) && selection.guestCount > 0
        ? Math.round(selection.guestCount)
        : null
  };

  const componentDefinitions: Array<{ section: SingleValueSection | MultiValueSection; values: string[] }> = [
    { section: 'diningStyle', values: normalizedSelection.diningStyle ? [normalizedSelection.diningStyle] : [] },
    { section: 'starter', values: normalizedSelection.starter ? [normalizedSelection.starter] : [] },
    {
      section: 'mainCourseSelection',
      values: normalizedSelection.mainCourseSelection ? [normalizedSelection.mainCourseSelection] : []
    },
    { section: 'sauce', values: normalizedSelection.sauce ? [normalizedSelection.sauce] : [] },
    { section: 'starchSelection', values: normalizedSelection.starchSelection ? [normalizedSelection.starchSelection] : [] },
    { section: 'vegetableSelection', values: normalizedSelection.vegetableSelections || [] },
    { section: 'optionalAdditions', values: normalizedSelection.optionalAdditions || [] },
    { section: 'dessert', values: normalizedSelection.dessert ? [normalizedSelection.dessert] : [] }
  ];

  const missingCostInputs: PrivateMenuEstimateMissingInput[] = [];
  const componentEstimates: PrivateMenuEstimateComponent[] = [];

  for (const definition of componentDefinitions) {
    for (const builderValue of definition.values) {
      const recipeIds = getMappedRecipeIds(definition.section, builderValue);
      const records = recipeIds
        .map((recipeId) => recipeCostingById.get(recipeId))
        .filter((record): record is PrivateRecipeCostingRecord => Boolean(record));

      if (!recipeIds.length) {
        missingCostInputs.push({
          section: definition.section,
          builderValue,
          recipeId: null,
          reason: 'No private recipe mapping found for the current builder value.'
        });
      }

      for (const recipeId of recipeIds) {
        if (!recipeCostingById.has(recipeId)) {
          missingCostInputs.push({
            section: definition.section,
            builderValue,
            recipeId,
            reason: 'Mapped private recipe costing record is missing from the Phase 2 output.'
          });
        }
      }

      for (const record of records.filter((item) => item.costing_status === 'incomplete')) {
        missingCostInputs.push({
          section: definition.section,
          builderValue,
          recipeId: record.id,
          reason: 'Recipe costing is incomplete and should be verified before using this estimate operationally.'
        });
      }

      componentEstimates.push({
        section: definition.section,
        builderValue,
        builderLabel: getBuilderLabel(definition.section, normalizedSelection, builderValue),
        recipeIds,
        recipeNames: records.map((record) => record.name),
        costingStatuses: records.map((record) => record.costing_status),
        estimatedCostPerPerson: roundCurrency(
          records.reduce((total, record) => total + (record.estimated_cost_per_portion || 0), 0)
        ),
        notes: records.flatMap(summarizeComponentNotes)
      });
    }
  }

  const resolvedRecords = componentEstimates.flatMap((component) =>
    component.recipeIds
      .map((recipeId) => recipeCostingById.get(recipeId))
      .filter((record): record is PrivateRecipeCostingRecord => Boolean(record))
  );

  const estimatedCostPerPerson = roundCurrency(
    resolvedRecords.reduce((total, record) => total + (record.estimated_cost_per_portion || 0), 0)
  );
  const guestCount = normalizedSelection.guestCount;
  const estimatedTotalFoodCost = roundCurrency(estimatedCostPerPerson * (guestCount || 1));
  const estimateStatus = getEstimateStatus(resolvedRecords, missingCostInputs);

  const estimateNotes = [
    guestCount
      ? `Total food cost scales from a per-person baseline using guest count ${guestCount}.`
      : 'No guest count provided; total food cost currently reflects a single per-person menu composition baseline.',
    componentEstimates.some((component) => component.section === 'vegetableSelection' && component.recipeIds.length > 1)
      ? 'One or more vegetable builder selections map to multiple private recipe records.'
      : '',
    normalizedSelection.vegetableSelections && normalizedSelection.vegetableSelections.length > 1
      ? `Vegetable rollup includes ${normalizedSelection.vegetableSelections.length} selected vegetables.`
      : '',
    normalizedSelection.optionalAdditions && normalizedSelection.optionalAdditions.length > 0
      ? `Optional additions rollup includes ${normalizedSelection.optionalAdditions.length} add-on selection(s).`
      : '',
    missingCostInputs.length > 0
      ? `Verification needed for ${missingCostInputs.map((item) => `${item.section}:${item.builderValue}`).join(', ')}.`
      : 'All mapped components currently resolve to usable private recipe costing records.',
    'Future pricing layers can add labor, shopping, travel, service, and margin logic on top of this food-cost baseline without changing builder mappings.'
  ].filter(Boolean);

  const selectedBuilderItems = getSelectionSnapshot(normalizedSelection);
  const linkedRecipeIds = [...new Set(componentEstimates.flatMap((component) => component.recipeIds))];

  return {
    menu_estimate_id: buildEstimateId(normalizedSelection),
    selected_builder_items: selectedBuilderItems,
    linked_recipe_ids: linkedRecipeIds,
    component_estimates: componentEstimates,
    estimated_total_food_cost: estimatedTotalFoodCost,
    estimated_cost_per_person: estimatedCostPerPerson,
    estimate_status: estimateStatus,
    estimate_notes: estimateNotes,
    missing_cost_inputs: missingCostInputs,
    generated_summary: {
      title: selectedBuilderItems.diningStyle || 'Composed Menu Estimate',
      lines: buildSummaryLines(selectedBuilderItems, estimatedCostPerPerson, estimateStatus, estimateNotes),
      estimateStatus,
      internalCostVisibility: 'private'
    },
    future_pricing_inputs: {
      labor_assumptions_ready: true,
      shopping_overhead_ready: true,
      travel_fee_ready: true,
      service_fee_ready: true,
      margin_ready: true,
      public_pricing_tier_ready: true
    }
  };
};

export const privateMenuEstimateFixtures = [
  {
    id: 'fixture-cedar-plank-salmon',
    label: 'Cedar-Plank Salmon + Beurre Blanc + Wild Rice Pilaf + Asparagus + Lemon Tart',
    selection: {
      diningStyle: 'romantic-peninsula-dinner',
      starter: 'wild-mushroom-tartlet',
      mainCourseCategory: 'pnw-seafood',
      mainCourseSelection: 'cedar-plank-salmon',
      sauce: 'beurre-blanc',
      starchCategory: 'rice-and-grain-sides',
      starchSelection: 'wild-rice-pilaf',
      vegetableCategory: 'green-vegetables',
      vegetableSelections: ['asparagus-with-lemon-and-herbs'],
      optionalAdditions: [],
      dessert: 'lemon-tart',
      guestCount: 2
    } satisfies PrivateMenuEstimateSelectionInput
  },
  {
    id: 'fixture-braised-beef-short-rib',
    label: 'Braised Beef Short Rib + Pinot Noir Jus + Pommes Purée + Glazed Carrots + Chocolate Pot de Crème',
    selection: {
      diningStyle: 'harvest-celebration-dinner',
      starter: 'caramelized-onion-and-gruyere-tart',
      mainCourseCategory: 'braised-and-roasted-meats',
      mainCourseSelection: 'braised-beef-short-rib',
      sauce: 'pinot-noir-jus',
      starchCategory: 'potato-preparations',
      starchSelection: 'pommes-puree',
      vegetableCategory: 'root-and-orchard-vegetables',
      vegetableSelections: ['glazed-carrots'],
      optionalAdditions: [],
      dessert: 'chocolate-pot-de-creme',
      guestCount: 4
    } satisfies PrivateMenuEstimateSelectionInput
  },
  {
    id: 'fixture-wild-mushroom-risotto',
    label: 'Wild Mushroom Risotto + Wild Mushroom Velouté + Seasonal Vegetables + Vanilla Bean Panna Cotta',
    selection: {
      diningStyle: 'forest-and-field-supper',
      starter: 'woodland-mushroom-toast-with-herbs',
      mainCourseCategory: 'vegetarian-from-the-garden',
      mainCourseSelection: 'wild-mushroom-risotto',
      sauce: 'wild-mushroom-veloute',
      starchCategory: 'seasonal-rustic-sides',
      starchSelection: 'woodland-mushroom-grain-pilaf',
      vegetableCategory: 'seasonal-market-sides',
      vegetableSelections: ['seasonal-market-vegetables'],
      optionalAdditions: [],
      dessert: 'vanilla-bean-panna-cotta',
      guestCount: 4
    } satisfies PrivateMenuEstimateSelectionInput
  }
] as const;

export const getPrivateMenuEstimateFixtures = () =>
  privateMenuEstimateFixtures.map((fixture) => ({
    ...fixture,
    estimate: createPrivateMenuEstimate(fixture.selection)
  }));
