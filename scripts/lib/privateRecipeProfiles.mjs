const ingredient = (ingredient_name, quantity, unit, linked_ingredient_cost_id, options = {}) => ({
  ingredient_name,
  quantity: String(quantity),
  unit,
  linked_ingredient_cost_id,
  prep_state: options.prep_state ?? '',
  optional_flag: options.optional_flag ?? false
});

const profile = ({ yield_amount, yield_unit, portion_size, portion_unit, ingredients, costing_notes = [] }) => ({
  yield_amount,
  yield_unit,
  portion_size,
  portion_unit,
  ingredients,
  costing_notes
});

const serviceProfile = (serviceHours, planningHours, shoppingTrips = 1) =>
  profile({
    yield_amount: 1,
    yield_unit: 'event',
    portion_size: 1,
    portion_unit: 'event',
    ingredients: [
      ingredient('Menu Planning Time', planningHours, 'hour', 'menu-planning-hour'),
      ingredient('Kitchen Prep Time', serviceHours, 'hour', 'kitchen-labor-hour'),
      ingredient('Ingredient Sourcing Trip', shoppingTrips, 'trip', 'local-shopping-trip')
    ],
    costing_notes: ['Profile-level operational estimate for internal planning only.']
  });

const starterProfiles = {
  'starter-little-gem-salad-with-herbs-and-champagne-vinaigrette': profile({
    yield_amount: 8,
    yield_unit: 'portions',
    portion_size: 1,
    portion_unit: 'plate',
    ingredients: [
      ingredient('Little Gem Lettuce', 4, 'each', 'little-gem-lettuce'),
      ingredient('Champagne Vinegar', 4, 'tbsp', 'champagne-vinegar'),
      ingredient('Extra Virgin Olive Oil', 6, 'tbsp', 'olive-oil'),
      ingredient('Fresh Herbs', 0.5, 'bunch', 'fresh-herbs')
    ]
  }),
  'starter-roasted-beet-salad-with-chevre-hazelnuts-and-dill': profile({
    yield_amount: 8,
    yield_unit: 'portions',
    portion_size: 1,
    portion_unit: 'plate',
    ingredients: [
      ingredient('Red Beets', 3, 'lb', 'beets'),
      ingredient('Chèvre', 6, 'oz', 'chevre'),
      ingredient('Toasted Hazelnuts', 0.5, 'lb', 'hazelnuts'),
      ingredient('Fresh Herbs', 0.5, 'bunch', 'fresh-herbs'),
      ingredient('Extra Virgin Olive Oil', 3, 'tbsp', 'olive-oil')
    ]
  }),
  'starter-smoked-salmon-crostini-with-creme-fraiche-and-chives': profile({
    yield_amount: 12,
    yield_unit: 'pieces',
    portion_size: 2,
    portion_unit: 'pieces',
    ingredients: [
      ingredient('Smoked Salmon', 0.75, 'lb', 'smoked-salmon'),
      ingredient('Crème Fraîche', 8, 'oz', 'creme-fraiche'),
      ingredient('Country Bread', 1, 'loaf', 'country-bread'),
      ingredient('Fresh Herbs', 0.25, 'bunch', 'fresh-herbs')
    ]
  }),
  'starter-cucumber-salad-with-yogurt-herbs-and-lemon': profile({
    yield_amount: 8,
    yield_unit: 'portions',
    portion_size: 1,
    portion_unit: 'bowl',
    ingredients: [
      ingredient('Cucumber', 4, 'each', 'cucumber'),
      ingredient('Greek Yogurt', 12, 'oz', 'yogurt'),
      ingredient('Fresh Herbs', 0.5, 'bunch', 'fresh-herbs'),
      ingredient('Lemon', 2, 'each', 'lemons')
    ]
  }),
  'starter-bitter-greens-with-apple-candied-walnuts-and-cider-vinaigrette': profile({
    yield_amount: 8,
    yield_unit: 'portions',
    portion_size: 1,
    portion_unit: 'plate',
    ingredients: [
      ingredient('Mixed Greens', 2, 'lb', 'mixed-greens'),
      ingredient('Apples', 2, 'lb', 'apples'),
      ingredient('Candied Walnuts', 0.5, 'lb', 'walnuts'),
      ingredient('Apple Cider Vinegar', 4, 'tbsp', 'cider-vinegar'),
      ingredient('Extra Virgin Olive Oil', 5, 'tbsp', 'olive-oil')
    ]
  }),
  'starter-pear-and-blue-cheese-salad-with-toasted-seeds': profile({
    yield_amount: 8,
    yield_unit: 'portions',
    portion_size: 1,
    portion_unit: 'plate',
    ingredients: [
      ingredient('Mixed Greens', 2, 'lb', 'mixed-greens'),
      ingredient('Pears', 2, 'lb', 'pears'),
      ingredient('Blue Cheese', 0.5, 'lb', 'blue-cheese'),
      ingredient('Toasted Seeds', 0.25, 'lb', 'seed-mix'),
      ingredient('Extra Virgin Olive Oil', 4, 'tbsp', 'olive-oil')
    ]
  }),
  'starter-wild-mushroom-tartlet': profile({
    yield_amount: 12,
    yield_unit: 'pieces',
    portion_size: 2,
    portion_unit: 'pieces',
    ingredients: [
      ingredient('Wild Mushrooms', 1.5, 'lb', 'mushrooms'),
      ingredient('Puff Pastry', 2, 'sheet', 'puff-pastry'),
      ingredient('Yellow Onion', 1, 'lb', 'yellow-onion'),
      ingredient('Butter', 4, 'oz', 'butter'),
      ingredient('Gruyère', 4, 'oz', 'gruyere')
    ]
  }),
  'starter-caramelized-onion-and-gruyere-tart': profile({
    yield_amount: 8,
    yield_unit: 'slices',
    portion_size: 1,
    portion_unit: 'slice',
    ingredients: [
      ingredient('Yellow Onion', 2, 'lb', 'yellow-onion'),
      ingredient('Gruyère', 8, 'oz', 'gruyere'),
      ingredient('Puff Pastry', 1, 'sheet', 'puff-pastry'),
      ingredient('Butter', 3, 'oz', 'butter')
    ]
  }),
  'starter-dungeness-crab-cakes-with-herb-aioli': profile({
    yield_amount: 8,
    yield_unit: 'cakes',
    portion_size: 1,
    portion_unit: 'cake',
    ingredients: [
      ingredient('Dungeness Crab Meat', 1.5, 'lb', 'dungeness-crab'),
      ingredient('Breadcrumbs', 8, 'oz', 'breadcrumbs'),
      ingredient('Eggs', 2, 'each', 'eggs'),
      ingredient('Mayonnaise', 8, 'oz', 'mayonnaise'),
      ingredient('Fresh Herbs', 0.5, 'bunch', 'fresh-herbs')
    ]
  }),
  'starter-roasted-delicata-squash-with-brown-butter-and-sage': profile({
    yield_amount: 8,
    yield_unit: 'portions',
    portion_size: 1,
    portion_unit: 'plate',
    ingredients: [
      ingredient('Delicata Squash', 3, 'lb', 'delicata-squash'),
      ingredient('Butter', 6, 'oz', 'butter'),
      ingredient('Fresh Herbs', 0.25, 'bunch', 'fresh-herbs')
    ]
  }),
  'starter-pnw-seasonal-soup': profile({
    yield_amount: 10,
    yield_unit: 'cups',
    portion_size: 1,
    portion_unit: 'cup',
    ingredients: [
      ingredient('Seasonal Soup Base', 10, 'cup', 'seasonal-soup-base'),
      ingredient('Cream', 8, 'fl oz', 'cream'),
      ingredient('Yellow Onion', 1, 'lb', 'yellow-onion')
    ]
  }),
  'starter-creamy-cauliflower-soup-with-chive-oil': profile({
    yield_amount: 10,
    yield_unit: 'cups',
    portion_size: 1,
    portion_unit: 'cup',
    ingredients: [
      ingredient('Cauliflower', 3, 'lb', 'cauliflower'),
      ingredient('Heavy Cream', 8, 'fl oz', 'cream'),
      ingredient('Olive Oil', 3, 'tbsp', 'olive-oil'),
      ingredient('Fresh Herbs', 0.25, 'bunch', 'fresh-herbs')
    ]
  }),
  'starter-leek-and-potato-veloute': profile({
    yield_amount: 10,
    yield_unit: 'cups',
    portion_size: 1,
    portion_unit: 'cup',
    ingredients: [
      ingredient('Leeks', 2, 'lb', 'leeks'),
      ingredient('Potatoes', 3, 'lb', 'potatoes'),
      ingredient('Heavy Cream', 8, 'fl oz', 'cream'),
      ingredient('Butter', 4, 'oz', 'butter')
    ]
  }),
  'starter-woodland-mushroom-toast-with-herbs': profile({
    yield_amount: 8,
    yield_unit: 'pieces',
    portion_size: 1,
    portion_unit: 'piece',
    ingredients: [
      ingredient('Wild Mushrooms', 1.5, 'lb', 'mushrooms'),
      ingredient('Artisan Bread', 1, 'loaf', 'country-bread'),
      ingredient('Butter', 4, 'oz', 'butter'),
      ingredient('Fresh Herbs', 0.25, 'bunch', 'fresh-herbs')
    ]
  })
};

