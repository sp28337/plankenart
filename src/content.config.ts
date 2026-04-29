import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const materials = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/materials" }),
  schema: ({ image }) => z.object({
    metaTitle:       z.string().max(60),
    metaDescription: z.string().max(160),

    title:           z.string(),
    name:            z.string(),
    excerpt:         z.string(),
    description:     z.string(),
    advantages:      z.array(z.string()),
    application:     z.array(z.string()),

    relatedObjects:  z.array(reference("objects")),
    materialType:    z.string(),
    woodType:        z.string(),
    tags:            z.array(z.string()).optional(),
    objectTypes:     z.array(z.string()).optional(),

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
    metaTitle:         z.string().max(60),
    metaDescription:   z.string().max(160),
    title:             z.string(),
    excerpt:           z.string(),
    description:       z.string(),
    technicalFeatures: z.array(z.string()).optional(),
    conclusion:        z.string().optional(),
    tags:              z.array(z.string()),

    objectTypes:       z.array(z.string()),
    woodTypes:         z.array(z.string()),
    materialTypes:     z.array(z.string()),
    materials:         z.array(reference("materials")),
    usedOils:          z.array(z.object({
      surface:           z.string().optional(), // Название поверхности
      code:              z.array(z.string()),
      oil:               reference('oils'),
    })).optional(),

    sortOrder:         z.number().default(99),
    imageAlt:          z.string().optional(),
    coverImage:        image(),
    heroImage:         image(),
    heroImageMobile:   image(),
    images:            z.array(image()),
  }),
});

const oils = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/content/oils" }),
  schema: ({ image }) => z.object({
    metaTitle:       z.string().max(60),
    metaDescription: z.string().max(160),
    brand:           z.string(),
    label:           z.string().optional(),
    title:           z.string(),
    titleRu:         z.string(),
    excerpt:         z.string().optional(),
    description:     z.string().optional(),
    advantagers:     z.array(z.string()),
    relatedObjects:  z.array(reference('objects')),
    tags:            z.array(z.string()),
    colors:          z.array(z.object({
      code:            z.string(),
      name:            z.string(),
      image:           image(),
    })),
    coverImage:      image(),
  }),
});

export const collections = { 
  materials,
  objects,
  oils,
};