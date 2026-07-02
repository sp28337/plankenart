export const KNOWLEDGE_CATEGORIES = [
  { slug: 'materials',    label: 'Материалы',             icon: '' },
  { slug: 'profiles',     label: 'Профили доски',         icon: '' },
  { slug: 'finishing',    label: 'Обработка и покраска',  icon: '' },
  { slug: 'installation', label: 'Монтаж',                icon: '' },
  { slug: 'maintenance',  label: 'Уход и обновление',     icon: '' },
] as const;

export type KnowledgeCategorySlug = (typeof KNOWLEDGE_CATEGORIES)[number]['slug'];

export const categoryBySlug = Object.fromEntries(
  KNOWLEDGE_CATEGORIES.map((c) => [c.slug, c]),
) as Record<KnowledgeCategorySlug, (typeof KNOWLEDGE_CATEGORIES)[number]>;
