import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    benefits: z.array(z.string()),
    idealFor: z.string(),
    cta: z.string(),
    seoKeyword: z.string()
  })
});

const menus = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    courses: z.array(z.object({
      name: z.string(),
      items: z.array(z.string())
    }))
  })
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    location: z.string(),
    quote: z.string(),
    service: z.string(),
    rating: z.number().min(1).max(5)
  })
});

const faqs = defineCollection({
  type: 'data',
  schema: z.object({
    question: z.string(),
    answer: z.string()
  })
});


const privateRecipes = defineCollection({
  type: 'data',
  schema: z.object({
    version: z.number(),
    recipes: z.array(z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      subcategory: z.string(),
      published: z.literal(false),
      menu_builder_label: z.string(),
      menu_builder_mapping: z.object({
        section: z.string(),
        builder_value: z.string(),
        category_value: z.string().nullable().optional()
      }),
      yield_amount: z.number(),
      yield_unit: z.string(),
      portion_size: z.number(),
      portion_unit: z.string(),
      ingredients: z.array(z.object({
        ingredient_name: z.string(),
        quantity: z.union([z.string(), z.number()]),
        unit: z.string(),
        linked_ingredient_cost_id: z.string(),
        prep_state: z.string(),
        optional_flag: z.boolean()
      })),
      prep_notes: z.string(),
      dietary_tags: z.array(z.string()),
      costing_status: z.enum(['placeholder-estimate', 'needs-review', 'approved']),
      estimated_total_recipe_cost: z.number(),
      estimated_cost_per_portion: z.number(),
      notes: z.string()
    }))
  })
});

const ingredientCosts = defineCollection({
  type: 'data',
  schema: z.object({
    version: z.number(),
    ingredientCosts: z.array(z.object({
      id: z.string(),
      ingredient_name: z.string(),
      vendor: z.string(),
      purchase_unit: z.string(),
      purchase_quantity: z.number(),
      purchase_price: z.number(),
      usable_yield_percent: z.number(),
      edible_unit_cost: z.number(),
      last_updated: z.string(),
      notes: z.string()
    }))
  })
});

const menuBuilderMappings = defineCollection({
  type: 'data',
  schema: z.object({
    version: z.number(),
    description: z.string(),
    sections: z.record(z.string(), z.any()),
    future_notes: z.array(z.string())
  })
});

const serviceAreas = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    highlights: z.array(z.string())
  })
});

export const collections = { services, menus, testimonials, faqs, serviceAreas, privateRecipes, ingredientCosts, menuBuilderMappings };
