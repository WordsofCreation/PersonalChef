import type {
  BuilderCategoryCollection,
  BuilderOption,
  BuilderSection,
  MainCourseCollection
} from '../data/menuBuilder';

export type MenuBuilderState = {
  diningStyle: string;
  starter: string;
  mainCourseCategory: string;
  mainCourseSelection: string;
  sauce: string;
  starchCategory: string;
  starchSelection: string;
  vegetableCategory: string;
  vegetableSelections: string[];
  optionalAdditions: string[];
  dessert: string;
  customConsiderations: string;
};

export type MenuBuilderClientData = {
  sections: BuilderSection[];
  mainCourseOptions: MainCourseCollection;
  starchOptionsByCategory: BuilderCategoryCollection;
  vegetableOptionsByCategory: BuilderCategoryCollection;
  summaryOrder: readonly string[];
  emptySummaryCopy: {
    title: string;
    description: string;
  };
};

export type MenuRequestDetails = {
  diningStyle: string;
  starter: string;
  mainCourseCategory: string;
  mainCourse: string;
  sauce: string;
  starchCategory: string;
  starchSelection: string;
  vegetableCategories: string[];
  vegetableSelections: string[];
  additions: string[];
  dessert: string;
  customConsiderations: string;
};

export type MenuRequestPayload = {
  source?: string;
  state: MenuBuilderState;
  details: MenuRequestDetails;
  summary: string;
  savedAt?: string;
};

export const MENU_BUILDER_STORAGE_KEY = 'personalChef.sampleMenuBuilder';
export const MENU_REQUEST_STORAGE_KEY = 'personalChef.sampleMenuRequest';

export const previewSectionOrder = [
  'diningStyle',
  'starter',
  'mainCourseCategory',
  'mainCourseSelection',
  'sauce',
  'starchSelection',
  'vegetableSelection',
  'optionalAdditions',
  'dessert',
  'customConsiderations'
] as const;

export const summaryLabels: Record<string, string> = {
  diningStyle: 'Dining Style',
  starter: 'Starter',
  mainCourseCategory: 'Main Course Category',
  mainCourseSelection: 'Main Course Selection',
  sauce: 'Sauce',
  starchSelection: 'Starch / Grain',
  vegetableSelection: 'Vegetables',
  optionalAdditions: 'Optional Additions',
  dessert: 'Dessert',
  customConsiderations: 'Custom Considerations'
};

export const previewLabels = {
  starter: 'Starter',
  mainCourseCategory: 'Main Course Category',
  mainCourseSelection: 'Main Course',
  sauce: 'Finished With',
  starchSelection: 'Starch / Grain',
  vegetableSelection: 'Vegetables',
  optionalAdditions: 'Optional Additions',
  dessert: 'Dessert',
  customConsiderations: 'Custom Considerations'
} satisfies Record<string, string>;

export const previewLeadByDiningStyle: Record<string, string> = {
  'olympic-coast-dinner': 'A coastal private-chef composition shaped around elegant Pacific Northwest ingredients.',
  'forest-and-field-supper': 'A woodland-inspired dinner with garden depth, warm textures, and quietly luxurious pacing.',
  'romantic-peninsula-dinner': 'An intimate plated menu designed to feel polished, soft-lit, and celebratory.',
  'pnw-family-table': 'A welcoming shared menu that balances abundance with refined private-chef polish.',
  'seasonal-tasting-menu': 'A composed progression of seasonal flavors presented with restraint and chef-driven detail.',
  'coastal-brunch-table': 'A leisurely morning-into-afternoon menu with bright finishes and relaxed hospitality.',
  'harvest-celebration-dinner': 'A celebratory autumn menu built with warmth, orchard notes, and elegant structure.',
  'wellness-from-the-northwest': 'A balanced regional menu with clean flavors, vibrant produce, and nourishing refinement.'
};

export const createEmptyMenuBuilderState = (): MenuBuilderState => ({
  diningStyle: '',
  starter: '',
  mainCourseCategory: '',
  mainCourseSelection: '',
  sauce: '',
  starchCategory: '',
  starchSelection: '',
  vegetableCategory: '',
  vegetableSelections: [],
  optionalAdditions: [],
  dessert: '',
  customConsiderations: ''
});

export const getSectionMap = (sections: BuilderSection[]) =>
  Object.fromEntries(sections.map((section) => [section.id, section]));

