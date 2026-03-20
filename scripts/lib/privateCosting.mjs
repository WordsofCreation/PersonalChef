import recipesData from '../../src/content/privateRecipes/menu-builder-recipes.json' with { type: 'json' };
import ingredientCostsData from '../../src/content/ingredientCosts/base-costs.json' with { type: 'json' };
import { resolveRecipeProfile } from './privateRecipeProfiles.mjs';

const FIXED_PURCHASE_MEASURE_UNIT = {
  bean: 'bean',
  bottle: 'ml',
  box: 'box',
  bunch: 'bunch',
  container: 'oz',
  document: 'document',
  dozen: 'each',
  gallon: 'fl oz',
  head: 'each',
  hour: 'hour',
  jar: 'oz',
  lb: 'lb',
  loaf: 'loaf',
  log: 'oz',
  packet: 'packet',
  quart: 'fl oz',
  service: 'hour',
  sheet: 'sheet',
  trip: 'trip',
  tub: 'oz'
};

const MASS_TO_OUNCES = { oz: 1, lb: 16 };
const VOLUME_TO_FLUID_OUNCES = { tsp: 1 / 6, tbsp: 0.5, cup: 8, 'fl oz': 1 };
const EACH_ALIASES = new Set(['each', 'head', 'heads', 'set']);
const DIRECT_UNITS = new Set(['bean', 'box', 'bunch', 'document', 'hour', 'jar', 'loaf', 'packet', 'sheet', 'trip']);

const roundCurrency = (value) => Number(value.toFixed(2));
const roundUnitCost = (value) => Number(value.toFixed(4));
const parseQuantity = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeUnit = (unit) => unit?.toLowerCase().trim();

const buildUsageUnitsByIngredientCostId = (recipes) => {
  const unitsById = new Map();
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const existing = unitsById.get(ingredient.linked_ingredient_cost_id) ?? new Set();
      existing.add(normalizeUnit(ingredient.unit));
      unitsById.set(ingredient.linked_ingredient_cost_id, existing);
    }
  }
  return unitsById;
};

const inferPurchaseMeasureUnit = (costRecord, usageUnits) => {
  const normalizedPurchaseUnit = normalizeUnit(costRecord.purchase_unit);
  if (FIXED_PURCHASE_MEASURE_UNIT[normalizedPurchaseUnit]) {
    return FIXED_PURCHASE_MEASURE_UNIT[normalizedPurchaseUnit];
  }

  const usageUnitList = [...(usageUnits ?? [])];
  if (normalizedPurchaseUnit === 'bag' || normalizedPurchaseUnit === 'case') {
    if (usageUnitList.some((unit) => unit in MASS_TO_OUNCES)) return 'lb';
    if (usageUnitList.some((unit) => EACH_ALIASES.has(unit))) return 'each';
  }
  if (usageUnitList.some((unit) => unit in MASS_TO_OUNCES)) return 'lb';
  if (usageUnitList.some((unit) => unit in VOLUME_TO_FLUID_OUNCES)) return 'fl oz';
  if (usageUnitList.some((unit) => EACH_ALIASES.has(unit))) return 'each';
  return null;
};

const convertRecipeQuantityToPurchaseMeasure = (quantity, recipeUnit, purchaseMeasureUnit) => {
  const normalizedRecipeUnit = normalizeUnit(recipeUnit);
  const normalizedPurchaseUnit = normalizeUnit(purchaseMeasureUnit);

  if (normalizedRecipeUnit === normalizedPurchaseUnit) return quantity;
  if (normalizedRecipeUnit in MASS_TO_OUNCES && normalizedPurchaseUnit in MASS_TO_OUNCES) {
    return (quantity * MASS_TO_OUNCES[normalizedRecipeUnit]) / MASS_TO_OUNCES[normalizedPurchaseUnit];
  }
  if (normalizedRecipeUnit in VOLUME_TO_FLUID_OUNCES && normalizedPurchaseUnit in VOLUME_TO_FLUID_OUNCES) {
    return (quantity * VOLUME_TO_FLUID_OUNCES[normalizedRecipeUnit]) / VOLUME_TO_FLUID_OUNCES[normalizedPurchaseUnit];
  }
  if (normalizedPurchaseUnit === 'ml' && normalizedRecipeUnit in VOLUME_TO_FLUID_OUNCES) {
    return quantity * VOLUME_TO_FLUID_OUNCES[normalizedRecipeUnit] * 29.5735;
  }
  if (normalizedRecipeUnit === 'bottle' && normalizedPurchaseUnit === 'ml') return quantity * 750;
  if (normalizedRecipeUnit === 'jar' && normalizedPurchaseUnit === 'oz') return quantity * 8;
  if (EACH_ALIASES.has(normalizedRecipeUnit) && EACH_ALIASES.has(normalizedPurchaseUnit)) return quantity;
  if (DIRECT_UNITS.has(normalizedRecipeUnit) && normalizedRecipeUnit === normalizedPurchaseUnit) return quantity;
  return null;
};

