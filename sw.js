const log = (text, color="rgb(128, 128, 128)") => self.registration.scope.includes("127") ? console.log(`%c${text}`, `color: black !important; background-color: ${color};`) : 0

const APP_VERSION = 6.01

const DOC_CACHE_NAME = `DOC_CACHE`
let DOC_CACHE = null
const RES_CACHE_VERSION = 6.01
const RES_CACHE_NAME = `RES_CACHEv${RES_CACHE_VERSION.toFixed(2)}`
let RES_CACHE = null

const STOP_CACHING = self.registration.scope.includes("127.0.0.1")
String.prototype.endsWithAny = function (...ends) {
    return ends.some(end => this.endsWith(end))
}

self.addEventListener("install", event => {
    log("Service Worker Installed")

    self.skipWaiting()
});

self.addEventListener("activate", async event => {
    log("Service Worker Activated")

    // Create the two cachess
    event.waitUntil((async () => {
        await clients.claim()
    })())
    // Remove other versions
    let cache_names = await caches.keys()
    cache_names.forEach(cache_name => {
        if (cache_name != DOC_CACHE_NAME && cache_name != RES_CACHE_NAME) {
            log(`Service Worker => Deleting '${cache_name}'`, "red")
            caches.delete(cache_name)
        }
    })
});

self.addEventListener("fetch", event => {
    event.respondWith(STOP_CACHING ? fetch(event.request) : get_request(event))
});

async function get_request(request_event) {
    const request = request_event.request
    const url = request.url
    
    if(RES_CACHE == null) {
        DOC_CACHE = await caches.open(DOC_CACHE_NAME)
        RES_CACHE = await caches.open(RES_CACHE_NAME)
    }

    if(url.endsWithAny(".js", ".html", ".css", "/", "manifest.json")) {
        log(`DOC: ${url}`)
        // Check if cached version exists
        let cache_match = await DOC_CACHE.match(request)
        if(cache_match) {
            // First perform network fetch in background
            let abort_controller = new AbortController()
            let signal = abort_controller.signal
            let timeout_id = setTimeout(() => abort_controller.abort(), 5000)
            fetch(request, {signal: signal}).then(response => {
                clearTimeout(timeout_id)
                DOC_CACHE.put(request, response)
            }).catch(err => err)

            // Return the cached version
            return cache_match
        }
        else {
            log(`${url} wasn't in cache, so doing fetch`, "yellow")
            // Nothing in cache, perform basic fetch request
            return fetch(request).then(response => {
                let clone = response.clone()
                DOC_CACHE.put(request, clone)
                return response
            })
        }
    }
    else {
        log(`RES: ${url}`)
        // Resource like image, manifest etc.
        let cache_match = await RES_CACHE.match(request, {ignoreVary: true})
        if(cache_match) {
            log(`${url} returned as cache`, "rgb(0, 255, 128)")
            return cache_match
        }
        
        // log(`${url} wasn't in cache, so doing fetch`)
        return fetch(request).then(response => {
            let clone = response.clone()
            RES_CACHE.put(request, clone)
            return response
        })
    }

    return new Response(0)
}