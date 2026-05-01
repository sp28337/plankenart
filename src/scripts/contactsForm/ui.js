export const showMessage = (messageDiv, text, type) => {
  if (!messageDiv) return;
  messageDiv.textContent = text
  messageDiv.className = `form-message px-4 py-2 h-12.5 rounded-[20px] text-center text-sm flex gap-4 
                          font-inter justify-center items-center text-[20px] uppercase
                          w-full font-bold bg-red-300
                          transition-all duration-500 mx-auto tracking-tighter
                          ${
                            type === 'success'
                              ? 'border border-emerald-300 text-gradient-success'
                              : 'border border-red-300 text-gradient-error'
                          }`
  messageDiv.classList.remove('hidden')
}

export const hideMessage = (messageDiv) => {
  if (!messageDiv) return;
  messageDiv.classList.add('hidden')
}

export const clearErrors = (form) => {
  form.querySelectorAll('.error-msg').forEach((el) => {
    el.classList.add('hidden')
    el.textContent = ''
  })
}

export const displayErrors = (form, errors) => {
  for (const [field, errorMsg] of Object.entries(errors)) {
    const errorEl = form.querySelector(`.${field}Error`)
    if (errorEl) {
      errorEl.textContent = errorMsg
      errorEl.classList.remove('hidden')
    }
  }
}

export const setButtonLoading = (button, isLoading) => {
  if (!button) return;
  const span = button.querySelector('span');
  if (isLoading) {
    button.disabled = true
    if (span) span.textContent = '⏳ Отправляется...'
  } else {
    button.disabled = false
    if (span) span.textContent = 'Отправить заявку'
  }
}