const calculatePurchaseUnitCost = (costRecord) => {
  if (!Number.isFinite(costRecord.purchase_price) || !Number.isFinite(costRecord.purchase_quantity) || costRecord.purchase_quantity <= 0) {
    return null;
  }
  return costRecord.purchase_price / costRecord.purchase_quantity;
};

const calculateEdibleUnitCost = (costRecord, purchaseUnitCost) => {
  if (purchaseUnitCost == null) return null;
  if (Number.isFinite(costRecord.edible_unit_cost) && costRecord.edible_unit_cost > 0) {
    return costRecord.edible_unit_cost;
  }
  if (!Number.isFinite(costRecord.usable_yield_percent) || costRecord.usable_yield_percent <= 0) {
    return null;
  }
  return purchaseUnitCost / (costRecord.usable_yield_percent / 100);
};

const mergeRecipeWithResolvedProfile = (recipe) => {
  const profile = resolveRecipeProfile(recipe);
  if (!profile) return { ...recipe, resolved_profile_source: 'recipe-record' };
  return {
    ...recipe,
    yield_amount: profile.yield_amount,
    yield_unit: profile.yield_unit,
    portion_size: profile.portion_size,
    portion_unit: profile.portion_unit,
    ingredients: profile.ingredients,
    resolved_profile_source: 'phase-2-costing-profile',
    costing_profile_notes: profile.costing_notes
  };
};

const buildCostRecordIndex = (recipes, ingredientCosts) => {
  const usageUnitsByIngredientCostId = buildUsageUnitsByIngredientCostId(recipes);
  return new Map(
    ingredientCosts.map((costRecord) => {
      const purchaseUnitCost = calculatePurchaseUnitCost(costRecord);
      const edibleUnitCost = calculateEdibleUnitCost(costRecord, purchaseUnitCost);
      const usageUnits = usageUnitsByIngredientCostId.get(costRecord.id) ?? new Set();
      const purchaseMeasureUnit = inferPurchaseMeasureUnit(costRecord, usageUnits);
      return [
        costRecord.id,
        {
          ...costRecord,
          purchase_measure_unit: purchaseMeasureUnit,
          purchase_unit_cost: purchaseUnitCost == null ? null : roundUnitCost(purchaseUnitCost),
          edible_unit_cost: edibleUnitCost == null ? null : roundUnitCost(edibleUnitCost),
          edible_unit_cost_source:
            Number.isFinite(costRecord.edible_unit_cost) && costRecord.edible_unit_cost > 0
              ? 'provided-record'
              : edibleUnitCost == null
                ? 'missing-input'
                : 'derived-from-purchase-record'
        }
      ];
    })
  );
};

const costRecipeIngredient = (ingredient, costRecord, warnings) => {
  const recipeQuantity = parseQuantity(ingredient.quantity);
  if (recipeQuantity == null) {
    warnings.push(`Ingredient ${ingredient.ingredient_name} has a non-numeric quantity.`);
    return {
      ingredient_name: ingredient.ingredient_name,
      linked_ingredient_cost_id: ingredient.linked_ingredient_cost_id,
      recipe_quantity: ingredient.quantity,
      recipe_unit: ingredient.unit,
      status: 'incomplete',
      warning: 'Recipe quantity is not numeric.',
      cost_of_quantity_used: null
    };
  }

  if (!costRecord) {
    warnings.push(`Ingredient ${ingredient.ingredient_name} is missing a linked ingredient cost record.`);
    return {
      ingredient_name: ingredient.ingredient_name,
      linked_ingredient_cost_id: ingredient.linked_ingredient_cost_id,
      recipe_quantity: recipeQuantity,
      recipe_unit: ingredient.unit,
      status: 'missing-cost-record',
      warning: 'No matching ingredient cost record found.',
      cost_of_quantity_used: null
    };
  }

  if (!costRecord.purchase_measure_unit) {
    warnings.push(`Ingredient ${ingredient.ingredient_name} does not have a purchase measure unit conversion.`);
    return {
      ingredient_name: ingredient.ingredient_name,
      linked_ingredient_cost_id: ingredient.linked_ingredient_cost_id,
      recipe_quantity: recipeQuantity,
      recipe_unit: ingredient.unit,
      purchase_measure_unit: null,
      purchase_unit_cost: costRecord.purchase_unit_cost,
      edible_unit_cost: costRecord.edible_unit_cost,
      status: 'incomplete',
      warning: 'Purchase measure unit could not be inferred from the current data.',
      cost_of_quantity_used: null
    };
  }

  const normalizedRecipeQuantity = convertRecipeQuantityToPurchaseMeasure(recipeQuantity, ingredient.unit, costRecord.purchase_measure_unit);
  if (normalizedRecipeQuantity == null) {
    warnings.push(`Ingredient ${ingredient.ingredient_name} could not be converted from ${ingredient.unit} to ${costRecord.purchase_measure_unit}.`);
    return {
      ingredient_name: ingredient.ingredient_name,
      linked_ingredient_cost_id: ingredient.linked_ingredient_cost_id,
      recipe_quantity: recipeQuantity,
      recipe_unit: ingredient.unit,
      purchase_measure_unit: costRecord.purchase_measure_unit,
      purchase_unit_cost: costRecord.purchase_unit_cost,
      edible_unit_cost: costRecord.edible_unit_cost,
      status: 'incomplete',
      warning: `No conversion path from ${ingredient.unit} to ${costRecord.purchase_measure_unit}.`,
      cost_of_quantity_used: null
    };
  }

  if (costRecord.edible_unit_cost == null) {
    warnings.push(`Ingredient ${ingredient.ingredient_name} does not have enough purchase data to derive edible unit cost.`);
    return {
      ingredient_name: ingredient.ingredient_name,
      linked_ingredient_cost_id: ingredient.linked_ingredient_cost_id,
      recipe_quantity: recipeQuantity,
      recipe_unit: ingredient.unit,
      purchase_measure_unit: costRecord.purchase_measure_unit,
      purchase_unit_cost: costRecord.purchase_unit_cost,
      edible_unit_cost: null,
      status: 'incomplete',
      warning: 'Purchase price, purchase quantity, or usable yield percent is missing.',
      cost_of_quantity_used: null
    };
  }

  const costOfQuantityUsed = normalizedRecipeQuantity * costRecord.edible_unit_cost;
  return {
    ingredient_name: ingredient.ingredient_name,
    linked_ingredient_cost_id: ingredient.linked_ingredient_cost_id,
    recipe_quantity: recipeQuantity,
    recipe_unit: ingredient.unit,
    normalized_recipe_quantity: roundUnitCost(normalizedRecipeQuantity),
    purchase_measure_unit: costRecord.purchase_measure_unit,
    purchase_unit_cost: costRecord.purchase_unit_cost,
    edible_unit_cost: costRecord.edible_unit_cost,
    status: 'estimated',
    cost_of_quantity_used: roundCurrency(costOfQuantityUsed)
  };
};

