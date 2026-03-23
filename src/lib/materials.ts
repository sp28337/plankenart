import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
 
export type Material = CollectionEntry<"materials">;
 
// ── Словари ──────────────────────────────────────────────────────────────────
 
export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  "планкен-прямой":        "планкен прямой",
  "планкен-скошенный":     "планкен скошенный",
  "палубная-доска":        "палубная доска",
  "террасная-доска":       "террасная доска",
  "имитация-бруса":        "имитация бруса",
  "вагонка-штиль":         "вагонка штиль",
  "декоративные-изделия":  "декоративные изделия",
};
 
export const WOOD_TYPE_LABELS: Record<string, string> = {
  "лиственница":   "лиственница",
  "термоясень":    "термоясень",
  "сосна":         "сосна",
  "ель":           "ель",
  "разные-породы": "разные породы",
};
 
export const WOOD_TYPE_DESCRIPTIONS: Record<string, string> = {
  "лиственница":
    "Наиболее прочная хвойная порода России. Природная биостойкость без химической обработки, плотность 500–650 кг/м³.",
  "термоясень":
    "Ясень после термомодификации при 180–215 °C. Тёмный цвет, сниженное влагопоглощение, максимальная биостойкость.",
  "сосна":
    "Доступная хвойная порода с природной смолистостью. Золотистый цвет, тёплая текстура.",
  "ель":
    "Светлая однородная порода с минимальным количеством сучков. Фитонциды улучшают микроклимат.",
  "разные-породы":
    "Изготавливается из той же породы, что и основная облицовка — для идеального совпадения цвета.",
};
 
// ── Запросы ───────────────────────────────────────────────────────────────────
 
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
    .filter((m) => m.id !== currentId && m.data.materialType === materialType)
    .slice(0, limit);
}
 
export async function getUniqueMaterialTypes(): Promise<string[]> {
  const all = await getAllMaterials();
  const seen = new Set<string>();
  const result: string[] = [];
  for (const m of all) {
    if (!seen.has(m.data.materialType)) {
      seen.add(m.data.materialType);
      result.push(m.data.materialType);
    }
  }
  return result;
}
 
export async function getUniqueWoodTypes(): Promise<string[]> {
  const all = await getAllMaterials();
  const seen = new Set<string>();
  const result: string[] = [];
  for (const m of all) {
    const w = m.data.woodType;
    if (w !== "разные-породы" && !seen.has(w)) {
      seen.add(w);
      result.push(w);
    }
  }
  return result;
}
 
// ── Хелперы ───────────────────────────────────────────────────────────────────
 
export const getMaterialTypeLabel = (t: string) =>
  MATERIAL_TYPE_LABELS[t] ?? t;
 
export const getWoodTypeLabel = (w: string) =>
  WOOD_TYPE_LABELS[w] ?? w;
 
export const getMaterialUrl = (m: Material) => `/catalog/${m.id}`;
 