const sauceProfiles = {
  'sauce-beurre-blanc': ['butter', 'shallots', 'white-wine', 'lemons'],
  'sauce-sauce-supreme': ['butter', 'cream', 'stock', 'flour'],
  'sauce-lemon-herb-butter': ['butter', 'lemons', 'fresh-herbs'],
  'sauce-dill-cream-sauce': ['cream', 'butter', 'fresh-herbs', 'lemons'],
  'sauce-mustard-cream-sauce': ['cream', 'butter', 'dijon-mustard'],
  'sauce-tarragon-cream': ['cream', 'butter', 'fresh-herbs'],
  'sauce-chive-beurre-blanc': ['butter', 'shallots', 'white-wine', 'fresh-herbs'],
  'sauce-red-wine-reduction': ['red-wine', 'shallots', 'stock', 'butter'],
  'sauce-pinot-noir-jus': ['red-wine', 'shallots', 'stock', 'butter'],
  'sauce-shallot-pan-reduction': ['shallots', 'stock', 'butter', 'white-wine'],
  'sauce-port-wine-glaze': ['port-wine', 'stock', 'shallots', 'butter'],
  'sauce-cider-shallot-jus': ['apple-cider', 'stock', 'shallots', 'butter'],
  'sauce-mushroom-jus': ['mushrooms', 'stock', 'shallots', 'butter'],
  'sauce-herb-roasting-jus': ['stock', 'butter', 'fresh-herbs'],
  'sauce-salsa-verde': ['olive-oil', 'fresh-herbs', 'lemons', 'capers'],
  'sauce-basil-oil': ['olive-oil', 'fresh-herbs'],
  'sauce-chive-emulsion': ['olive-oil', 'fresh-herbs', 'cream'],
  'sauce-tarragon-herb-sauce': ['olive-oil', 'fresh-herbs', 'white-wine'],
  'sauce-parsley-herb-drizzle': ['olive-oil', 'fresh-herbs', 'lemons'],
  'sauce-dill-lemon-emulsion': ['olive-oil', 'fresh-herbs', 'lemons', 'cream'],
  'sauce-sorrel-herb-sauce': ['olive-oil', 'fresh-herbs', 'white-wine'],
  'sauce-wild-mushroom-veloute': ['mushrooms', 'stock', 'butter', 'cream', 'flour'],
  'sauce-roasted-red-pepper-coulis': ['red-peppers', 'olive-oil', 'yellow-onion'],
  'sauce-celery-root-puree': ['celery-root', 'cream', 'butter'],
  'sauce-parsnip-puree': ['parsnips', 'cream', 'butter'],
  'sauce-apple-cider-gastrique': ['apple-cider', 'cider-vinegar', 'sugar'],
  'sauce-tomato-fennel-fondue': ['tomatoes', 'fennel', 'olive-oil', 'yellow-onion'],
  'sauce-carrot-ginger-puree': ['carrots', 'ginger', 'butter', 'cream'],
  'sauce-smoked-onion-puree': ['yellow-onion', 'butter', 'cream']
};

