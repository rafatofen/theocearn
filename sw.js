/* ═══════════════════════════════════════════════════════
   VILLA OCEARN — sw.js  (Service Worker / Cache)
   Caches shell + assets on install.
   Network-first for HTML, cache-first for assets/images.
   ═══════════════════════════════════════════════════════ */

const CACHE = 'villa-ocearn-v1';

const SHELL = [
  '/',
  '/index.html',
  '/about.html',
  '/the-villa.html',
  '/location.html',
  '/enquire.html',
  '/assets/main.css',
  '/assets/components.js',
];

/* Install: pre-cache shell */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

/* Activate: delete old caches */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Fetch strategy */
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  /* Skip non-GET and cross-origin CDN images (let browser handle) */
  if (request.method !== 'GET') return;
  if (url.hostname.includes('gillesdemunter.com')) return;
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) return;

  /* HTML: network-first */
  if (request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then(res => { caches.open(CACHE).then(c => c.put(request, res.clone())); return res; })
        .catch(() => caches.match(request))
    );
    return;
  }

  /* CSS/JS/fonts: cache-first */
  e.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(res => {
      caches.open(CACHE).then(c => c.put(request, res.clone()));
      return res;
    }))
  );
});
