import { formatPhoneNumber } from './phoneFormatter'
import { validateForm } from './validation'
import { submitContactForm } from './api'
import { 
  showMessage, 
  hideMessage, 
  clearErrors, 
  displayErrors, 
  setButtonLoading 
} from './ui'

const forms = document.querySelectorAll('.contact-form')
let lastSubmitTimes = new Map()

forms.forEach(form => {
  const type = form.dataset.formType
  const phoneInput = form.querySelector('[name="phone"]')
  const messageDiv = form.querySelector('.form-message')
  const submitButton = form.querySelector('button[type="submit"]')

  phoneInput?.addEventListener('input', (e) => {
    e.target.value = formatPhoneNumber(e.target.value)
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    hideMessage(messageDiv)
    clearErrors(form)

    const now = Date.now()
    const lastSubmitTime = lastSubmitTimes.get(form) || 0
    if (now - lastSubmitTime < 3000) {
      showMessage(messageDiv, 'Подождите немного перед следующей отправкой', 'error')
      return
    }
    lastSubmitTimes.set(form, now)

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    // Make sure consent is captured as boolean
    data.consent = formData.has('consent')
    data.formType = type

    const errors = validateForm(data, type)

    if (Object.keys(errors).length > 0) {
      displayErrors(form, errors)
      showMessage(messageDiv, 'Исправьте ошибки в форме', 'error')
      return
    }

    setButtonLoading(submitButton, true)

    try {
      await submitContactForm(data, type)
      showMessage(messageDiv, 'Мы скоро свяжемся с вами!', 'success')
      form.reset()
    } catch (error) {
      console.error(`Error submitting ${type} form:`, error)
      showMessage(messageDiv, 'Сервис временно недоступен', 'error')
    } finally {
      setButtonLoading(submitButton, false)
    }
  })

  document.querySelectorAll('[data-stop-prop]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
})