const starchProfiles = {
  'starch-pommes-puree': ['potatoes', 'butter', 'cream'],
  'starch-potato-gratin': ['potatoes', 'cream', 'gruyere', 'butter'],
  'starch-roasted-fingerling-potatoes': ['potatoes', 'olive-oil', 'fresh-herbs'],
  'starch-brown-butter-mashed-potatoes': ['potatoes', 'butter', 'cream'],
  'starch-herb-roasted-baby-potatoes': ['potatoes', 'olive-oil', 'fresh-herbs'],
  'starch-wild-rice-pilaf': ['wild-rice', 'stock', 'yellow-onion', 'butter'],
  'starch-mushroom-rice-pilaf': ['wild-rice', 'mushrooms', 'stock', 'yellow-onion', 'butter'],
  'starch-farro-with-herbs': ['farro', 'stock', 'olive-oil', 'fresh-herbs'],
  'starch-barley-with-herbs': ['barley', 'stock', 'olive-oil', 'fresh-herbs'],
  'starch-creamy-polenta': ['polenta', 'stock', 'butter', 'gruyere'],
  'starch-parmesan-risotto': ['arborio-rice', 'stock', 'butter', 'parmesan', 'white-wine'],
  'starch-cider-glazed-root-mash': ['potatoes', 'carrots', 'parsnips', 'butter', 'apple-cider'],
  'starch-herb-grain-medley': ['farro', 'barley', 'stock', 'fresh-herbs'],
  'starch-woodland-mushroom-grain-pilaf': ['farro', 'mushrooms', 'stock', 'yellow-onion', 'butter']
};

