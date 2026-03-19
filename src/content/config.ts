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

const serviceAreas = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    highlights: z.array(z.string())
  })
});

export const collections = { services, menus, testimonials, faqs, serviceAreas };
