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

// ── SEO data for tag pages ──────────────────────────────────────────────────

interface TagSeoData {
  /** H1 displayed on the page */
  h1: string;
  /** <title> tag — max 60 chars */
  metaTitle: string;
  /** <meta name="description"> — max 160 chars */
  metaDescription: string;
}

// Wood types — порода дерева
const woodSeo = (ru: string, ruGenit: string): TagSeoData => ({
  h1: `${ru} — шлифовка и покрытие маслом`,
  metaTitle: `${ru} — обработка маслом OSMO | ПланкенАрт`,
  metaDescription: `Примеры обработки ${ruGenit} маслом OSMO. Шлифовка, защита и покрытие изделий из ${ruGenit} в Нижнем Новгороде.`,
});

// Material types — тип изделия
const materialSeo = (ru: string, ruGenit: string): TagSeoData => ({
  h1: `${ru} — шлифовка и покрытие маслом OSMO`,
  metaTitle: `${ru} — обработка маслом OSMO | ПланкенАрт`,
  metaDescription: `${ru}: шлифовка и покрытие маслом OSMO. Примеры работ, материалы и объекты с использованием ${ruGenit}.`,
});

// Object types — тип объекта
const objectSeo = (ru: string, ruGenit: string): TagSeoData => ({
  h1: `${ru} — обработка дерева маслом OSMO`,
  metaTitle: `${ru} — шлифовка и покрытие маслом | ПланкенАрт`,
  metaDescription: `Обработка деревянных поверхностей для ${ruGenit}. Примеры объектов, материалы и масла OSMO в Нижнем Новгороде.`,
});

// Style/category — стиль или категория
const styleSeo = (ru: string, desc: string): TagSeoData => ({
  h1: `${ru} — проекты и материалы`,
  metaTitle: `${ru} — проекты ПланкенАрт | Нижний Новгород`,
  metaDescription: desc,
});

export const tagSeoData: Record<string, TagSeoData> = {
  // Породы дерева
  'spruce':       woodSeo('Ель', 'ели'),
  'larch':        woodSeo('Лиственница', 'лиственницы'),
  'pine':         woodSeo('Сосна', 'сосны'),
  'caragach':     woodSeo('Карагач', 'карагача'),
  'thermo-ash':   woodSeo('Термоясень', 'термоясеня'),
  'thermo-pine':  woodSeo('Термососна', 'термососны'),
  'thermo-grab':  woodSeo('Термограб', 'термограба'),
  'mixed':        styleSeo('Разные породы', 'Проекты с использованием нескольких пород дерева. Шлифовка и покрытие маслом OSMO в Нижнем Новгороде.'),
  'dark-wood':    styleSeo('Тёмное дерево', 'Тёмные тонировки OSMO для дерева. Объекты и материалы с тёмным покрытием маслом в Нижнем Новгороде.'),

  // Типы изделий
  'architraves':      materialSeo('Наличники', 'наличников'),
  'corners':          materialSeo('Уголки', 'уголков'),
  'skirting-board':   materialSeo('Плинтус', 'плинтуса'),
  'planken-straight': materialSeo('Планкен прямой', 'прямого планкена'),
  'planken-angled':   materialSeo('Планкен скошенный', 'скошенного планкена'),
  'deck-board':       materialSeo('Палубная доска', 'палубной доски'),
  'terrace-board':    materialSeo('Террасная доска', 'террасной доски'),
  'timber-imitation': materialSeo('Имитация бруса', 'имитации бруса'),
  'lining-shtil':     materialSeo('Вагонка штиль', 'вагонки штиль'),
  'decorative':       materialSeo('Декор', 'декоративных элементов'),
  'double-fold':      materialSeo('Двойной фальц', 'двойного фальца'),
  'glued-beam':       materialSeo('Клееный брус', 'клееного бруса'),

  // Типы объектов
  'terrace':    objectSeo('Терраса', 'террас'),
  'house':      objectSeo('Дом', 'домов'),
  'garage':     objectSeo('Гараж', 'гаражей'),
  'fence':      objectSeo('Забор', 'заборов'),
  'bathhouse':  objectSeo('Баня', 'бань'),
  'pool':       objectSeo('Бассейн', 'бассейнов'),
  'rest-zone':  objectSeo('Зона отдыха', 'зон отдыха'),
  'barbecue':   objectSeo('Барбекю', 'барбекю-зон'),
  'sauna':      objectSeo('Сауна', 'саун'),
  'gazebo':     objectSeo('Беседка', 'беседок'),
  'canopy':     objectSeo('Навес', 'навесов'),
  'facade':     objectSeo('Фасад', 'фасадов'),

  // Стили и категории
  'interior':       styleSeo('Интерьер', 'Обработка дерева для интерьера маслом OSMO. Примеры внутренней отделки в Нижнем Новгороде.'),
  'exterior':       styleSeo('Экстерьер', 'Обработка дерева для экстерьера маслом OSMO. Фасады, террасы и наружная отделка в Нижнем Новгороде.'),
  'fachwerk':       styleSeo('Фахверк', 'Обработка фахверковых конструкций маслом OSMO. Шлифовка и покрытие фахверка в Нижнем Новгороде.'),
  'norwegian-laft': styleSeo('Норвежский лафет', 'Обработка норвежского лафета маслом OSMO. Шлифовка и покрытие срубов в Нижнем Новгороде.'),
  'krovlya-pvkh':   styleSeo('Кровля ПВХ', 'Проекты с кровлей ПВХ. Объекты и материалы ПланкенАрт в Нижнем Новгороде.'),
};
