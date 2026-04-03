import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
 
export type Material = CollectionEntry<"materials">;

export async function getAllMaterials(): Promise<Material[]> {
  const items = await getCollection("materials");
  return items.sort((a, b) => a.data.sortOrder - b.data.sortOrder);
}
 
export async function getRelatedMaterials(
  currentId: string,
  materialType: string,
  limit = 3,
): Promise<Material[]> {
  const all = await getAllMaterials();
  return all
    // .filter((m) => m.id !== currentId && m.data.materialType === materialType)
    .slice(0, limit);
}
 