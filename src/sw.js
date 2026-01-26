const CACHE_NAME = "emergensee-v1";

const ASSETS = [
  "/index2",
  "/style.css",
  "/app.js",
  "/model/model.json",
  "/model/weights.bin",
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0",
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js",
  "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});
