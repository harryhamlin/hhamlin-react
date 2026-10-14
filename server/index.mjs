import { createServer } from 'node:http';
import { loadEnvFile } from 'node:process';
import { createRecommendationHandler } from './handler.mjs';

try { loadEnvFile('.env'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const handle = createRecommendationHandler({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
  model: process.env.CLAUDE_MODEL,
  allowedOrigins: process.env.COPENHAGEN_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean),
});
const port = Number(process.env.PORT || process.env.API_PORT || 8787);
const server = createServer(async (req, res) => {
  if (req.url?.split('?')[0] !== '/api/copenhagen/recommend') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found.' }));
    return;
  }
  const controller = new AbortController();
  res.on('close', () => { if (!res.writableEnded) controller.abort(); });
  try {
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 32768) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'The question is too large.' }));
        return;
      }
      chunks.push(chunk);
    }
    const request = new Request(`http://localhost:${port}${req.url}`, {
      method: req.method, headers: req.headers, signal: controller.signal,
      ...(['GET', 'HEAD'].includes(req.method) ? {} : { body: Buffer.concat(chunks) }),
    });
    const response = await handle(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Recommendations are temporarily unavailable.' }));
  }
});
server.requestTimeout = 100000;
server.listen(port, () => console.log(`Copenhagen recommendation API listening on port ${port}.`));
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Stop the existing API before restarting.` : 'Could not start the recommendation API.');
  process.exitCode = 1;
});
const stop = () => { server.closeAllConnections(); server.close(); };
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
