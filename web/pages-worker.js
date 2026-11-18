// Give a static host the headers needed by Emscripten's pthreads, and serve
// user-selected files from their tab using the same HTTP interface as web_serve.py.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

const localRoot = new URL('local-files/', self.registration.scope);
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (url.origin !== localRoot.origin) return;
  if (url.pathname.startsWith(localRoot.pathname)) {
    event.respondWith(serveLocal(request, url.pathname.slice(localRoot.pathname.length)));
    return;
  }
  if (url.href.startsWith(self.registration.scope)) {
    event.respondWith(fetch(request).then(response => {
      if (response.status === 0) return response; // preserve opaque redirects
      return isolated(response.body, response);
    }));
  }
});

function isolated(body, { status, statusText, headers }) {
  const h = new Headers(headers);
  h.set('Cross-Origin-Opener-Policy', 'same-origin');
  h.set('Cross-Origin-Embedder-Policy', 'require-corp');
  h.set('Cross-Origin-Resource-Policy', 'same-origin');
  return new Response(body, { status, statusText, headers: h });
}

function askTab(id, path) {
  return new Promise(resolve => {
    // The random ID in the URL selects the tab holding the files. Keep no
    // state here so reads still work after the browser restarts this worker.
    const channel = new BroadcastChannel(`mc3-pages:${id}`), request = crypto.randomUUID();
    const done = blob => { clearTimeout(timer); channel.close(); resolve(blob); };
    const timer = setTimeout(() => done(null), 5000);
    channel.onmessage = ({ data }) => {
      if (data?.reply === request) done(data.blob);
    };
    channel.postMessage({ request, path });
  });
}

async function serveLocal(request, path) {
  const headers = { 'Cache-Control': 'no-store' };
  const reply = (status, body = null) => isolated(body, { status, headers });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    headers.Allow = 'GET, HEAD';
    return reply(405);
  }
  const match = /^([0-9a-f-]{36})\/(.+)$/.exec(path);
  if (!match) return reply(404);
  let rel;
  try { rel = decodeURIComponent(match[2]).replace(/^disc\/\//, 'disc/'); }
  catch { return reply(400); }
  const blob = await askTab(match[1], rel);
  if (!(blob instanceof Blob)) return reply(404);
  headers['Content-Type'] = rel.startsWith('module/') && rel.endsWith('.js') ? 'text/javascript' :
    rel.startsWith('module/') && rel.endsWith('.wasm') ? 'application/wasm' : blob.type || 'application/octet-stream';
  headers['Accept-Ranges'] = 'bytes';
  headers['Content-Length'] = String(blob.size);
  const range = request.headers.get('Range');
  if (request.method === 'HEAD') return reply(200);
  if (!range) return reply(200, blob);

  const [, first, last] = /^bytes=(\d*)-(\d*)$/.exec(range) ?? [];
  const start = first ? Number(first) : Math.max(0, blob.size - Number(last));
  const end = first && last ? Math.min(Number(last) + 1, blob.size) : blob.size;
  if (!(start < end)) {
    headers['Content-Range'] = `bytes */${blob.size}`;
    headers['Content-Length'] = '0';
    return reply(416);
  }
  headers['Content-Range'] = `bytes ${start}-${end - 1}/${blob.size}`;
  headers['Content-Length'] = String(end - start);
  return reply(206, blob.slice(start, end));
}