export const generatePrivateRecipeCosting = () => {
  const sourceRecipes = recipesData.recipes.map(mergeRecipeWithResolvedProfile);
  const ingredientCosts = ingredientCostsData.ingredientCosts;
  const ingredientCostsById = buildCostRecordIndex(sourceRecipes, ingredientCosts);

  const enrichedRecipes = sourceRecipes.map((recipe) => {
    let totalCost = 0;
    let resolvedIngredientCount = 0;
    const warnings = [];

    const ingredient_cost_breakdown = recipe.ingredients.map((ingredient) => {
      const breakdown = costRecipeIngredient(ingredient, ingredientCostsById.get(ingredient.linked_ingredient_cost_id), warnings);
      if (breakdown.cost_of_quantity_used != null) {
        totalCost += breakdown.cost_of_quantity_used;
        resolvedIngredientCount += 1;
      }
      return breakdown;
    });

    const portionCount = recipe.portion_size > 0 ? recipe.yield_amount / recipe.portion_size : recipe.yield_amount;
    const estimatedTotalRecipeCost = roundCurrency(totalCost);
    const estimatedCostPerPortion = portionCount > 0 ? roundCurrency(totalCost / portionCount) : null;
    const allIngredientsAreOperationalPlaceholders = recipe.ingredients.every((ingredient) => ingredient.linked_ingredient_cost_id === 'notes');

    const costing_status = allIngredientsAreOperationalPlaceholders
      ? 'placeholder'
      : warnings.length > 0
        ? resolvedIngredientCount > 0
          ? 'incomplete'
          : 'placeholder'
        : 'estimated';

    return {
      ...recipe,
      estimated_total_recipe_cost: estimatedTotalRecipeCost,
      estimated_cost_per_portion: estimatedCostPerPortion,
      ingredient_cost_breakdown,
      costing_status,
      costing_notes: warnings.length > 0
        ? [...(recipe.costing_profile_notes ?? []), ...warnings]
        : [...(recipe.costing_profile_notes ?? []), 'Estimated from linked purchase records and usable yield percentages.'],
      costing_warning_count: warnings.length,
      last_costed: new Date().toISOString().slice(0, 10),
      portion_count: portionCount,
      costed_ingredient_count: resolvedIngredientCount,
      missing_cost_ingredient_count: ingredient_cost_breakdown.length - resolvedIngredientCount
    };
  });

  const summary = enrichedRecipes.map((recipe) => ({
    recipe_id: recipe.id,
    recipe_name: recipe.name,
    category: recipe.category,
    profile_source: recipe.resolved_profile_source,
    total_cost: recipe.estimated_total_recipe_cost,
    cost_per_portion: recipe.estimated_cost_per_portion,
    costing_status: recipe.costing_status,
    warning_count: recipe.costing_warning_count
  }));

  return {
    generated_at: new Date().toISOString(),
    source_versions: { privateRecipes: recipesData.version, ingredientCosts: ingredientCostsData.version },
    ingredient_costs: [...ingredientCostsById.values()],
    recipes: enrichedRecipes,
    summary
  };
};
