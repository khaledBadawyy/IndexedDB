const CACHE_NAME = "pwa-cache-v1";
const FILES_TO_CACHE = [
  "index.html",
  "style.css",
  "indexeddb.js",
  "app.js",
  "IndexedDB/manifest.json",
];

// تثبيت الـ Service Worker وتخزين الملفات في الكاش
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// تشغيل التطبيق حتى بدون إنترنت
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// تحديث الكاش عند تغيير الملفات
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
