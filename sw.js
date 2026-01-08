/* 写作空间 - 极简 Service Worker（用于 PWA 安装与离线加载） */
const CACHE_NAME = 'write-space-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // 只处理 GET
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
