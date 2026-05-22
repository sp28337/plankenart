export const TAG_ENTRIES = [
  { ru: 'наличники', slug: 'architraves' },
  { ru: 'уголки', slug: 'corners' },
  { ru: 'плинтус', slug: 'skirting-board' },
  { ru: 'интерьер', slug: 'interior' },
  { ru: 'экстерьер', slug: 'exterior' },
  { ru: 'ель', slug: 'spruce' },
  { ru: 'лиственница', slug: 'larch' },
  { ru: 'сосна', slug: 'pine' },
  { ru: 'карагач', slug: 'caragach' },
  { ru: 'термоясень', slug: 'thermo-ash' },
  { ru: 'термососна', slug: 'thermo-pine' },
  { ru: 'термограб', slug: 'thermo-grab' },
  { ru: 'разные породы', slug: 'mixed' },
  { ru: 'тёмное дерево', slug: 'dark-wood' },
  { ru: 'терраса', slug: 'terrace' },
  { ru: 'дом', slug: 'house' },
  { ru: 'гараж', slug: 'garage' },
  { ru: 'забор', slug: 'fence' },
  { ru: 'баня', slug: 'bathhouse' },
  { ru: 'бассейн', slug: 'pool' },
  { ru: 'зона отдыха', slug: 'rest-zone' },
  { ru: 'барбекю', slug: 'barbecue' },
  { ru: 'сауна', slug: 'sauna' },
  { ru: 'беседка', slug: 'gazebo' },
  { ru: 'навес', slug: 'canopy' },
  { ru: 'фасад', slug: 'facade' },
  { ru: 'двойной фальц', slug: 'double-fold' },
  { ru: 'фахверк', slug: 'fachwerk' },
  { ru: 'норвежский лафет', slug: 'norwegian-laft' },
  { ru: 'кровля ПВХ', slug: 'krovlya-pvkh' },
  { ru: 'клееный брус', slug: 'glued-beam' },
  { ru: 'планкен прямой', slug: 'planken-straight' },
  { ru: 'планкен скошенный', slug: 'planken-angled' },
  { ru: 'палубная доска', slug: 'deck-board' },
  { ru: 'террасная доска', slug: 'terrace-board' },
  { ru: 'имитация бруса', slug: 'timber-imitation' },
  { ru: 'вагонка штиль', slug: 'lining-shtil' },
  { ru: 'декор', slug: 'decorative' }
] as const;

export type TagSlug = (typeof TAG_ENTRIES)[number]['slug'];
export type TagLabel = (typeof TAG_ENTRIES)[number]['ru'];

export const ruToSlug = Object.fromEntries(TAG_ENTRIES.map((t) => [t.ru, t.slug])) as Record<TagLabel, TagSlug>;
export const slugToRu = Object.fromEntries(TAG_ENTRIES.map((t) => [t.slug, t.ru])) as Record<TagSlug, TagLabel>;

export const tagsDictionary: Record<string, string> = ruToSlug;
export const tagsTitleDictionary: Record<string, string> = slugToRu;
