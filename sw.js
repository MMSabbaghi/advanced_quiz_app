const cacheName = "advancedQuizAppCache";
const assetsToCache = [
  "/advanced_quiz_app/",
  "/advanced_quiz_app/global.js",
  "/advanced_quiz_app/index.html",
  "/advanced_quiz_app/manifest.json",
  "/advanced_quiz_app/script.js",
  "/advanced_quiz_app/style.css",
  "/advanced_quiz_app/font/Shabnam.eot",
  "/advanced_quiz_app/font/Shabnam.ttf",
  "/advanced_quiz_app/font/Shabnam.woff",
  "/advanced_quiz_app/images/no_data.jpg",
  "/advanced_quiz_app/images/icons/icon-192x192.png",
  "/advanced_quiz_app/images/icons/icon-256x256.png",
  "/advanced_quiz_app/images/icons/icon-384x384.png",
  "/advanced_quiz_app/images/icons/icon-512x512.png",
  "/advanced_quiz_app/bootstrap-icons/fonts/bootstrap-icons.woff",
  "/advanced_quiz_app/bootstrap-icons/fonts/bootstrap-icons.woff2",
  "/advanced_quiz_app/bootstrap-icons/bootstrap-icons.css",
  "/advanced_quiz_app/add_question/index.html",
  "/advanced_quiz_app/add_question/main.js",
  "/advanced_quiz_app/add_question/style.css",
  "/advanced_quiz_app/add_question/utils.js",
  "/advanced_quiz_app/add_question/alertify/alertify.min.js",
  "/advanced_quiz_app/add_question/alertify/alertify.rtl.min.css",
  "/advanced_quiz_app/add_question/alertify/default.rtl.min.css",
  "/advanced_quiz_app/add_question/bootstrap/bootstrap.bundle.min.js",
  "/advanced_quiz_app/add_question/bootstrap/bootstrap.min.css",
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
