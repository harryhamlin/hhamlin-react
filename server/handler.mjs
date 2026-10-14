import { recommend, RecommendationError } from './recommend.mjs';

const defaultOrigins = ['https://www.hhamlin.com', 'https://hhamlin.com', 'http://localhost:3000', 'http://127.0.0.1:3000'];

// Portable Web Request/Response handler; no framework or hosting dependency.
export function createRecommendationHandler({
  apiKey, model, fetchImpl, allowedOrigins = defaultOrigins,
  hourlyLimit = 30, concurrencyLimit = 2, clock = () => Date.now(),
} = {}) {
  let active = 0;
  let requests = [];
  const json = (body, status, origin) => new Response(JSON.stringify(body), {
    status, headers: {
      'Content-Type': 'application/json', 'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff', Vary: 'Origin',
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
    },
  });
  return async (request) => {
    const origin = request.headers.get('origin');
    if (origin && !allowedOrigins.includes(origin)) return json({ error: 'This site cannot use the recommendation service.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: {
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin',
    } });
    if (request.method !== 'POST') return json({ error: 'Use POST for recommendations.' }, 405, origin);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'Send a JSON question.' }, 415, origin);
    if (Number(request.headers.get('content-length')) > 32768) return json({ error: 'The question is too large.' }, 413, origin);
    let payload;
    try {
      const body = await request.text();
      if (new TextEncoder().encode(body).byteLength > 32768) return json({ error: 'The question is too large.' }, 413, origin);
      payload = JSON.parse(body);
    } catch { return json({ error: 'Send a valid question.' }, 400, origin); }
    requests = requests.filter((time) => clock() - time < 3600000);
    if (requests.length >= hourlyLimit || active >= concurrencyLimit) return json({ error: 'The recommendation service is busy. Please try again later.' }, 429, origin);
    active++;
    // Limit paid calls without counting invalid input or an unset key.
    if (apiKey && typeof payload?.question === 'string' && payload.question.trim() && payload.question.length <= 2000) requests.push(clock());
    try {
      return json(await recommend(payload, { apiKey, model, fetchImpl, signal: AbortSignal.any([request.signal, AbortSignal.timeout(90000)]) }), 200, origin);
    } catch (error) {
      return json({ error: error instanceof RecommendationError ? error.message : 'Recommendations are temporarily unavailable.' }, error.status || 500, origin);
    } finally { active--; }
  };
}
