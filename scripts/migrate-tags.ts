// scripts/migrate-tags.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import * as yaml from "js-yaml";
import { TAG_ENTRIES, tagSeoData } from "../src/domain/tags/dictionary";

const TAGS_DIR = path.resolve("src/content/tags");
const CONTENT_DIRS = ["materials", "objects", "oils", "knowledge"].map((c) =>
  path.resolve("src/content", c),
);

// Поля из TAG_ENTRIES принадлежат к нескольким смысловым группам —
// определяем kind по тому, в каком SEO-хелпере тег фигурирует.
const woodSlugs = ["spruce", "larch", "pine", "caragach", "thermo-ash", "thermo-pine", "thermo-grab"];
const materialSlugs = ["architraves", "corners", "skirting-board", "planken-straight", "planken-angled", "deck-board", "terrace-board", "timber-imitation", "lining-shtil", "decorative", "double-fold", "glued-beam"];
const objectSlugs = ["terrace", "house", "garage", "fence", "bathhouse", "pool", "rest-zone", "barbecue", "sauna", "gazebo", "canopy", "facade"];

function kindOf(slug: string): "wood" | "material" | "object" | "style" {
  if (woodSlugs.includes(slug)) return "wood";
  if (materialSlugs.includes(slug)) return "material";
  if (objectSlugs.includes(slug)) return "object";
  return "style";
}

// 1. Генерируем YAML-файлы тегов
fs.mkdirSync(TAGS_DIR, { recursive: true });

for (const tag of TAG_ENTRIES) {
  const seo = tagSeoData[tag.slug];
  const data = {
    label: tag.ru,
    kind: kindOf(tag.slug),
    ...(seo ?? {}),
  };
  const filePath = path.join(TAGS_DIR, `${tag.slug}.yaml`);
  fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: -1 }), "utf-8");
}

console.log(`✓ Создано ${TAG_ENTRIES.length} файлов в src/content/tags/`);

// 2. Строим обратный словарь ru → slug для замены в frontmatter
const ruToSlug = Object.fromEntries(TAG_ENTRIES.map((t) => [t.ru, t.slug]));

function migrateValue(value: unknown): unknown {
  if (typeof value === "string" && ruToSlug[value]) return ruToSlug[value];
  if (Array.isArray(value)) return value.map(migrateValue);
  return value;
}

const FIELDS_TO_MIGRATE = ["tags", "materialType", "woodType", "objectTypes", "woodTypes", "materialTypes"];

for (const dir of CONTENT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdoc")) continue;
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    let changed = false;
    for (const field of FIELDS_TO_MIGRATE) {
      if (field in data) {
        const migrated = migrateValue(data[field]);
        if (JSON.stringify(migrated) !== JSON.stringify(data[field])) {
          data[field] = migrated;
          changed = true;
        }
      }
    }

    if (changed) {
      // ВАЖНО: gray-matter/js-yaml сотрёт закомментированные строки в frontmatter —
      // проверь файлы с закомментированными полями вручную после прогона (см. заметку в проекте).
      const updated = matter.stringify(content, data);
      fs.writeFileSync(filePath, updated, "utf-8");
      console.log(`✓ Мигрирован: ${path.relative(process.cwd(), filePath)}`);
    }
  }
}

console.log("Готово. Проверь git diff перед коммитом — особенно файлы с закомментированными полями.");