const vegetableProfiles = {
  'vegetable-haricots-verts-with-shallots': ['green-beans', 'shallots', 'butter'],
  'vegetable-asparagus-with-lemon-and-herbs': ['asparagus', 'lemons', 'olive-oil', 'fresh-herbs'],
  'vegetable-charred-broccolini': ['broccolini', 'olive-oil', 'lemons'],
  'vegetable-braised-greens': ['mixed-greens', 'yellow-onion', 'olive-oil'],
  'vegetable-peas-with-mint-and-shallots': ['peas', 'shallots', 'butter', 'fresh-herbs'],
  'vegetable-glazed-carrots': ['carrots', 'butter', 'fresh-herbs'],
  'vegetable-roasted-root-vegetables': ['carrots', 'parsnips', 'potatoes', 'olive-oil', 'fresh-herbs'],
  'vegetable-butter-braised-cabbage': ['cabbage', 'butter', 'stock'],
  'vegetable-roasted-brussels-sprouts': ['brussels-sprouts', 'olive-oil'],
  'vegetable-roasted-squash-wedges': ['delicata-squash', 'olive-oil', 'fresh-herbs'],
  'vegetable-wild-mushrooms-with-thyme': ['mushrooms', 'butter', 'fresh-herbs'],
  'vegetable-roasted-cauliflower': ['cauliflower', 'olive-oil'],
  'vegetable-braised-leeks': ['leeks', 'butter', 'stock'],
  'vegetable-woodland-mushrooms-and-shallots': ['mushrooms', 'shallots', 'butter'],
  'vegetable-chef-s-selected-market-vegetable': ['seasonal-veg', 'olive-oil', 'fresh-herbs']
};

