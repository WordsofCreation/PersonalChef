export type BuilderOption = {
  value: string;
  label: string;
  description?: string;
  note?: string;
};

export type BuilderSection = {
  id:
    | 'diningStyle'
    | 'starter'
    | 'mainCourseCategory'
    | 'mainCourseSelection'
    | 'sauce'
    | 'starch'
    | 'vegetable'
    | 'optionalAdditions'
    | 'dessert';
  title: string;
  helper: string;
  type: 'single' | 'multiple';
  options?: BuilderOption[];
};

export type MainCourseCollection = Record<string, BuilderOption[]>;

export const menuBuilderSections: BuilderSection[] = [
  {
    id: 'diningStyle',
    title: 'Dining Style',
    helper: 'Set the tone for the table so every later choice feels cohesive.',
    type: 'single',
    options: [
      {
        value: 'romantic-dinner-for-two',
        label: 'Romantic Dinner for Two',
        description: 'A quietly luxurious pacing with intimate plating and warm candlelit energy.'
      },
      {
        value: 'family-style-gathering',
        label: 'Family-Style Gathering',
        description: 'Generous serving pieces, relaxed elegance, and dishes designed for sharing.'
      },
      {
        value: 'elegant-plated-dinner',
        label: 'Elegant Plated Dinner',
        description: 'Refined coursing with polished presentation for celebratory evenings.'
      }
    ]
  },
  {
    id: 'starter',
    title: 'Starter',
    helper: 'Choose a first impression that opens the meal with freshness and balance.',
    type: 'single',
    options: [
      {
        value: 'roasted-beet-salad',
        label: 'Roasted Beet Salad',
        description: 'With citrus, chèvre, and toasted hazelnuts.'
      },
      {
        value: 'wild-mushroom-tartlet',
        label: 'Wild Mushroom Tartlet',
        description: 'Savory pastry with woodland herbs and a silky finish.'
      },
      {
        value: 'smoked-salmon-crostini',
        label: 'Smoked Salmon Crostini',
        description: 'A Pacific Northwest bite with crème fraîche and dill.'
      }
    ]
  },
  {
    id: 'mainCourseCategory',
    title: 'Main Course Category',
    helper: 'Start broad, then refine into a featured entrée.',
    type: 'single',
    options: [
      {
        value: 'seafood',
        label: 'Seafood',
        description: 'Coastal, bright, and ideal for Northwest ingredients.'
      },
      {
        value: 'poultry',
        label: 'Poultry',
        description: 'Classic and elegant with room for rich sauces and composed sides.'
      },
      {
        value: 'vegetarian',
        label: 'Vegetarian',
        description: 'Comforting, seasonal, and deeply satisfying without feeling heavy.'
      }
    ]
  },
  {
    id: 'mainCourseSelection',
    title: 'Main Course Selection',
    helper: 'Your available entrées respond to the category you choose above.',
    type: 'single'
  },
  {
    id: 'sauce',
    title: 'Sauce',
    helper: 'Add a finishing element that shapes the character of the plate.',
    type: 'single',
    options: [
      {
        value: 'beurre-blanc',
        label: 'Beurre Blanc',
        description: 'Silky, bright, and ideal for delicate seafood or vegetables.'
      },
      {
        value: 'red-wine-reduction',
        label: 'Red Wine Reduction',
        description: 'Deep, glossy, and dramatic for a richer dinner profile.'
      },
      {
        value: 'salsa-verde',
        label: 'Salsa Verde',
        description: 'Herbaceous and lively with a clean Pacific Northwest feel.'
      }
    ]
  },
  {
    id: 'starch',
    title: 'Starch / Grain',
    helper: 'Ground the entrée with something creamy, comforting, or earthy.',
    type: 'single',
    options: [
      {
        value: 'pommes-puree',
        label: 'Pommes Purée',
        description: 'Velvety potatoes finished for a restaurant-style plate.'
      },
      {
        value: 'wild-rice-pilaf',
        label: 'Wild Rice Pilaf',
        description: 'Nutty texture with a natural nod to regional ingredients.'
      },
      {
        value: 'creamy-polenta',
        label: 'Creamy Polenta',
        description: 'Luxurious and soft with a golden, comforting finish.'
      }
    ]
  },
  {
    id: 'vegetable',
    title: 'Vegetable Accompaniment',
    helper: 'Bring color and contrast to the finished menu.',
    type: 'single',
    options: [
      {
        value: 'asparagus-with-herbs',
        label: 'Asparagus with Herbs',
        description: 'Tender-crisp spears with lemon and garden herbs.'
      },
      {
        value: 'roasted-root-vegetables',
        label: 'Roasted Root Vegetables',
        description: 'Caramelized seasonal vegetables with warmth and depth.'
      },
      {
        value: 'charred-broccolini',
        label: 'Charred Broccolini',
        description: 'A smoky, vibrant green counterpoint to richer courses.'
      }
    ]
  },
  {
    id: 'optionalAdditions',
    title: 'Optional Additions',
    helper: 'Layer in thoughtful touches that make the evening feel fully hosted.',
    type: 'multiple',
    options: [
      {
        value: 'bread-service',
        label: 'Bread Service',
        description: 'Warm artisan bread with cultured butter or olive oil service.'
      },
      {
        value: 'cheese-course',
        label: 'Cheese Course',
        description: 'A composed cheese moment between dinner and dessert.'
      }
    ]
  },
  {
    id: 'dessert',
    title: 'Dessert',
    helper: 'Close the menu with something elegant and memorable.',
    type: 'single',
    options: [
      {
        value: 'vanilla-bean-panna-cotta',
        label: 'Vanilla Bean Panna Cotta',
        description: 'Silken cream dessert with a restrained, luxurious finish.'
      },
      {
        value: 'lemon-tart',
        label: 'Lemon Tart',
        description: 'Bright citrus, crisp shell, and a clean final note.'
      }
    ]
  }
];

export const mainCourseOptions: MainCourseCollection = {
  seafood: [
    {
      value: 'cedar-plank-salmon',
      label: 'Cedar-Plank Salmon',
      description: 'Northwest salmon with gentle smoke and a polished presentation.'
    },
    {
      value: 'seared-halibut',
      label: 'Seared Halibut',
      description: 'Buttery, elegant, and ideal for a delicate plated dinner.'
    }
  ],
  poultry: [
    {
      value: 'herb-roasted-chicken',
      label: 'Herb-Roasted Chicken',
      description: 'Classic comfort elevated with refined seasoning and crisp skin.'
    },
    {
      value: 'airline-chicken-breast',
      label: 'Airline Chicken Breast',
      description: 'A restaurant-style preparation with a sleek plated feel.'
    }
  ],
  vegetarian: [
    {
      value: 'wild-mushroom-risotto',
      label: 'Wild Mushroom Risotto',
      description: 'Earthy, luxurious, and deeply comforting.'
    },
    {
      value: 'roasted-cauliflower-steak',
      label: 'Roasted Cauliflower Steak',
      description: 'Golden, savory, and built for a composed entrée experience.'
    }
  ]
};

export const summaryOrder = [
  'diningStyle',
  'starter',
  'mainCourseSelection',
  'sauce',
  'starch',
  'vegetable',
  'optionalAdditions',
  'dessert',
  'customConsiderations'
] as const;

export const emptySummaryCopy = {
  title: 'Begin building your sample menu',
  description:
    'Choose courses and service details to shape a polished sample dinner. Your selections will appear here as a curated menu preview.'
};
