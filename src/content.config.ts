import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { KNOWLEDGE_CATEGORIES } from "./domain/knowledge/categories";

const tags = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/tags" }),
  schema: z.object({
    tag: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const objectTypes = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/objectTypes" }),
  schema: z.object({
    tag: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const woodTypes = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/woodTypes" }),
  schema: z.object({
    tag: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const materialTypes = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/materialTypes" }),
  schema: z.object({
    tag: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const materials = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/materials" }),
  schema: ({ image }) => z.object({
    metaTitle:       z.string().max(70),
    metaDescription: z.string().max(170),
    title:           z.string(),
    name:            z.string(),
    excerpt:         z.string(),
    description:     z.string(),
    advantages:      z.array(z.string()),
    application:     z.array(z.string()),
    relatedObjects:  z.array(reference("objects")),
    materialType:    reference("materialTypes"),
    woodType:        reference("woodTypes"),
    tags:            z.array(reference("tags")).optional(),
    objectTypes:     z.array(reference("objectTypes")).optional(),
    sortOrder:       z.number().default(99),
    imageAlt:        z.string().optional(),
    coverImage:      image(),
    heroImage:       image(),
    heroImageMobile: image(),
  }),
});

const objects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/objects" }),
  schema: ({ image }) => z.object({
    metaTitle:         z.string().max(70),
    metaDescription:   z.string().max(170),
    title:             z.string(),
    excerpt:           z.string(),
    description:       z.string(),
    technicalFeatures: z.array(z.string()).optional(),
    conclusion:        z.string().optional(),
    tags:              z.array(reference("tags")),
    objectTypes:       z.array(reference("objectTypes")),
    woodTypes:         z.array(reference("woodTypes")),
    materialTypes:     z.array(reference("materialTypes")),
    materials:         z.array(reference("materials")),
    usedOils:          z.array(z.object({
      surface: z.string().optional(),
      code:    z.array(z.string()),
      oil:     reference('oils'),
    })).optional(),
    sortOrder:       z.number().default(99),
    imageAlt:        z.string().optional(),
    coverImage:      image(),
    heroImage:       image(),
    heroImageMobile: image(),
    images:          z.array(image()),
  }),
});

const oils = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/oils" }),
  schema: ({ image }) => z.object({
    metaTitle:       z.string().max(70),
    metaDescription: z.string().max(170),
    brand:           z.string(),
    label:           z.string().optional(),
    title:           z.string(),
    titleRu:         z.string(),
    excerpt:         z.string().optional(),
    description:     z.string().optional(),
    category:        z.enum(['interior', 'exterior']),
    advantages:      z.array(z.string()),
    relatedObjects:  z.array(reference('objects')),
    tags:            z.array(reference("tags")),
    colors:          z.array(z.object({
      code:  z.string(),
      name:  z.string(),
      image: image(),
    })),
    coverImage: image(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/legal" }),
  schema: z.object({
    title:           z.string(),
    metaTitle:       z.string().max(70),
    metaDescription: z.string().max(170),
    lastUpdated:     z.string(),
  }),
});

const knowledge = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/knowledge" }),
  schema: ({ image }) => z.object({
    metaTitle:       z.string().max(70),
    metaDescription: z.string().max(170),
    title:           z.string(),
    excerpt:         z.string(),
    category:        z.enum(KNOWLEDGE_CATEGORIES.map((c) => c.slug) as [string, ...string[]]),
    // tags:            z.array(reference("tags")).optional(),
    publishDate:     z.date(),
    updatedDate:     z.date().optional(),
    sortOrder:       z.number().default(99),
    coverImage:      image(),
  }),
});

export const collections = { 
  tags,
  objectTypes,
  woodTypes,
  materialTypes,
  materials,
  objects,
  oils,
  legal,
  knowledge,
};