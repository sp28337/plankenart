import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const materials = defineCollection({
    loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/materials" }),
    schema: ({ image }) => z.object({
      // SEO
      metaTitle:       z.string().max(60),
      metaDescription: z.string().max(160),
  
      // Контент
      title:       z.string(),
      excerpt:     z.string(),
      description: z.string(),
      advantages:  z.array(z.string()),
      application: z.string(),
  
      // Таксономия (питает фильтр)
      materialType: z.enum([
        "планкен-прямой",
        "планкен-скошенный",
        "палубная-доска",
        "террасная-доска",
        "имитация-бруса",
        "вагонка-штиль",
        "декоративные-изделия",
      ]),
      woodType: z.enum([
        "лиственница",
        "термоясень",
        "сосна",
        "ель",
        "разные-породы",
      ]),
      tags: z.array(z.string()),
  
      // Применение
      isExterior: z.boolean().default(false),
      isInterior: z.boolean().default(false),
  
      // UI
      sortOrder: z.number().default(99),
      coverImageAlt: z.string().optional(),
      coverImage: image(),
      heroImage: image()
    }),
});

export const collections = { materials };