export const readBuilderState = (storage: Storage | undefined = globalThis.sessionStorage) => {
  if (!storage) return createEmptyMenuBuilderState();

  try {
    const raw = storage.getItem(MENU_BUILDER_STORAGE_KEY);
    if (!raw) return createEmptyMenuBuilderState();

    const parsed = JSON.parse(raw);
    const fallbackVegetableSelections = Array.isArray(parsed?.vegetableSelections)
      ? parsed.vegetableSelections.filter((value: unknown): value is string => typeof value === 'string')
      : typeof parsed?.vegetable === 'string' && parsed.vegetable
        ? [parsed.vegetable]
        : [];

    return {
      ...createEmptyMenuBuilderState(),
      ...parsed,
      starchSelection:
        typeof parsed?.starchSelection === 'string'
          ? parsed.starchSelection
          : typeof parsed?.starch === 'string'
            ? parsed.starch
            : '',
      vegetableSelections: fallbackVegetableSelections,
      optionalAdditions: Array.isArray(parsed?.optionalAdditions)
        ? parsed.optionalAdditions.filter((value: unknown): value is string => typeof value === 'string')
        : []
    } satisfies MenuBuilderState;
  } catch {
    return createEmptyMenuBuilderState();
  }
};

export const writeBuilderState = (
  state: MenuBuilderState,
  storage: Storage | undefined = globalThis.sessionStorage
) => {
  if (!storage) return;
  storage.setItem(MENU_BUILDER_STORAGE_KEY, JSON.stringify(state));
};

export const storeMenuRequestPayload = (
  payload: MenuRequestPayload,
  storage: Storage | undefined = globalThis.sessionStorage
) => {
  if (!storage) return;
  storage.setItem(MENU_REQUEST_STORAGE_KEY, JSON.stringify(payload));
};

export const clearMenuRequestPayload = (storage: Storage | undefined = globalThis.sessionStorage) => {
  if (!storage) return;
  storage.removeItem(MENU_REQUEST_STORAGE_KEY);
};

export const readMenuRequestPayload = (
  storage: Storage | undefined = globalThis.sessionStorage
): MenuRequestPayload | null => {
  if (!storage) return null;

  try {
    const raw = storage.getItem(MENU_REQUEST_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MenuRequestPayload) : null;
  } catch {
    return null;
  }
};

const getOptionFromCollection = (collection: BuilderCategoryCollection, categoryValue: string, value: string) =>
  (collection[categoryValue] || []).find((option) => option.value === value);

export const getOptionLabel = (
  data: MenuBuilderClientData,
  state: MenuBuilderState,
  sectionId: string,
  value: string
) => {
  if (!value) return '';

  if (sectionId === 'mainCourseSelection') {
    return (data.mainCourseOptions[state.mainCourseCategory] || []).find((option) => option.value === value)?.label || '';
  }

  if (sectionId === 'starchSelection') {
    return getOptionFromCollection(data.starchOptionsByCategory, state.starchCategory, value)?.label || '';
  }

  if (sectionId === 'vegetableSelection') {
    return getOptionFromCollection(data.vegetableOptionsByCategory, state.vegetableCategory, value)?.label || '';
  }

  const option = getSectionMap(data.sections)[sectionId]?.options?.find((item) => item.value === value);
  return option?.label || '';
};

export const getOptionDescription = (
  data: MenuBuilderClientData,
  state: MenuBuilderState,
  sectionId: string,
  value: string
) => {
  if (!value) return '';

  let option: BuilderOption | undefined;

  if (sectionId === 'mainCourseSelection') {
    option = (data.mainCourseOptions[state.mainCourseCategory] || []).find((item) => item.value === value);
  } else if (sectionId === 'starchSelection') {
    option = getOptionFromCollection(data.starchOptionsByCategory, state.starchCategory, value);
  } else if (sectionId === 'vegetableSelection') {
    option = getOptionFromCollection(data.vegetableOptionsByCategory, state.vegetableCategory, value);
  } else {
    option = getSectionMap(data.sections)[sectionId]?.options?.find((item) => item.value === value);
  }

  return option?.description || '';
};

export const joinWithAnd = (items: string[]) => {
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
};

export const getSelectedVegetableLabels = (data: MenuBuilderClientData, state: MenuBuilderState) =>
  state.vegetableSelections
    .map((value) => getOptionLabel(data, state, 'vegetableSelection', value))
    .filter(Boolean);