const dessertProfiles = {
  'dessert-vanilla-bean-panna-cotta': ['cream', 'sugar', 'gelatin', 'vanilla'],
  'dessert-chocolate-pot-de-creme': ['cream', 'eggs', 'sugar', 'dark-chocolate'],
  'dessert-lemon-tart': ['flour', 'butter', 'eggs', 'sugar', 'lemons'],
  'dessert-rustic-berry-galette': ['flour', 'butter', 'berries', 'sugar'],
  'dessert-apple-crisp': ['apples', 'butter', 'flour', 'sugar', 'oats'],
  'dessert-seasonal-fruit-with-whipped-mascarpone': ['seasonal-fruit', 'mascarpone', 'cream', 'sugar'],
  'dessert-creme-brulee': ['cream', 'eggs', 'sugar', 'vanilla'],
  'dessert-flourless-chocolate-torte': ['dark-chocolate', 'butter', 'eggs', 'sugar'],
  'dessert-pear-almond-tart': ['pears', 'flour', 'butter', 'eggs', 'almond-meal', 'sugar'],
  'dessert-blackberry-cobbler': ['berries', 'flour', 'butter', 'sugar'],
  'dessert-honey-cake-with-cream': ['flour', 'eggs', 'honey', 'cream'],
  'dessert-poached-pears-with-spiced-syrup': ['pears', 'sugar', 'red-wine'],
  'dessert-hazelnut-chocolate-tart': ['dark-chocolate', 'hazelnuts', 'flour', 'butter', 'cream'],
  'dessert-berry-shortcake': ['berries', 'flour', 'butter', 'cream', 'sugar']
};

const additionProfiles = {
  'addition-artisan-bread-service': ['country-bread', 'butter'],
  'addition-cultured-butter-and-sea-salt': ['butter', 'sea-salt'],
  'addition-cheese-course': ['local-cheese', 'artisan-crackers', 'seasonal-fruit'],
  'addition-seasonal-salad': ['mixed-greens', 'seasonal-fruit', 'olive-oil', 'cider-vinegar'],
  'addition-appetizer-board': ['local-cheese', 'artisan-crackers', 'charcuterie', 'seasonal-fruit'],
  'addition-soup-course': ['seasonal-soup-base', 'cream'],
  'addition-extra-vegetable-side': ['seasonal-veg', 'olive-oil', 'fresh-herbs'],
  'addition-oyster-add-on': ['oysters', 'lemons'],
  'addition-wine-pairing-notes': ['menu-planning-hour'],
  'addition-brunch-pastry-basket': ['pastry-assortment'],
  'addition-local-jam-and-bread-board': ['country-bread', 'jam', 'butter'],
  'addition-northwest-cheese-board': ['local-cheese', 'artisan-crackers', 'jam']
};

const baseQuantities = {
  butter: 6,
  'butter': 4,
  shallots: 0.5,
  'white-wine': 8,
  'red-wine': 8,
  'port-wine': 6,
  'apple-cider': 8,
  lemons: 2,
  'cream': 8,
  stock: 16,
  flour: 8,
  'dijon-mustard': 2,
  capers: 2,
  'red-peppers': 1,
  'celery-root': 2,
  parsnips: 2,
  tomatoes: 2,
  fennel: 1,
  carrots: 2,
  ginger: 2,
  potatoes: 4,
  'wild-rice': 1,
  farro: 1,
  barley: 1,
  polenta: 1,
  'arborio-rice': 1,
  parmesan: 4,
  'green-beans': 2,
  asparagus: 2,
  broccolini: 2,
  peas: 2,
  cabbage: 1,
  'brussels-sprouts': 2,
  cauliflower: 2,
  leeks: 2,
  'seasonal-veg': 2,
  gelatin: 1,
  vanilla: 1,
  eggs: 6,
  sugar: 8,
  'dark-chocolate': 1,
  berries: 2,
  oats: 4,
  'seasonal-fruit': 2,
  mascarpone: 8,
  'almond-meal': 4,
  honey: 6,
  'country-bread': 1,
  'local-cheese': 1,
  'artisan-crackers': 1,
  charcuterie: 1,
  oysters: 12,
  'pastry-assortment': 1,
  'jam': 1,
  'menu-planning-hour': 0.5
};

