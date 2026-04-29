export const validateForm = (data, type) => {
  const errors = {}

  if (!data.name?.trim()) {
    errors.name = 'Пожалуйста, введите Ваше имя'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа'
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Пожалуйста, введите номер телефона'
  } else if (!/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(data.phone.trim())) {
    errors.phone = 'Формат: +7 (XXX) XXX-XX-XX'
  }

  // if (!data.email?.trim()) {
  //   errors.email = 'Пожалуйста, введите Email'
  // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
  //   errors.email = 'Неверный формат Email'
  // }

  if (!data.consent) {
    errors.consent = 'Пожалуйста, подтвердите согласие на обработку данных'
  }

  if (type === 'test') {
    if (!data.articles?.trim()) {
      errors.articles = 'Пожалуйста, укажите артикул(ы) масла'
    }
    if (!data.wood_sort?.trim()) {
      errors.wood_sort = 'Пожалуйста, укажите сорт дерева'
    }
  }

  if (type === 'calc') {
    if (!data.area?.trim()) {
      errors.area = 'Пожалуйста, укажите площадь обработки'
    } else if (isNaN(Number(data.area.trim())) || Number(data.area.trim()) <= 0) {
      errors.area = 'Укажите корректную площадь'
    }
  }

  return errors
}
