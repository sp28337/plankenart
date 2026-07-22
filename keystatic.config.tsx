// keystatic.config.tsx
import { config, fields, collection } from '@keystatic/core';

const env = import.meta.env.PUBLIC_ENV ?? 'development';

export default config({
  locale: 'ru-RU',
  storage: env === 'production'
    ? {
        kind: 'github',
        repo: { owner: 'sp28337', name: 'plankenart' },
      }
    : { kind: 'local' },
  ui: {
    brand: {
      name: 'ПланкенАрт',
      mark: ({ colorScheme }) => {
        let path = colorScheme === 'dark'
          ? 'https://plankenart.ru/favicon.ico'
          : 'https://plankenart.ru/favicon.ico';
        
        return <img src={path} height={24} />
      },
    },
  },

  collections: {

    knowledge: collection({
      label: 'База знаний',
      path: 'src/content/knowledge/*',
      slugField: 'title',
      columns: ['title', 'publishDate', 'updatedDate'],
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        metaTitle: fields.text({ label: 'Мета заголовок', validation: { length: { max: 70 } } }),
        metaDescription: fields.text({ label: 'Мета описание', validation: { length: { max: 170 } } }),
        excerpt: fields.text({ label: 'Краткое описание', multiline: true }),
        category: fields.select({
          label: 'Категория',
          options: [
            { label: 'Материалы', value: 'materials' },
            { label: 'Профили доски', value: 'profiles' },
            { label: 'Обработка и покраска', value: 'finishing' },
            { label: 'Монтаж', value: 'installation' },
            { label: 'Уход и обновление', value: 'maintenance' },
          ],
          defaultValue: 'materials',
        }),
        tags: fields.multiRelationship({ label: 'Теги', collection: 'tags' }),
        publishDate: fields.date({ label: 'Дата публикации', defaultValue: { kind: 'today' } }),
        updatedDate: fields.date({ label: 'Дата обновления' }),
        sortOrder: fields.integer({ label: 'Порядок сортировки', defaultValue: 99 }),
        coverImage: fields.image({ label: 'Фото обложки', directory: 'src/assets/knowledge/', publicPath: '@assets/knowledge/' }),
        content: fields.markdoc({ label: 'Текст статьи' }),
      },
    }),

    materials: collection({
      label: 'Материалы',
      path: 'src/content/materials/*',
      slugField: 'title',
      columns: ['title'],
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        metaTitle: fields.text({ label: 'Мета заголовок', validation: { length: { max: 70 } } }),
        metaDescription: fields.text({ label: 'Мета описание', validation: { length: { max: 170 } } }),
        name: fields.text({ label: 'Название (короткое)' }),
        excerpt: fields.text({ label: 'Краткое описание', multiline: true }),
        description: fields.text({ label: 'Описание', multiline: true }),
        advantages: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Преимущества',
          itemLabel: (props) => props.value || 'Пункт',
        }),
        application: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Применение',
          itemLabel: (props) => props.value || 'Пункт',
        }),
        relatedObjects: fields.multiRelationship({
          label: 'Связанные объекты',
          collection: 'objects',
        }),
        materialType: fields.text({ label: 'Тип материала (напр. "планкен прямой")' }),
        woodType: fields.text({ label: 'Порода дерева (напр. "сосна")' }),
        tags: fields.multiRelationship({ label: 'Теги', collection: 'tags' }),
        objectTypes: fields.array(fields.text({ label: 'Тип объекта' }), { 
          label: 'Типы объектов',
          itemLabel: (props) => props.value || 'Тип объекта'
        }),
        isExterior: fields.checkbox({ label: 'Экстерьер', defaultValue: false }),
        isInterior: fields.checkbox({ label: 'Интерьер', defaultValue: false }),
        sortOrder: fields.integer({ label: 'Порядок сортировки', defaultValue: 99 }),
        imageAlt: fields.text({ label: 'Alt изображения' }),
        coverImage: fields.image({ label: 'Фото обложки', directory: 'src/assets/materials', publicPath: '@assets/materials/' }),
        heroImage: fields.image({ label: 'Главное фото', directory: 'src/assets/materials/', publicPath: '@assets/materials/' }),
        heroImageMobile: fields.image({ label: 'Главное фото (mobile)', directory: 'src/assets/materials/', publicPath: '@assets/materials/' }),
        content: fields.markdoc({ label: 'Дополнительный текст (после описания)' }),
      },
    }),

    objects: collection({
      label: 'Объекты',
      path: 'src/content/objects/*',
      slugField: 'title',
      columns: ['title'],
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        metaTitle: fields.text({ label: 'Мета заголовок', validation: { length: { max: 70 } } }),
        metaDescription: fields.text({ label: 'Мета описание', validation: { length: { max: 170 } } }),
        excerpt: fields.text({ label: 'Краткое описание', multiline: true }),
        description: fields.text({ label: 'Описание', multiline: true }),
        technicalFeatures: fields.array(fields.text({ label: 'Пункт' }), { label: 'Технические особенности' }),
        conclusion: fields.text({ label: 'Заключение', multiline: true }),
        
        tags: fields.multiRelationship({ label: 'Теги', collection: 'tags' }),
        objectTypes: fields.array(fields.relationship({ label: 'Тип объекта', collection: 'tags' }), { label: 'Типы объектов' }),
        woodTypes: fields.array(fields.relationship({ label: 'Порода дерева', collection: 'tags' }), { label: 'Породы древесины' }),
        materialTypes: fields.array(fields.relationship({ label: 'Тип материала', collection: 'tags' }), { label: 'Типы материалов' }),
                
        materials: fields.multiRelationship({ label: 'Материалы', collection: 'materials' }),
        usedOils: fields.array(
          fields.object({
            surface: fields.text({ label: 'Поверхность (необязательно)' }),
            code: fields.array(fields.text({ label: 'Код цвета' }), { label: 'Коды цветов' }),
            oil: fields.relationship({ label: 'Масло', collection: 'oils' }),
          }),
          { label: 'Использованные масла', itemLabel: (props) => props.fields.oil.value || 'Масло' },
        ),
        sortOrder: fields.integer({ label: 'Порядок сортировки', defaultValue: 99 }),
        imageAlt: fields.text({ label: 'Alt изображения' }),
        coverImage: fields.image({ label: 'Фото обложки', directory: 'src/assets/objects', publicPath: '@assets/objects/' }),
        heroImage: fields.image({ label: 'Главное фото', directory: 'src/assets/objects', publicPath: '@assets/objects/' }),
        heroImageMobile: fields.image({ label: 'Главное фото (mobile)', directory: 'src/assets/objects', publicPath: '@assets/objects/' }),
        images: fields.array(
          fields.image({ label: 'Фото', directory: 'src/assets/objects', publicPath: '@assets/objects/' }),
          { label: 'Галерея' },
        ),
        content: fields.markdoc({ label: 'Дополнительный текст' }),
      },
    }),

    oils: collection({
      label: 'Масла',
      path: 'src/content/oils/*',
      slugField: 'title',
      columns: ['title'],
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        metaTitle: fields.text({ label: 'Мета заголовок', validation: { length: { max: 70 } } }),
        metaDescription: fields.text({ label: 'Мета описание', validation: { length: { max: 170 } } }),
        brand: fields.text({ label: 'Бренд' }),
        label: fields.text({ label: 'Подзаголовок (label)' }),
        titleRu: fields.text({ label: 'Название на русском' }),
        excerpt: fields.text({ label: 'Краткое описание', multiline: true }),
        description: fields.text({ label: 'Описание', multiline: true }),
        category: fields.select({
          label: 'Категория',
          options: [
            { label: 'Интерьер', value: 'interior' },
            { label: 'Экстерьер', value: 'exterior' },
          ],
          defaultValue: 'interior',
        }),
        advantages: fields.array(fields.text({ label: 'Пункт' }), { 
          label: 'Преимущества',
          itemLabel: (props) => props.value || 'Преимущества',
        }),
        relatedObjects: fields.multiRelationship({ label: 'Связанные объекты', collection: 'objects' }),
        tags: fields.multiRelationship({ label: 'Теги', collection: 'tags' }),
        colors: fields.array(
          fields.object({
            code: fields.text({ label: 'Код' }),
            name: fields.text({ label: 'Название' }),
            image: fields.image({ label: 'Изображение', directory: 'src/assets/oils', publicPath: '@assets/oils/' }),
          }),
          { label: 'Цвета', itemLabel: (props) => props.fields.code.value || 'Цвет' },
        ),
        coverImage: fields.image({ label: 'Фото обложки', directory: 'src/assets/oils', publicPath: '@assets/oils/' }),
        content: fields.markdoc({ label: 'Текст (необязательно)' }),
      },
    }),

    tags: collection({
      label: 'Теги',
      path: 'src/content/tags/*',
      slugField: 'label',
      columns: ['label', 'kind'],
      schema: {
        label: fields.slug({ name: { label: 'Название (рус.)' } }),
        kind: fields.select({
          label: 'Тип тега',
          options: [
            { label: 'Порода дерева', value: 'wood' },
            { label: 'Тип материала', value: 'material' },
            { label: 'Тип объекта', value: 'object' },
            { label: 'Стиль/категория', value: 'style' },
          ],
          defaultValue: 'style',
        }),
        h1: fields.text({ label: 'H1 страницы тега' }),
        metaTitle: fields.text({ label: 'Meta Title' }),
        metaDescription: fields.text({ label: 'Meta Description' }),
      },
    }),

    // legal: collection({
    //   label: 'Юридические документы',
    //   path: 'src/content/legal/*',
    //   slugField: 'slug',
    //   columns: ['title'],
    //   format: { contentField: 'content' },
    //   schema: {
    //     title: fields.text({ label: 'Заголовок' }),
    //     slug: fields.slug({ name: { label: 'Slug' } }),
    //     metaTitle: fields.text({ label: 'Мета заголовок', validation: { length: { max: 70 } } }),
    //     metaDescription: fields.text({ label: 'Мета описание', validation: { length: { max: 170 } } }),
    //     lastUpdated: fields.date({ label: 'Дата обновления', defaultValue: { kind: 'today' } }),
    //     content: fields.markdoc({ label: 'Текст документа' }),
    //   },
    // }),

    // photos: collection({
    //   label: 'Фото',
    //   path: 'src/assets/photos/*',
    //   slugField: 'title',
    //   schema: {
    //     title: fields.slug({ name: { label: 'Название' } }),
    //     image: fields.image({
    //       label: 'Файл изображения',
    //       directory: 'src/assets/photos',
    //       publicPath: '/src/assets/photos/',
    //     }),
    //   },
    // }),
  },
});