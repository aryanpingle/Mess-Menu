const log = text => console.log(`%c${text}`, `color: black; background-color: rgb(255, 128, 0);`)

const CACHE_VERSION = 1
const CURRENT_CACHE = `v${CACHE_VERSION}`

const cache_files = ["/", "/index.html", "/main.js", "/main.css", "/images/right-arrow-min.png", "/images/favicon.png"]

self.addEventListener("install", event => {
    log("Service Worker Installed")

    event.waitUntil(
        caches
            .open(CURRENT_CACHE)
            .then(cache => {
                log("Service Worker Cached")
                cache.addAll(cache_files)
            })
            .then(() => self.skipWaiting())
    )
});

self.addEventListener("activate", event => {
    log("Service Worker Activated")

    // Remove other versions
    event.waitUntil(
        caches.keys().then(cache_names => {
            return Promise.all(
                cache_names.map(cache_name => {
                    if (cache_name != CURRENT_CACHE) {
                        log(`Service Worker => Deleting '${cache_name}'`)
                        caches.delete(cache_name)
                    }
                })
            )
        })
    )
});

self.addEventListener("fetch", event => {
    log("Service Worker Fetching")
    event.respondWith(
        fetch(event.request).catch(err => caches.match(event.request))
    )
})