export const getComposedMenuPreview = (data: MenuBuilderClientData, state: MenuBuilderState) => {
  const diningStyle = getOptionLabel(data, state, 'diningStyle', state.diningStyle);
  const starter = getOptionLabel(data, state, 'starter', state.starter);
  const mainCourseCategory = getOptionLabel(data, state, 'mainCourseCategory', state.mainCourseCategory);
  const mainCourse = getOptionLabel(data, state, 'mainCourseSelection', state.mainCourseSelection);
  const sauce = getOptionLabel(data, state, 'sauce', state.sauce);
  const starchCategory = getOptionLabel(data, state, 'starchCategory', state.starchCategory);
  const starchSelection = getOptionLabel(data, state, 'starchSelection', state.starchSelection);
  const vegetableCategory = getOptionLabel(data, state, 'vegetableCategory', state.vegetableCategory);
  const vegetableSelections = getSelectedVegetableLabels(data, state);
  const dessert = getOptionLabel(data, state, 'dessert', state.dessert);
  const additions = state.optionalAdditions
    .map((value) => getOptionLabel(data, state, 'optionalAdditions', value))
    .filter(Boolean);

  const servedWith = [starchSelection, ...vegetableSelections].filter(Boolean);
  const accompanimentsLabel = vegetableSelections.length > 1 ? 'Accompaniments' : 'Served With';

  const composedLines = [
    starter
      ? {
          label: previewLabels.starter,
          value: starter,
          description: getOptionDescription(data, state, 'starter', state.starter)
        }
      : null,
    mainCourseCategory
      ? {
          label: previewLabels.mainCourseCategory,
          value: mainCourseCategory
        }
      : null,
    mainCourse
      ? {
          label: previewLabels.mainCourseSelection,
          value: mainCourse,
          description: getOptionDescription(data, state, 'mainCourseSelection', state.mainCourseSelection)
        }
      : null,
    sauce
      ? {
          label: previewLabels.sauce,
          value: sauce,
          description: sauce && mainCourse ? `Selected to finish the ${mainCourse.toLowerCase()}.` : ''
        }
      : null,
    servedWith.length
      ? {
          label: accompanimentsLabel,
          value: joinWithAnd(servedWith),
          description: [starchCategory, vegetableCategory].filter(Boolean).join(' · ')
        }
      : null,
    additions.length
      ? {
          label: 'Optional Additions',
          value: joinWithAnd(additions)
        }
      : null,
    dessert
      ? {
          label: previewLabels.dessert,
          value: dessert,
          description: getOptionDescription(data, state, 'dessert', state.dessert)
        }
      : null
  ].filter(Boolean);

  return {
    diningStyle,
    lead: previewLeadByDiningStyle[state.diningStyle] || 'A preview of your custom menu selections, composed in a polished private-chef format.',
    composedLines,
    details: {
      diningStyle,
      starter,
      mainCourseCategory,
      mainCourse,
      sauce,
      starchCategory,
      starchSelection,
      vegetableCategories: vegetableCategory ? [vegetableCategory] : [],
      vegetableSelections,
      additions,
      dessert,
      customConsiderations: state.customConsiderations.trim()
    } satisfies MenuRequestDetails
  };
};

export const buildMenuRequestMessage = (data: MenuBuilderClientData, state: MenuBuilderState) => {
  const preview = getComposedMenuPreview(data, state);
  const lines = [
    `Dining Style: ${preview.details.diningStyle || ''}`,
    `Starter: ${preview.details.starter || ''}`,
    `Main Course Category: ${preview.details.mainCourseCategory || ''}`,
    `Main Course Selection: ${preview.details.mainCourse || ''}`,
    `Sauce: ${preview.details.sauce || ''}`,
    `Starch Category: ${preview.details.starchCategory || ''}`,
    `Starch / Grain: ${preview.details.starchSelection || ''}`,
    `Vegetable Category: ${preview.details.vegetableCategories.length ? joinWithAnd(preview.details.vegetableCategories) : ''}`,
    `Vegetables: ${preview.details.vegetableSelections.length ? joinWithAnd(preview.details.vegetableSelections) : ''}`,
    `Optional Additions: ${preview.details.additions.length ? joinWithAnd(preview.details.additions) : ''}`,
    `Dessert: ${preview.details.dessert || ''}`,
    `Custom Considerations: ${preview.details.customConsiderations || ''}`
  ];

  return lines.join('\n');
};

export const hasMenuRequestSelections = (payload: Pick<MenuRequestPayload, 'details'> | null | undefined) => {
  if (!payload) return false;

  const details = payload.details;
  if (!details) return false;

  return Boolean(
    details.diningStyle ||
      details.starter ||
      details.mainCourseCategory ||
      details.mainCourse ||
      details.sauce ||
      details.starchCategory ||
      details.starchSelection ||
      details.vegetableCategories.length ||
      details.vegetableSelections.length ||
      details.additions.length ||
      details.dessert ||
      details.customConsiderations
  );
};

export const createMenuRequestPayload = (data: MenuBuilderClientData, state: MenuBuilderState, source = 'menu-preview'): MenuRequestPayload => {
  const preview = getComposedMenuPreview(data, state);

  return {
    source,
    state,
    details: preview.details,
    summary: buildMenuRequestMessage(data, state),
    savedAt: new Date().toISOString()
  };
};
