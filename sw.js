const log = (text, color="rgb(255, 128, 0)") => console.log(`%c${text}`, `color: black; background-color: ${color};`)

const CACHE_VERSION = 1
const CURRENT_CACHE = `v${CACHE_VERSION}`
var STRAT = "network-first"

const cache_files = ["/", "/index.html", "/main.js", "/main.css", "/images/right-arrow-min.png", "/images/favicon.png"]

self.addEventListener("install", event => {
    log("Service Worker Installed")

    event.waitUntil(
        caches
            .open(CURRENT_CACHE)
            .then(cache => {
                log("Service Worker Cached")
                cache.addAll(cache_files)
                return cache
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
        get_request(event)
    )
})

async function get_request(request_event) {
    if(request_event.request.url.includes("cache-first")) {
        console.log("Switching to cache first")
        STRAT = "cache-first"
        return new Response(0)
    }
    if(request_event.request.url.includes("network-first")) {
        console.log("Switching to network first")
        STRAT = "network-first"
        return new Response(0)
    }
    if(STRAT == "network-first") {
        log("Performing Network Request", "cyan")
        return get_network_request(request_event).catch(err => get_cache_request(request_event))
    }
    log("Performing Cache Request", "greenyellow")
    return get_cache_request(request_event)
}

async function get_cache_request(request_event) {
    return caches.match(request_event.request)
}

async function get_network_request(request_event) {
    return fetch(request_event.request)
}