const baseUnits = {
  butter: 'oz',
  'butter': 'oz',
  shallots: 'lb',
  'white-wine': 'fl oz',
  'red-wine': 'fl oz',
  'port-wine': 'fl oz',
  'apple-cider': 'fl oz',
  lemons: 'each',
  'cream': 'fl oz',
  stock: 'fl oz',
  flour: 'oz',
  'dijon-mustard': 'oz',
  capers: 'oz',
  'red-peppers': 'jar',
  'celery-root': 'lb',
  parsnips: 'lb',
  tomatoes: 'lb',
  fennel: 'each',
  carrots: 'lb',
  ginger: 'oz',
  potatoes: 'lb',
  'wild-rice': 'lb',
  farro: 'lb',
  barley: 'lb',
  polenta: 'lb',
  'arborio-rice': 'lb',
  parmesan: 'oz',
  'green-beans': 'lb',
  asparagus: 'lb',
  broccolini: 'lb',
  peas: 'lb',
  cabbage: 'each',
  'brussels-sprouts': 'lb',
  cauliflower: 'lb',
  leeks: 'lb',
  'seasonal-veg': 'lb',
  gelatin: 'oz',
  vanilla: 'bean',
  eggs: 'each',
  sugar: 'oz',
  'dark-chocolate': 'lb',
  berries: 'lb',
  oats: 'oz',
  'seasonal-fruit': 'lb',
  mascarpone: 'oz',
  'almond-meal': 'oz',
  honey: 'oz',
  'country-bread': 'loaf',
  'local-cheese': 'lb',
  'artisan-crackers': 'box',
  charcuterie: 'lb',
  oysters: 'each',
  'pastry-assortment': 'box',
  'jam': 'jar',
  'menu-planning-hour': 'hour'
};

const buildIngredientsFromIds = (ids) =>
  ids.map((id) => ingredient(id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()), baseQuantities[id], baseUnits[id], id));

const buildSauceProfile = (recipeId) =>
  sauceProfiles[recipeId]
    ? profile({
        yield_amount: 12,
        yield_unit: 'ounces',
        portion_size: 2,
        portion_unit: 'ounces',
        ingredients: buildIngredientsFromIds(sauceProfiles[recipeId])
      })
    : null;

const buildStarchProfile = (recipeId) =>
  starchProfiles[recipeId]
    ? profile({
        yield_amount: 8,
        yield_unit: 'portions',
        portion_size: 1,
        portion_unit: 'portion',
        ingredients: buildIngredientsFromIds(starchProfiles[recipeId])
      })
    : null;

const buildVegetableProfile = (recipeId) =>
  vegetableProfiles[recipeId]
    ? profile({
        yield_amount: 8,
        yield_unit: 'portions',
        portion_size: 1,
        portion_unit: 'portion',
        ingredients: buildIngredientsFromIds(vegetableProfiles[recipeId])
      })
    : null;

const buildDessertProfile = (recipeId) =>
  dessertProfiles[recipeId]
    ? profile({
        yield_amount: 8,
        yield_unit: 'portions',
        portion_size: 1,
        portion_unit: 'portion',
        ingredients: buildIngredientsFromIds(dessertProfiles[recipeId])
      })
    : null;

const buildAdditionProfile = (recipeId) =>
  additionProfiles[recipeId]
    ? profile({
        yield_amount: recipeId === 'addition-oyster-add-on' ? 12 : 8,
        yield_unit: recipeId === 'addition-oyster-add-on' ? 'oysters' : 'portions',
        portion_size: 1,
        portion_unit: recipeId === 'addition-oyster-add-on' ? 'oyster' : 'portion',
        ingredients: buildIngredientsFromIds(additionProfiles[recipeId])
      })
    : null;

const inferMainCourseProtein = (recipe) => {
  const lower = recipe.name.toLowerCase();
  if (lower.includes('salmon')) return ['salmon'];
  if (lower.includes('halibut')) return ['halibut'];
  if (lower.includes('black cod')) return ['black-cod'];
  if (lower.includes('scallops')) return ['scallops'];
  if (lower.includes('crab cakes')) return ['dungeness-crab', 'breadcrumbs', 'eggs'];
  if (lower.includes('chicken')) return ['chicken-supreme'];
  if (lower.includes('duck')) return ['duck-breast'];
  if (lower.includes('pork')) return ['pork-tenderloin'];
  if (lower.includes('beef')) return ['beef-tenderloin'];
  if (lower.includes('cauliflower')) return ['cauliflower'];
  if (lower.includes('risotto')) return ['arborio-rice', 'mushrooms'];
  if (lower.includes('squash')) return ['delicata-squash', 'quinoa'];
  if (lower.includes('lentil')) return ['lentils'];
  if (lower.includes('mushroom')) return ['mushrooms', 'polenta'];
  return ['seasonal-veg'];
};

