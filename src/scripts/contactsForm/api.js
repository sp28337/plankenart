export const submitContactForm = async (data, type) => {
  const apiUrl = import.meta.env.PUBLIC_API_BASE_URL
  const apiPathTest = import.meta.env.PUBLIC_NOTIFY_TEST_PATH
  const apiPathCalc = import.meta.env.PUBLIC_NOTIFY_CALC_PATH
  
  const apiPath = type === 'test' ? apiPathTest : apiPathCalc;

  if (!apiUrl) {
    throw new Error('API URL не задан')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  // trim fields before sending
  const payload = { ...data }
  for (const key in payload) {
    if (typeof payload[key] === 'string') {
      payload[key] = payload[key].trim()
    }
  }
  
  try {
    const response = await fetch(`${apiUrl}${apiPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Server error ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}
