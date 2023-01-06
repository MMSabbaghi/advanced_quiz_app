const cacheName = "advancedQuizAppCache";
const assetsToCache = [
  "/",
  "/global.js",
  "/index.html",
  "/manifest.json",
  "/script.js",
  "/style.css",
  "/font/Shabnam.eot",
  "/font/Shabnam.ttf",
  "/font/Shabnam.woff",
  "/images/no_data.jpg",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-256x256.png",
  "/images/icons/icon-384x384.png",
  "/images/icons/icon-512x512.png",
  "/bootstrap-icons/fonts/bootstrap-icons.woff",
  "/bootstrap-icons/fonts/bootstrap-icons.woff2",
  "/bootstrap-icons/bootstrap-icons.css",
  "/add_question/index.html",
  "/add_question/main.js",
  "/add_question/style.css",
  "/add_question/utils.js",
  "/add_question/alertify/alertify.min.js",
  "/add_question/alertify/alertify.rtl.min.css",
  "/add_question/alertify/default.rtl.min.css",
  "/add_question/bootstrap/bootstrap.bundle.min.js",
  "/add_question/bootstrap/bootstrap.min.css",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (!response) console.log(event.request);
      return response || fetch(event.request);
    })
  );
});