const buildMainCourseProfile = (recipe) => {
  const ingredients = inferMainCourseProtein(recipe).map((id) => ingredient(id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()), {
    'salmon': 2.5,
    'halibut': 2.5,
    'black-cod': 2.5,
    scallops: 2,
    'dungeness-crab': 1.5,
    breadcrumbs: 8,
    eggs: 2,
    'chicken-supreme': 4,
    'duck-breast': 4,
    'pork-tenderloin': 4,
    'beef-tenderloin': 4,
    cauliflower: 3,
    'arborio-rice': 1,
    mushrooms: 1.5,
    'delicata-squash': 3,
    quinoa: 1,
    lentils: 1,
    polenta: 1.5,
    'seasonal-veg': 3
  }[id], {
    'salmon': 'lb',
    'halibut': 'lb',
    'black-cod': 'lb',
    scallops: 'lb',
    'dungeness-crab': 'lb',
    breadcrumbs: 'oz',
    eggs: 'each',
    'chicken-supreme': 'lb',
    'duck-breast': 'lb',
    'pork-tenderloin': 'lb',
    'beef-tenderloin': 'lb',
    cauliflower: 'lb',
    'arborio-rice': 'lb',
    mushrooms: 'lb',
    'delicata-squash': 'lb',
    quinoa: 'lb',
    lentils: 'lb',
    polenta: 'lb',
    'seasonal-veg': 'lb'
  }[id], id));

  ingredients.push(ingredient('Butter', 4, 'oz', 'butter'));
  ingredients.push(ingredient('Fresh Herbs', 0.5, 'bunch', 'fresh-herbs'));
  ingredients.push(ingredient('Lemon', 2, 'each', 'lemons'));

  const lower = recipe.name.toLowerCase();
  if (lower.includes('miso')) ingredients.push(ingredient('Miso', 6, 'oz', 'miso'));
  if (lower.includes('wine')) ingredients.push(ingredient('White Wine', 8, 'fl oz', 'white-wine'));
  if (lower.includes('cider')) ingredients.push(ingredient('Apple Cider', 8, 'fl oz', 'apple-cider'));
  if (lower.includes('mushroom')) ingredients.push(ingredient('Wild Mushrooms', 1, 'lb', 'mushrooms'));
  if (lower.includes('herb-roasted')) ingredients.push(ingredient('Olive Oil', 4, 'tbsp', 'olive-oil'));

  return profile({
    yield_amount: 8,
    yield_unit: 'portions',
    portion_size: 1,
    portion_unit: 'portion',
    ingredients
  });
};

const diningStyleProfiles = {
  'dining-style-olympic-coast-dinner': serviceProfile(6, 2, 2),
  'dining-style-forest-and-field-supper': serviceProfile(5, 2, 1),
  'dining-style-romantic-peninsula-dinner': serviceProfile(4, 1.5, 1),
  'dining-style-pnw-family-table': serviceProfile(5, 1.5, 2),
  'dining-style-seasonal-tasting-menu': serviceProfile(8, 3, 2),
  'dining-style-coastal-brunch-table': serviceProfile(4, 1.5, 1),
  'dining-style-harvest-celebration-dinner': serviceProfile(6, 2, 2),
  'dining-style-wellness-from-the-northwest': serviceProfile(5, 2, 1)
};

export const resolveRecipeProfile = (recipe) => {
  if (recipe.ingredients?.some((entry) => entry.linked_ingredient_cost_id !== 'notes')) {
    return null;
  }

  return (
    diningStyleProfiles[recipe.id] ??
    starterProfiles[recipe.id] ??
    buildSauceProfile(recipe.id) ??
    buildStarchProfile(recipe.id) ??
    buildVegetableProfile(recipe.id) ??
    buildDessertProfile(recipe.id) ??
    buildAdditionProfile(recipe.id) ??
    (recipe.category === 'main-course' ? buildMainCourseProfile(recipe) : null)
  );
};
