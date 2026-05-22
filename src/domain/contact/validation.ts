// @ts-nocheck
/**
 * Клиентская валидация форм.
 *
 * Ключи объекта errors должны совпадать с CSS-классами вида `${key}Error`
 * в FeedbackForm.astro, чтобы displayErrors() нашёл нужный <p> элемент.
 *
 * test-форма:  name, phone, consent, articles, wood_sort
 * calc-форма:  name, phone, consent, area, article (необязательное)
 */
export const validateForm = (data, type) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Пожалуйста, введите Ваше имя';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Пожалуйста, введите номер телефона';
  } else if (!/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(data.phone.trim())) {
    errors.phone = 'Формат: +7 (XXX) XXX-XX-XX';
  }

  if (!data.consent) {
    errors.consent = 'Пожалуйста, подтвердите согласие на обработку данных';
  }

  if (type === 'test') {
    // Ключ: articles → класс articlesError (было oilArticleError — не совпадало!)
    if (!data.articles?.trim()) {
      errors.articles = 'Пожалуйста, укажите артикул(ы) масла';
    }
    if (!data.wood_sort?.trim()) {
      errors.wood_sort = 'Пожалуйста, укажите сорт дерева';
    }
  }

  if (type === 'calc') {
    // Ключ: area → класс areaError (было treatmentAreaError — не совпадало!)
    if (!data.area?.trim()) {
      errors.area = 'Пожалуйста, укажите площадь обработки';
    } else if (isNaN(Number(data.area.trim())) || Number(data.area.trim()) <= 0) {
      errors.area = 'Укажите корректную площадь';
    }
  }

  return errors;
};