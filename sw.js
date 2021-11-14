const CACHE_VERSION = 11
const CURRENT_CACHE = `cache-${CACHE_VERSION}`

const cache_files = ["/index.html", "/main.js", "/main.css", "/images/", "/offline/"]

self.addEventListener("install", event=>{
    event.waitUntil(caches.open(CURRENT_CACHE).then(cache=>{
        cache.addAll(cache_files)
    }))
});

self.addEventListener("activate", event=>{
    event.waitUntil(caches.keys().then(cache_names=>{
        return Promise.all(cache_names.map(cache_name=>{
            if(cache_name !== CURRENT_CACHE) {
                return caches.delete(cache_name)
            }
        }))
    }))
});

function from_network(request, timeout) {
    return new Promise((fulfill, reject) => {
        const timeout_id = setTimeout(reject, timeout)
        fetch(request).then(response => {
            clearTimeout(timeout_id)
            fulfill(response)
            update(request)
        }, rejection_reason => reject)
    })
}

function update(request) {
    caches.open(CURRENT_CACHE).then(cache => {
        return fetch(request).then(response => cache.put(request, response))
    })
}

function from_cache(request) {
    caches.open(CURRENT_CACHE).then(cache => {
        cache.match(request).then(response => response || cache.match('/offline/'))
    })
};

self.addEventListener("fetch", event=>{
    event.respondWith(from_network(event.request, 5000).catch(() => {
        return from_cache(event.request)
    }))
});