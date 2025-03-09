const CACHE_NAME = "my-cache-v2";
const urlsToCache = [
  "index.html",
  "style.css",
  "app.js",
  "newpage.html",
  "indexeddb.js",
  "IndexedDB/manifest.json",
  "IndexedDB/icon-192x192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map((url) =>
          fetch(url)
            .then((response) => {
              if (!response.ok) {
                console.warn(`❌ تخطي الكاش لـ: ${url} (استجابة غير صالحة)`);
                return;
              }
              return cache.put(url, response);
            })
            .catch((err) => {
              console.warn(`❌ فشل تحميل: ${url}`, err);
            })
        )
      );
    })
  );
});

// تشغيل التطبيق بدون إنترنت
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request)); // تحميل الصفحة الرئيسية مباشرة بدون كاش
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// تحديث الكاش عند تغيير الملفات
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
