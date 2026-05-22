/**
 * Серверный прокси для форм обратной связи.
 *
 * ВАЖНО: для работы этого endpoint в продакшне нужен адаптер.
 * Установите нужный адаптер под ваш хостинг:
 *
 *   Node.js:    npx astro add node        (+ standalone: true в astro.config.mjs)
 *   Vercel:     npx astro add vercel
 *   Netlify:    npx astro add netlify
 *   Cloudflare: npx astro add cloudflare
 *
 * В dev-режиме (`astro dev`) работает без адаптера.
 *
 * Переменные окружения (БЕЗ префикса PUBLIC_ — не попадут в браузер):
 *   API_BASE_URL=https://your-backend.example.com
 *   NOTIFY_TEST_PATH=/api/notify/test
 *   NOTIFY_CALC_PATH=/api/notify/calc
 */

export const prerender = false;

import type { APIRoute } from 'astro';

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Простой in-memory rate limiter: не более 3 отправок в минуту с одного IP.
// Для production с несколькими инстансами — замените на Redis.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_MAX) return true;
  entry.count++;
  return false;
}

// ─── Validation ───────────────────────────────────────────────────────────────
const PHONE_RE = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;

function str(val: FormDataEntryValue | null): string {
  return val?.toString().trim() ?? '';
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const json = (msg: string, status: number) =>
    new Response(JSON.stringify({ message: msg }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  // Rate limit
  if (isRateLimited(clientAddress ?? 'unknown')) {
    return json('Слишком много запросов. Подождите минуту.', 429);
  }

  // Parse
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json('Неверный формат запроса', 400);
  }

  const name     = str(data.get('name'));
  const phone    = str(data.get('phone'));
  const consent  = data.get('consent') === 'on';
  const formType = str(data.get('formType'));

  if (name.length < 2)       return json('Укажите имя (минимум 2 символа)', 400);
  if (!PHONE_RE.test(phone)) return json('Неверный формат телефона', 400);
  if (!consent)              return json('Необходимо согласие на обработку данных', 400);

  // Валидация по типу формы
  if (formType === 'test') {
    if (!str(data.get('articles')))  return json('Укажите артикул масла', 400);
    if (!str(data.get('wood_sort'))) return json('Укажите сорт дерева', 400);
  } else if (formType === 'calc') {
    const area = Number(str(data.get('area')));
    if (!area || area <= 0 || !isFinite(area)) return json('Укажите корректную площадь', 400);
  } else {
    return json('Неизвестный тип формы', 400);
  }

  // Env vars (приватные — не попадут в браузер)
  const apiUrl  = import.meta.env.API_BASE_URL;
  const apiPath = formType === 'test'
    ? import.meta.env.NOTIFY_TEST_PATH
    : import.meta.env.NOTIFY_CALC_PATH;

  if (!apiUrl || !apiPath) {
    console.error('[contact] Missing env vars: API_BASE_URL or NOTIFY_*_PATH');
    return json('Ошибка конфигурации сервера', 500);
  }

  // Собираем payload — только нужные поля, никакого consent в payload
  const payload: Record<string, string> = { name, phone, formType };
  for (const key of ['articles', 'wood_sort', 'area', 'article']) {
    const val = str(data.get(key));
    if (val) payload[key] = val;
  }

  // Прокси-запрос к внешнему API
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${apiUrl}${apiPath}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    });

    if (!response.ok) {
      console.error(`[contact] External API error: ${response.status}`);
      return json('Сервис временно недоступен', 502);
    }

    return json('Мы скоро свяжемся с вами!', 200);

  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return json('Сервис не ответил вовремя', 504);
    }
    console.error('[contact] Fetch error:', err);
    return json('Сервис временно недоступен', 502);

  } finally {
    clearTimeout(timeout);
  }
};