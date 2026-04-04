import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const materials = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/materials" }),
  schema: ({ image }) => z.object({
    metaTitle:       z.string().max(60),
    metaDescription: z.string().max(160),

    title:       z.string(),
    excerpt:     z.string(),
    description: z.string(),
    advantages:  z.array(z.string()),
    application: z.string(),

    relatedObjects: z.array(reference("objects")),
    materialType: reference("materialTypes"),
    woodType: reference("woodTypes"),
    tags: z.array(z.string()),

    sortOrder: z.number().default(99),
    imageAlt: z.string().optional(),
    coverImage: image(),
    heroImage: image()
  }),
});

const objects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/objects" }),
  schema: ({ image }) => z.object({
    metaTitle:       z.string().max(60),
    metaDescription: z.string().max(160),
    title:       z.string(),
    excerpt:     z.string(),
    description: z.string(),
    objectType:  reference("objectTypes"),
    woodTypes: z.array(reference("woodTypes")),
    materialTypes: z.array(reference("materialTypes")),
    sortOrder: z.number().default(99),
    imageAlt: z.string().optional(),
    heroImage: image(),
    images: z.array(image()),
  }),
});

const woodTypes = defineCollection({
  loader: file("src/content/woodTypes.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

const objectTypes = defineCollection({
  loader: file("src/content/objectTypes.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

const materialTypes = defineCollection({
  loader: file("src/content/materialTypes.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

export const collections = { 
  materials,
  objects,
  woodTypes,
  objectTypes,
  materialTypes,
};