export const submitContactForm = async (formData) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `Server error ${response.status}`);
    }

    return { success: true, message: data.message };

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Превышено время ожидания ответа');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};