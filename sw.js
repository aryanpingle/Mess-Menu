const ASSETS = ["/main.css","/index.html","/main.js"]

self.addEventListener("install", event=>{
    event.waitUntil(
        caches.open('sw-cache').then(cache=>cache.addAll(ASSETS))
    )
});

self.addEventListener("fetch", event=>{
    event.respondWith(
        caches.match(event.request).then(response=>response||fetch(event.request))
    )
});