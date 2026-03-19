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
    | 'starchCategory'
    | 'starchSelection'
    | 'vegetableCategory'
    | 'vegetableSelection'
    | 'optionalAdditions'
    | 'dessert';
  title: string;
  helper: string;
  type: 'single' | 'multiple';
  options?: BuilderOption[];
};

export type MainCourseCollection = Record<string, BuilderOption[]>;
export type BuilderCategoryCollection = Record<string, BuilderOption[]>;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const option = (label: string, description?: string, note?: string): BuilderOption => ({
  value: slugify(label),
  label,
  description,
  note
});

export const menuBuilderSections: BuilderSection[] = [
  {
    id: 'diningStyle',
    title: 'Dining Style',
    helper: 'Choose the overall tone of your dining experience.',
    type: 'single',
    options: [
      option('Olympic Coast Dinner', 'Seafood-forward and elegant, with a calm coastal rhythm.'),
      option('Forest & Field Supper', 'Woodland mushrooms, garden produce, and cozy seasonal depth.'),
      option('Romantic Peninsula Dinner', 'An intimate, softly luxurious menu designed for two.'),
      option('PNW Family Table', 'Abundant, welcoming dishes with polished family-style ease.'),
      option('Seasonal Tasting Menu', 'A composed progression highlighting the season with refined restraint.'),
      option('Coastal Brunch Table', 'Bright, relaxed courses suited to a leisurely late-morning gathering.'),
      option('Harvest Celebration Dinner', 'Warm autumnal flavors and celebratory hosting details.'),
      option('Wellness from the Northwest', 'Clean, vibrant choices centered on balance and regional produce.')
    ]
  },
  {
    id: 'starter',
    title: 'Starter',
    helper: 'Begin with a light first course or a warm seasonal opener.',
    type: 'single',
    options: [
      option('Little Gem Salad with herbs and champagne vinaigrette', 'Crisp and delicate with a polished opening-course feel.'),
      option('Roasted Beet Salad with chèvre, hazelnuts, and dill', 'Earthy sweetness balanced by tangy chèvre and toasted nuts.'),
      option('Smoked Salmon Crostini with crème fraîche and chives', 'A classic Northwest bite with cool richness and fresh herbs.'),
      option('Cucumber Salad with yogurt, herbs, and lemon', 'Refreshing, bright, and especially lovely for brunch or spring dinners.'),
      option('Bitter Greens with apple, candied walnuts, and cider vinaigrette', 'A structured salad with orchard fruit and pleasant bitterness.'),
      option('Pear and blue cheese salad with toasted seeds', 'Sweet fruit, creamy blue cheese, and a quietly luxurious finish.'),
      option('Wild Mushroom Tartlet', 'Savory pastry with woodland character and elegant plating.'),
      option('Caramelized Onion and Gruyère Tart', 'Golden, aromatic, and ideal for cooler-season menus.'),
      option('Dungeness Crab Cakes with herb aioli', 'Pacific Northwest crab presented as a refined first course.'),
      option('Roasted Delicata Squash with brown butter and sage', 'Soft sweetness and nutty warmth for autumn tables.'),
      option('PNW Seasonal Soup', 'A rotating soup course shaped by market produce and the season.'),
      option('Creamy Cauliflower Soup with chive oil', 'Silky and understated with a fresh green finish.'),
      option('Leek and potato velouté', 'Velvet-textured and classic, ideal for a cozy refined dinner.'),
      option('Woodland mushroom toast with herbs', 'Rustic in spirit, but plated with premium private-chef finesse.')
    ]
  },
  {
    id: 'mainCourseCategory',
    title: 'Main Course Category',
    helper: 'Select the style of main course you would like to build.',
    type: 'single',
    options: [
      option('PNW Seafood', 'Coastal entrées rooted in salmon, halibut, shellfish, and bright sauces.'),
      option('Woodland Poultry', 'Comforting yet elegant chicken preparations with herb and mushroom accents.'),
      option('Braised & Roasted Meats', 'Slow-cooked richness, refined jus, and celebratory center-of-plate options.'),
      option('Vegetarian from the Garden', 'Seasonal vegetables, grains, and handmade elements with composed presentation.'),
      option('Vegan Seasonal Plate', 'Plant-forward entrées that feel complete, balanced, and chef-driven.')
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
    helper: 'Pair your entrée with a classic or seasonal finishing sauce.',
    type: 'single',
    options: [
      option('Beurre Blanc', 'Silky and bright for delicate seafood and composed plates.'),
      option('Sauce Suprême', 'A classic French-style cream sauce with elegant richness.'),
      option('Lemon Herb Butter', 'Fresh and polished with a clean citrus finish.'),
      option('Dill Cream Sauce', 'Ideal for salmon, steelhead, and coastal brunch menus.'),
      option('Mustard Cream Sauce', 'Soft tang and warmth for poultry or pork.'),
      option('Tarragon Cream', 'Fragrant and refined with a quiet French-country feel.'),
      option('Chive Beurre Blanc', 'An herb-lifted variation especially suited to halibut.'),
      option('Red Wine Reduction', 'Deep, glossy flavor for beef-centered dinners.'),
      option('Pinot Noir Jus', 'Northwest wine character with savory, polished depth.'),
      option('Shallot Pan Reduction', 'Balanced and versatile with subtle aromatic sweetness.'),
      option('Port Wine Glaze', 'A darker, gently sweet finish for richer meats.'),
      option('Cider Shallot Jus', 'A Peninsula-friendly pairing for pork, salmon, and autumn menus.'),
      option('Mushroom Jus', 'Earthy and elegant with woodland appeal.'),
      option('Herb Roasting Jus', 'Simple, savory, and ideal for roast-centered plates.'),
      option('Salsa Verde', 'Bright herbs and acidity to keep richer dishes lively.'),
      option('Basil Oil', 'Fresh green color and aromatic lift for lighter plates.'),
      option('Chive Emulsion', 'A modern, delicate sauce with allium brightness.'),
      option('Tarragon Herb Sauce', 'Green and herbaceous with refined anise notes.'),
      option('Parsley Herb Drizzle', 'Clean and versatile for garden-forward menus.'),
      option('Dill Lemon Emulsion', 'Especially suited to salmon, halibut, and spring vegetables.'),
      option('Sorrel Herb Sauce', 'Lemony and softly tangy with a chef-curated feel.'),
      option('Wild Mushroom Velouté', 'Luxurious woodland depth for risotto or roasted vegetables.'),
      option('Roasted Red Pepper Coulis', 'Silky sweetness and color for vegetable-forward plates.'),
      option('Celery Root Purée', 'A soft, elegant base that adds warmth and structure.'),
      option('Parsnip Purée', 'Sweet-earthy and ideal for cool-weather menus.'),
      option('Apple Cider Gastrique', 'A bright-sweet reduction that flatters pork and squash.'),
      option('Tomato-Fennel Fondue', 'Gently braised, savory, and excellent with halibut.'),
      option('Carrot Ginger Purée', 'Subtle sweetness with a fresh aromatic lift.'),
      option('Smoked Onion Purée', 'Moody depth for roasted meats and autumn vegetables.')
    ]
  },
  {
    id: 'starchCategory',
    title: 'Starch / Grain Category',
    helper: 'Choose the style of starch or grain you want on the plate.',
    type: 'single',
    options: [
      option('Potato Preparations', 'Classic potato sides with restaurant-level comfort and polish.'),
      option('Rice & Grain Sides', 'Lighter grain-forward accompaniments with texture and lift.'),
      option('Polenta & Risotto', 'Creamy, composed foundations for elegant plated dinners.'),
      option('Seasonal Rustic Sides', 'Chef-driven seasonal sides with a warm, rustic-luxe feel.')
    ]
  },
  {
    id: 'starchSelection',
    title: 'Starch / Grain Selection',
    helper: 'Select the starch or grain that best completes the entrée.',
    type: 'single'
  },
  {
    id: 'vegetableCategory',
    title: 'Vegetable Category',
    helper: 'Choose the vegetable direction that best fits the main course.',
    type: 'single',
    options: [
      option('Green Vegetables', 'Bright, elegant greens that keep the plate lifted and fresh.'),
      option('Root & Orchard Vegetables', 'Sweet-earthy vegetables with polished seasonal warmth.'),
      option('Woodland & Earthy Sides', 'Savory, aromatic vegetables with forest-driven depth.'),
      option('Seasonal Market Sides', 'Flexible market-led accompaniments chosen for freshness and balance.')
    ]
  },
  {
    id: 'vegetableSelection',
    title: 'Vegetable Selection',
    helper: 'Choose your vegetable accompaniment.',
    type: 'single'
  },
  {
    id: 'optionalAdditions',
    title: 'Optional Additions',
    helper: 'Optional touches to round out the table.',
    type: 'multiple',
    options: [
      option('Artisan Bread Service', 'A warm hospitality touch for sharing at the table.'),
      option('Cultured Butter & Sea Salt', 'A small luxury to accompany bread service.'),
      option('Cheese Course', 'A composed transition between savory courses and dessert.'),
      option('Seasonal Salad', 'An additional fresh course built around the market.'),
      option('Appetizer Board', 'A generous opening spread for relaxed hosting.'),
      option('Soup Course', 'An extra warm course for layered seasonal menus.'),
      option('Extra Vegetable Side', 'Adds abundance and flexibility for the table.'),
      option('Oyster Add-On', 'A coastal accent suitable for celebratory dinners.'),
      option('Wine-Pairing Notes', 'Chef-curated pairing guidance to shape the meal experience.'),
      option('Brunch Pastry Basket', 'Ideal for coastal brunches and slower morning gatherings.'),
      option('Local Jam & Bread Board', 'A Peninsula-inspired breakfast or brunch detail.'),
      option('Northwest Cheese Board', 'Regional cheeses presented as a hosted finishing touch.')
    ]
  },
  {
    id: 'dessert',
    title: 'Dessert',
    helper: 'Close the menu with something elegant, seasonal, and memorable.',
    type: 'single',
    options: [
      option('Vanilla Bean Panna Cotta', 'Silken and restrained with classic private-chef polish.'),
      option('Chocolate Pot de Crème', 'Rich, spoonable chocolate with understated elegance.'),
      option('Lemon Tart', 'Bright citrus and a crisp shell for a clean final note.'),
      option('Rustic Berry Galette', 'A gently casual dessert elevated by peak-season fruit.'),
      option('Apple Crisp', 'Warm orchard comfort with a premium homestyle feel.'),
      option('Seasonal Fruit with whipped mascarpone', 'Light, fresh, and well-suited to brunch or wellness menus.'),
      option('Crème Brûlée', 'Classic, creamy, and always celebratory.'),
      option('Flourless Chocolate Torte', 'Dense, elegant, and naturally gluten-conscious.'),
      option('Pear Almond Tart', 'Soft fruit, nutty richness, and cool-weather charm.'),
      option('Blackberry Cobbler', 'A Northwest-leaning dessert with cozy appeal.'),
      option('Honey Cake with cream', 'Simple, fragrant, and beautifully paired with tea or coffee.'),
      option('Poached pears with spiced syrup', 'Quietly luxurious with a refined autumn feel.'),
      option('Hazelnut chocolate tart', 'A deeper dessert with regional nut character.'),
      option('Berry shortcake', 'Light cream, tender cake, and a celebratory seasonal finish.')
    ]
  }
];

export const starchOptionsByCategory: BuilderCategoryCollection = {
  'potato-preparations': [
    option('Pommes Purée', 'Classic, velvety potatoes finished with restaurant-style refinement.'),
    option('Potato Gratin', 'Golden, layered potatoes with quiet decadence.'),
    option('Roasted Fingerling Potatoes', 'Crisp edges and a simple, elegant roasted profile.'),
    option('Brown Butter Mashed Potatoes', 'Nutty richness for celebratory dinners.'),
    option('Herb-Roasted Baby Potatoes', 'Simple and elegant with aromatic herb notes.')
  ],
  'rice-and-grain-sides': [
    option('Wild Rice Pilaf', 'Nutty texture and a distinct Pacific Northwest sensibility.'),
    option('Mushroom Rice Pilaf', 'Savory grains infused with woodland depth.'),
    option('Farro with Herbs', 'Pleasant chew and a garden-forward, rustic-luxe finish.'),
    option('Barley with Herbs', 'Wholesome and understated with earthy balance.')
  ],
  'polenta-and-risotto': [
    option('Creamy Polenta', 'Soft, luxurious, and deeply comforting.'),
    option('Parmesan Risotto', 'A polished, crowd-pleasing accompaniment with rich texture.')
  ],
  'seasonal-rustic-sides': [
    option('Cider-Glazed Root Mash', 'A warm seasonal base with orchard sweetness.'),
    option('Herb Grain Medley', 'A savory seasonal grain blend with a composed rustic finish.'),
    option('Woodland Mushroom Grain Pilaf', 'Earthy grain pilaf with deep woodland character.')
  ]
};

export const vegetableOptionsByCategory: BuilderCategoryCollection = {
  'green-vegetables': [
    option('Haricots Verts with Shallots', 'Tender-crisp beans finished with subtle French influence.'),
    option('Asparagus with Lemon and Herbs', 'Bright and graceful for spring menus and seafood entrées.'),
    option('Charred Broccolini', 'A lightly smoky green element that brings contrast.'),
    option('Braised Greens', 'Soft bitterness and savory depth for balanced menus.'),
    option('Peas with Mint and Shallots', 'Fresh, bright, and especially lovely in spring.')
  ],
  'root-and-orchard-vegetables': [
    option('Glazed Carrots', 'Sweet, polished, and beautiful on the plate.'),
    option('Roasted Root Vegetables', 'Caramelized and comforting with broad seasonal appeal.'),
    option('Butter-Braised Cabbage', 'Silky and unexpectedly refined alongside roast meats.'),
    option('Roasted Brussels Sprouts', 'Crisp-edged and ideal for cool-weather dinners.'),
    option('Roasted Squash Wedges', 'A seasonal favorite with sweetness and color.')
  ],
  'woodland-and-earthy-sides': [
    option('Sautéed Woodland Mushrooms', 'Earthy and luxurious with coastal-forest character.'),
    option('Fennel and Leek Braise', 'Softly aromatic and elegant with seafood or chicken.'),
    option('Roasted Cauliflower with Herbs', 'Golden edges and savory herb warmth.')
  ],
  'seasonal-market-sides': [
    option('Seasonal Market Vegetables', 'Chef-selected produce based on what is best at the moment.'),
    option('Chef’s Market Vegetable Selection', 'A composed chef’s-choice pairing built around market finds.')
  ]
};

export const mainCourseOptions: MainCourseCollection = {
  'pnw-seafood': [
    option('Cedar-Plank Salmon', 'Gently smoky salmon with Pacific Northwest character.', 'Pairs well with Beurre Blanc, Dill Cream Sauce, Lemon Herb Butter, or Cider Shallot Jus.'),
    option('Seared Pacific Halibut', 'A refined coastal centerpiece with a delicate, buttery finish.', 'Pairs well with Chive Beurre Blanc, Tarragon Cream, or Tomato-Fennel Fondue.'),
    option('Herb-Roasted Black Cod', 'Silky and luxurious with herbal lift and elegant simplicity.'),
    option('Pan-Seared Scallops', 'Golden sear and tender center for a polished plated dinner.'),
    option('Dungeness Crab Cakes', 'Rich crab flavor presented as a composed main course.'),
    option('Miso-Glazed Salmon', 'A subtle savory-sweet profile that still feels regionally grounded.'),
    option('Roasted Steelhead with lemon and herbs', 'Bright, familiar, and beautifully suited to Peninsula entertaining.'),
    option('Halibut with fennel and white wine', 'Soft aromatics and classic coastal restraint.'),
    option('Salmon with dill and cider glaze', 'A local-feeling pairing of orchard brightness and fresh herbs.')
  ],
  'woodland-poultry': [
    option('Herb-Roasted Chicken Supreme', 'A premium private-chef classic with crisp skin and elegant pacing.'),
    option('Pan-Seared Airline Chicken Breast', 'Sleek presentation with gentle richness and composed plating.'),
    option('Cider-Brined Roast Chicken', 'A Peninsula-inspired roast with subtle orchard depth.'),
    option('Chicken with Forest Mushroom Pan Sauce', 'Savory mushroom notes for a woodland-driven dinner.'),
    option('Roast Chicken with tarragon cream', 'French-influenced comfort with softly aromatic richness.'),
    option('Crispy chicken with leek fondue', 'A textural contrast of crisp skin and silky leeks.'),
    option('Herb-roasted chicken with apple shallot jus', 'Balanced savory flavors with a polished orchard note.')
  ],
  'braised-and-roasted-meats': [
    option('Braised Beef Short Rib', 'Fork-tender and deeply savory for celebratory cool-weather dining.', 'Pairs well with Pinot Noir Jus, Red Wine Reduction, or Mushroom Jus.'),
    option('Filet of Beef with herb butter', 'Classic luxury with clean flavors and elegant restraint.'),
    option('Seared Bistro Steak', 'A more relaxed steak option that still feels chef-curated.'),
    option('Red Wine Braised Chuck Roast', 'Slow-cooked comfort presented with refined plating.'),
    option('Cider-Glazed Pork Tenderloin', 'A balanced pork entrée with Peninsula orchard character.'),
    option('Apple-Brined Pork Loin', 'Juicy roast pork with gentle fruit and herb notes.'),
    option('Herb-Crusted Pork Chop', 'Structured, savory, and satisfying without feeling heavy.'),
    option('Slow-Roasted Pork Shoulder', 'Deeply comforting and ideal for family-style luxury service.'),
    option('Beef with pinot noir jus', 'A polished Northwest steakhouse direction with wine-driven depth.')
  ],
  'vegetarian-from-the-garden': [
    option('Wild Mushroom Risotto', 'Earthy, creamy, and one of the most elegant vegetarian centerpieces.', 'Pairs well with Wild Mushroom Velouté and herb-forward accompaniments.'),
    option('Roasted Cauliflower Steak', 'Golden, savory, and composed like a true entrée.', 'Pairs well with Roasted Red Pepper Coulis, Parsnip Purée, or Salsa Verde.'),
    option('Herb Polenta with seasonal vegetables', 'Soft polenta topped with market produce and garden herbs.'),
    option('Lentil and Root Vegetable Galette', 'A rustic-luxe vegetarian plate with pastry structure.'),
    option('Butternut Squash Ravioli', 'Silky filled pasta with sweet-savory seasonal appeal.'),
    option('Forest Mushroom Bread Pudding', 'Unexpected, rich, and deeply comforting.'),
    option('Roasted squash with sage brown butter', 'Simple seasonal elegance with nutty warmth.'),
    option('Ricotta gnocchi with herbs and mushrooms', 'Pillowy gnocchi with gentle woodland richness.'),
    option('Savory tart with leek, chèvre, and roasted vegetables', 'A composed vegetarian entrée suited to brunch or dinner.')
  ],
  'vegan-seasonal-plate': [
    option('Charred Cauliflower with chickpea purée', 'A plant-forward plate with structure, warmth, and contrast.'),
    option('Wild Rice and Mushroom Stuffed Squash', 'Comforting, seasonal, and beautifully suited to autumn hosting.'),
    option('Lentil Cassoulet with root vegetables', 'Hearty but polished, with deep savory character.'),
    option('Roasted Carrot and Farro Plate', 'Sweet earthiness and satisfying grain-forward texture.'),
    option('Herb-Braised White Beans with Greens', 'Balanced, nourishing, and quietly elegant.'),
    option('Cider-glazed root vegetable plate', 'An orchard-inspired vegan entrée with seasonal warmth.'),
    option('Mushroom and lentil roast', 'A more substantial plant-based option for celebratory tables.'),
    option('Roasted delicata with grains and herbs', 'Lightly sweet squash with fresh herbs and composed grains.')
  ]
};

export const summaryOrder = [
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

export const emptySummaryCopy = {
  title: 'Begin building your sample menu',
  description:
    'Choose courses and service details to shape a polished Olympic Peninsula menu. Your selections will appear here as a curated preview.'
};
