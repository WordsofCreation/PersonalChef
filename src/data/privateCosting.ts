import privateRecipeCosting from '../generated/private-recipe-costing.json';

export type PrivateRecipeCostingSummary = (typeof privateRecipeCosting.summary)[number];
export type PrivateRecipeCostingRecord = (typeof privateRecipeCosting.recipes)[number];
export type PrivateIngredientCostingRecord = (typeof privateRecipeCosting.ingredient_costs)[number];
export type PrivateRecipeCostingStatusSummary = typeof privateRecipeCosting.summary_by_status;
export type PrivateRecipeCostingCategorySummary = (typeof privateRecipeCosting.summary_by_category)[number];

export const PRIVATE_RECIPE_COSTING_NOTE =
  'Internal costing output only. Do not render raw recipe or ingredient cost data on public-facing routes.';

export const privateRecipeCostingData = privateRecipeCosting;

export const getPrivateRecipeCostingById = (recipeId: string) =>
  privateRecipeCosting.recipes.find((recipe) => recipe.id === recipeId);

export const getPrivateRecipeCostingSummary = () => privateRecipeCosting.summary;
export const getPrivateRecipeCostingStatusSummary = () => privateRecipeCosting.summary_by_status;
export const getPrivateRecipeCostingCategorySummary = () => privateRecipeCosting.summary_by_category;

export const getIncompletePrivateRecipeCosting = () =>
  privateRecipeCosting.recipes.filter((recipe) => recipe.costing_status === 'incomplete');
