import recipesData from '../../src/content/privateRecipes/menu-builder-recipes.json' with { type: 'json' };
import ingredientCostsData from '../../src/content/ingredientCosts/base-costs.json' with { type: 'json' };

const FIXED_PURCHASE_MEASURE_UNIT = {
  bottle: 'ml',
  box: 'packet',
  bunch: 'bunch',
  container: 'oz',
  document: 'document',
  dozen: 'each',
  gallon: 'fl oz',
  jar: 'oz',
  lb: 'lb',
  loaf: 'loaf',
  log: 'oz',
  quart: 'fl oz',
  sheet: 'sheet',
  tub: 'oz',
  bean: 'bean'
};

const MASS_TO_OUNCES = {
  oz: 1,
  lb: 16
};

const VOLUME_TO_FLUID_OUNCES = {
  tbsp: 0.5,
  'fl oz': 1
};

const COUNT_UNIT_ALIASES = {
  each: 'each',
  head: 'each',
  heads: 'each',
  set: 'each',
  packet: 'packet',
  bunch: 'bunch',
  bean: 'bean',
  document: 'document',
  loaf: 'loaf',
  sheet: 'sheet',
  'service-plan': 'document'
};

const roundCurrency = (value) => Number(value.toFixed(2));
const roundUnitCost = (value) => Number(value.toFixed(4));

const parseQuantity = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const buildUsageUnitsByIngredientCostId = (recipes) => {
  const unitsById = new Map();

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const existing = unitsById.get(ingredient.linked_ingredient_cost_id) ?? new Set();
      existing.add(ingredient.unit);
      unitsById.set(ingredient.linked_ingredient_cost_id, existing);
    }
  }

  return unitsById;
};

const inferPurchaseMeasureUnit = (costRecord, usageUnits) => {
  if (FIXED_PURCHASE_MEASURE_UNIT[costRecord.purchase_unit]) {
    return FIXED_PURCHASE_MEASURE_UNIT[costRecord.purchase_unit];
  }

  const usageUnitList = [...(usageUnits ?? [])];
  const usesMass = usageUnitList.some((unit) => unit in MASS_TO_OUNCES);
  const usesCount = usageUnitList.some((unit) => unit in COUNT_UNIT_ALIASES);

  if (costRecord.purchase_unit === 'bag') {
    if (usesMass) return 'lb';
    if (usesCount) return 'each';
  }

  if (costRecord.purchase_unit === 'case') {
    if (usesMass) return 'lb';
    if (usesCount) return 'each';
  }

  if (costRecord.purchase_unit === 'flat') {
    return usageUnitList.includes('flat') ? 'flat' : null;
  }

  return null;
};

const convertRecipeQuantityToPurchaseMeasure = (quantity, recipeUnit, purchaseMeasureUnit) => {
  if (recipeUnit === purchaseMeasureUnit) {
    return quantity;
  }

  if (recipeUnit in MASS_TO_OUNCES && purchaseMeasureUnit in MASS_TO_OUNCES) {
    return (quantity * MASS_TO_OUNCES[recipeUnit]) / MASS_TO_OUNCES[purchaseMeasureUnit];
  }

  if (recipeUnit in VOLUME_TO_FLUID_OUNCES && purchaseMeasureUnit in VOLUME_TO_FLUID_OUNCES) {
    return (quantity * VOLUME_TO_FLUID_OUNCES[recipeUnit]) / VOLUME_TO_FLUID_OUNCES[purchaseMeasureUnit];
  }

  if (purchaseMeasureUnit === 'ml' && recipeUnit in VOLUME_TO_FLUID_OUNCES) {
    return quantity * VOLUME_TO_FLUID_OUNCES[recipeUnit] * 29.5735;
  }

  if (recipeUnit === 'bottle' && purchaseMeasureUnit === 'ml') {
    return quantity;
  }

  const normalizedRecipeUnit = COUNT_UNIT_ALIASES[recipeUnit];
  const normalizedPurchaseUnit = COUNT_UNIT_ALIASES[purchaseMeasureUnit];

  if (normalizedRecipeUnit && normalizedRecipeUnit === normalizedPurchaseUnit) {
    return quantity;
  }

  return null;
};

const calculatePurchaseUnitCost = (costRecord) => {
  if (!Number.isFinite(costRecord.purchase_price) || !Number.isFinite(costRecord.purchase_quantity) || costRecord.purchase_quantity <= 0) {
    return null;
  }

  return costRecord.purchase_price / costRecord.purchase_quantity;
};

const calculateEdibleUnitCost = (costRecord, purchaseUnitCost) => {
  if (purchaseUnitCost == null || !Number.isFinite(costRecord.usable_yield_percent) || costRecord.usable_yield_percent <= 0) {
    return null;
  }

  return purchaseUnitCost / (costRecord.usable_yield_percent / 100);
};

