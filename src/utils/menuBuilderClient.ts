import type { BuilderOption, BuilderSection, MainCourseCollection } from '../data/menuBuilder';

export type MenuBuilderState = {
  diningStyle: string;
  starter: string;
  mainCourseCategory: string;
  mainCourseSelection: string;
  sauce: string;
  starch: string;
  vegetable: string;
  optionalAdditions: string[];
  dessert: string;
  customConsiderations: string;
};

export type MenuBuilderClientData = {
  sections: BuilderSection[];
  mainCourseOptions: MainCourseCollection;
  summaryOrder: readonly string[];
  emptySummaryCopy: {
    title: string;
    description: string;
  };
};

export const MENU_BUILDER_STORAGE_KEY = 'personalChef.sampleMenuBuilder';
export const MENU_REQUEST_STORAGE_KEY = 'personalChef.sampleMenuRequest';

export const previewSectionOrder = [
  'diningStyle',
  'starter',
  'mainCourseCategory',
  'mainCourseSelection',
  'sauce',
  'starch',
  'vegetable',
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
  starch: 'Starch / Grain',
  vegetable: 'Vegetable Accompaniment',
  optionalAdditions: 'Optional Additions',
  dessert: 'Dessert',
  customConsiderations: 'Custom Considerations'
};

export const previewLabels = {
  starter: 'Starter',
  mainCourseCategory: 'Main Course Category',
  mainCourseSelection: 'Main Course',
  sauce: 'Finished With',
  starch: 'Starch / Grain',
  vegetable: 'Vegetable Accompaniment',
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
  starch: '',
  vegetable: '',
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

    return {
      ...createEmptyMenuBuilderState(),
      ...parsed,
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
  payload: Record<string, unknown>,
  storage: Storage | undefined = globalThis.sessionStorage
) => {
  if (!storage) return;
  storage.setItem(MENU_REQUEST_STORAGE_KEY, JSON.stringify(payload));
};

export const readMenuRequestPayload = (storage: Storage | undefined = globalThis.sessionStorage) => {
  if (!storage) return null;

  try {
    const raw = storage.getItem(MENU_REQUEST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getOptionLabel = (
  data: MenuBuilderClientData,
  state: MenuBuilderState,
  sectionId: string,
  value: string
) => {
  if (!value) return '';

  if (sectionId === 'mainCourseSelection') {
    const categoryOptions = data.mainCourseOptions[state.mainCourseCategory] || [];
    return categoryOptions.find((option) => option.value === value)?.label || '';
  }

  const sectionMap = getSectionMap(data.sections);
  const option = sectionMap[sectionId]?.options?.find((item) => item.value === value);
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
  } else {
    option = getSectionMap(data.sections)[sectionId]?.options?.find((item) => item.value === value);
  }

  return option?.description || '';
};

export const getComposedMenuPreview = (data: MenuBuilderClientData, state: MenuBuilderState) => {
  const diningStyle = getOptionLabel(data, state, 'diningStyle', state.diningStyle);
  const starter = getOptionLabel(data, state, 'starter', state.starter);
  const mainCourseCategory = getOptionLabel(data, state, 'mainCourseCategory', state.mainCourseCategory);
  const mainCourse = getOptionLabel(data, state, 'mainCourseSelection', state.mainCourseSelection);
  const sauce = getOptionLabel(data, state, 'sauce', state.sauce);
  const starch = getOptionLabel(data, state, 'starch', state.starch);
  const vegetable = getOptionLabel(data, state, 'vegetable', state.vegetable);
  const dessert = getOptionLabel(data, state, 'dessert', state.dessert);
  const additions = state.optionalAdditions
    .map((value) => getOptionLabel(data, state, 'optionalAdditions', value))
    .filter(Boolean);

  const servedWith = [starch, vegetable].filter(Boolean);

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
          label: 'Served Alongside',
          value: joinWithAnd(servedWith)
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
      starch,
      vegetable,
      additions,
      dessert,
      customConsiderations: state.customConsiderations.trim()
    }
  };
};

export const joinWithAnd = (items: string[]) => {
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
};

export const buildMenuRequestMessage = (data: MenuBuilderClientData, state: MenuBuilderState) => {
  const preview = getComposedMenuPreview(data, state);
  const lines = [
    'Sample Menu Builder selections:',
    preview.details.diningStyle ? `Dining Style: ${preview.details.diningStyle}` : '',
    preview.details.starter ? `Starter: ${preview.details.starter}` : '',
    preview.details.mainCourseCategory ? `Main Course Category: ${preview.details.mainCourseCategory}` : '',
    preview.details.mainCourse ? `Main Course Selection: ${preview.details.mainCourse}` : '',
    preview.details.sauce ? `Sauce: ${preview.details.sauce}` : '',
    preview.details.starch ? `Starch / Grain: ${preview.details.starch}` : '',
    preview.details.vegetable ? `Vegetable Accompaniment(s): ${preview.details.vegetable}` : '',
    preview.details.additions.length ? `Optional Additions: ${joinWithAnd(preview.details.additions)}` : '',
    preview.details.dessert ? `Dessert: ${preview.details.dessert}` : '',
    preview.details.customConsiderations ? `Custom Considerations: ${preview.details.customConsiderations}` : ''
  ].filter(Boolean);

  return lines.join('\n');
};
