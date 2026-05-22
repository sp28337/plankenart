// @ts-nocheck
import { formatPhoneNumber } from '@domain/contact/phone';
import { validateForm }      from '@domain/contact/validation';
import { submitContactForm } from '@infrastructure/api/contact.client';
import { showMessage, hideMessage, clearErrors, displayErrors, setButtonLoading } from './ui.js';

// Дедупликация отправок — хранится вне initForms, сбрасывается при перезагрузке страницы
const lastSubmitTimes = new Map();

/**
 * Инициализирует все формы, которые ещё не были инициализированы.
 * Вызывается как при первой загрузке, так и после каждой view-transition навигации.
 */
function initForms() {
  // Ищем только ещё не инициализированные формы.
  // data-initialized живёт на DOM-элементе — после навигации через
  // view transitions элемент пересоздаётся, атрибута нет → инициализируем снова.
  const forms = document.querySelectorAll('.contact-form:not([data-initialized])');

  forms.forEach((form) => {
    form.dataset.initialized = 'true';

    const type         = form.dataset.formType;
    const phoneInput   = form.querySelector('[name="phone"]');
    const messageDiv   = form.querySelector('.form-message');
    const submitButton = form.querySelector('button[type="submit"]');

    // Форматирование телефона в реальном времени
    phoneInput?.addEventListener('input', (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    });

    // Блокируем всплытие с внутренних ссылок (политика, пользовательское соглашение)
    form.querySelectorAll('[data-stop-prop]').forEach((el) => {
      el.addEventListener('click', (e) => e.stopPropagation());
    });

    form.addEventListener('submit', async (e) => {
      // Перехватываем нативный submit — работаем через fetch
      e.preventDefault();

      hideMessage(messageDiv);
      clearErrors(form);

      // Защита от двойного клика (2 секунды между отправками)
      const now = Date.now();
      const lastSubmit = lastSubmitTimes.get(form) ?? 0;
      if (now - lastSubmit < 2_000) {
        showMessage(messageDiv, 'Подождите немного', 'error');
        return;
      }
      lastSubmitTimes.set(form, now);

      // Собираем FormData — все поля формы включая hidden input formType
      const formData = new FormData(form);

      // Клиентская валидация — быстрая обратная связь для пользователя
      // Дополнительно валидирует сервер в /api/contact
      const validationData = {
        name:      formData.get('name')?.toString().trim()  ?? '',
        phone:     formData.get('phone')?.toString().trim() ?? '',
        consent:   formData.has('consent'),
        articles:  formData.get('articles')?.toString().trim(),
        wood_sort: formData.get('wood_sort')?.toString().trim(),
        area:      formData.get('area')?.toString().trim(),
      };

      const errors = validateForm(validationData, type);

      if (Object.keys(errors).length > 0) {
        displayErrors(form, errors);
        showMessage(messageDiv, 'Исправьте ошибки', 'error');
        return;
      }

      setButtonLoading(submitButton, true);

      try {
        // FormData уходит напрямую — браузер сам ставит Content-Type
        const result = await submitContactForm(formData);
        showMessage(messageDiv, result.message, 'success');
        form.reset();
      } catch (error) {
        // Сообщение из ошибки уже на русском (приходит с сервера)
        const msg = error?.message ?? 'Сервис временно недоступен';
        showMessage(messageDiv, msg, 'error');
      } finally {
        setButtonLoading(submitButton, false);
      }
    });
  });
}

// ─── Точки входа ─────────────────────────────────────────────────────────────

// Покрывает навигацию через View Transitions (каждый переход на новую страницу)
document.addEventListener('astro:page-load', initForms);

// Покрывает первую загрузку страницы (до astro:page-load)
initForms();