export const generatePrivateRecipeCosting = () => {
  const recipes = recipesData.recipes;
  const ingredientCosts = ingredientCostsData.ingredientCosts;
  const usageUnitsByIngredientCostId = buildUsageUnitsByIngredientCostId(recipes);
  const ingredientCostsById = new Map(
    ingredientCosts.map((costRecord) => {
      const purchaseUnitCost = calculatePurchaseUnitCost(costRecord);
      const derivedEdibleUnitCost = calculateEdibleUnitCost(costRecord, purchaseUnitCost);
      const usageUnits = usageUnitsByIngredientCostId.get(costRecord.id) ?? new Set();
      const purchaseMeasureUnit = inferPurchaseMeasureUnit(costRecord, usageUnits);

      return [
        costRecord.id,
        {
          ...costRecord,
          purchase_measure_unit: purchaseMeasureUnit,
          purchase_unit_cost: purchaseUnitCost == null ? null : roundUnitCost(purchaseUnitCost),
          derived_edible_unit_cost: derivedEdibleUnitCost == null ? null : roundUnitCost(derivedEdibleUnitCost),
          edible_unit_cost_source: derivedEdibleUnitCost == null ? 'missing-input' : 'derived-from-purchase-record'
        }
      ];
    })
  );

  const enrichedRecipes = recipes.map((recipe) => {
    let totalCost = 0;
    let resolvedIngredientCount = 0;
    const warnings = [];

    const ingredient_cost_breakdown = recipe.ingredients.map((ingredient) => {
      const recipeQuantity = parseQuantity(ingredient.quantity);
      const costRecord = ingredientCostsById.get(ingredient.linked_ingredient_cost_id);

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
          edible_unit_cost: costRecord.derived_edible_unit_cost,
          status: 'incomplete',
          warning: 'Purchase measure unit could not be inferred from the current data.',
          cost_of_quantity_used: null
        };
      }

      const normalizedRecipeQuantity = convertRecipeQuantityToPurchaseMeasure(
        recipeQuantity,
        ingredient.unit,
        costRecord.purchase_measure_unit
      );

      if (normalizedRecipeQuantity == null) {
        warnings.push(`Ingredient ${ingredient.ingredient_name} could not be converted from ${ingredient.unit} to ${costRecord.purchase_measure_unit}.`);
        return {
          ingredient_name: ingredient.ingredient_name,
          linked_ingredient_cost_id: ingredient.linked_ingredient_cost_id,
          recipe_quantity: recipeQuantity,
          recipe_unit: ingredient.unit,
          purchase_measure_unit: costRecord.purchase_measure_unit,
          purchase_unit_cost: costRecord.purchase_unit_cost,
          edible_unit_cost: costRecord.derived_edible_unit_cost,
          status: 'incomplete',
          warning: `No conversion path from ${ingredient.unit} to ${costRecord.purchase_measure_unit}.`,
          cost_of_quantity_used: null
        };
      }

      if (costRecord.derived_edible_unit_cost == null) {
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

      const costOfQuantityUsed = normalizedRecipeQuantity * costRecord.derived_edible_unit_cost;
      totalCost += costOfQuantityUsed;
      resolvedIngredientCount += 1;

      return {
        ingredient_name: ingredient.ingredient_name,
        linked_ingredient_cost_id: ingredient.linked_ingredient_cost_id,
        recipe_quantity: recipeQuantity,
        recipe_unit: ingredient.unit,
        normalized_recipe_quantity: roundUnitCost(normalizedRecipeQuantity),
        purchase_measure_unit: costRecord.purchase_measure_unit,
        purchase_unit_cost: costRecord.purchase_unit_cost,
        edible_unit_cost: costRecord.derived_edible_unit_cost,
        status: 'estimated',
        cost_of_quantity_used: roundCurrency(costOfQuantityUsed)
      };
    });

    const portionCount = recipe.portion_size > 0 ? recipe.yield_amount / recipe.portion_size : recipe.yield_amount;
    const estimatedTotalRecipeCost = roundCurrency(totalCost);
    const estimatedCostPerPortion = portionCount > 0 ? roundCurrency(totalCost / portionCount) : null;
    const hasWarnings = warnings.length > 0;
    const allIngredientsAreOperationalPlaceholders = recipe.ingredients.every(
      (ingredient) => ingredient.linked_ingredient_cost_id === 'notes'
    );
    const costing_status = allIngredientsAreOperationalPlaceholders
      ? 'placeholder'
      : hasWarnings
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
      costing_notes: hasWarnings
        ? warnings
        : ['Estimated from linked purchase records and usable yield percentages.'],
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
    total_cost: recipe.estimated_total_recipe_cost,
    cost_per_portion: recipe.estimated_cost_per_portion,
    costing_status: recipe.costing_status,
    warning_count: recipe.costing_warning_count
  }));

  return {
    generated_at: new Date().toISOString(),
    source_versions: {
      privateRecipes: recipesData.version,
      ingredientCosts: ingredientCostsData.version
    },
    ingredient_costs: [...ingredientCostsById.values()],
    recipes: enrichedRecipes,
    summary
  };
};
