document.addEventListener('click', (event) => {
  const isClickInsideFAQ = event.target.closest('details')

  if (!isClickInsideFAQ) {
    document.querySelectorAll('details[open]').forEach((details) => {
      details.removeAttribute('open')
    })
  }
})