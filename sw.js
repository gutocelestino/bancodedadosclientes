const CACHE_NAME = "carteira-pwa-v5";
const APP_SCOPE = self.registration.scope;
const APP_ROOT = new URL("./", APP_SCOPE);

const APP_FILES = [
  APP_ROOT.href,
  new URL("index.html", APP_ROOT).href,
  new URL("manifest.json", APP_ROOT).href,
  new URL("favicon.svg", APP_ROOT).href,
  new URL("pwa-192.png", APP_ROOT).href,
  new URL("pwa-512.png", APP_ROOT).href,
  new URL("apple-touch-icon.png", APP_ROOT).href
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_FILES.map(async url => {
      try {
        const response = await fetch(new Request(url, { cache: "no-store" }));
        if (response.ok) await cache.put(url, response.clone());
      } catch (error) {
        // A instalação continua mesmo quando algum recurso não está disponível.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter(name => name.startsWith("carteira-pwa-") && name !== CACHE_NAME)
        .map(name => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const scopePath = new URL(APP_SCOPE).pathname;
  if (!url.pathname.startsWith(scopePath)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      // Sempre tenta a versão publicada mais recente primeiro.
      const fresh = await fetch(new Request(request, { cache: "no-store" }));
      if (fresh.ok) {
        await cache.put(request, fresh.clone());

        if (request.mode === "navigate") {
          await cache.put(APP_ROOT.href, fresh.clone());
          await cache.put(new URL("index.html", APP_ROOT).href, fresh.clone());
        }
      }
      return fresh;
    } catch (error) {
      // A cópia local é apenas um recurso de contingência sem internet.
      const cached = await cache.match(request);

      if (cached) return cached;

      if (request.mode === "navigate") {
        const home = await cache.match(APP_ROOT.href);
        if (home) return home;

        const index = await cache.match(new URL("index.html", APP_ROOT).href);
        if (index) return index;

        return new Response(
          "Você está sem conexão. Conecte-se à internet para acessar sua Carteira.",
          { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
      }

      return Response.error();
    }
  })());
});
