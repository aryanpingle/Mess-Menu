const APP_VERSION = 6.3;

const DOC_CACHE_NAME = `DOC_CACHE`;
let DOC_CACHE = null;
const RES_CACHE_VERSION = 6.3;
const RES_CACHE_NAME = `RES_CACHEv${RES_CACHE_VERSION.toFixed(2)}`;
let RES_CACHE = null;

const STOP_CACHING = self.registration.scope.includes("127.0.0.1");

// UTILITY FUNCTIONS

/**
 * Check if a given string ends with any substring.
 *
 * @param {string} str
 * @param  {string[]} ends
 * @returns {boolean}
 */
function endsWithAny(str, ends) {
    return ends.some((end) => str.endsWith(end));
}

/**
 * Print to the console when in development.
 *
 * @param {string} text
 * @param {string} backgroundColor
 */
function debug(text, backgroundColor) {
    if (self.registration.scope.includes("127")) {
        console.log(
            `%c${text}`,
            `color: black !important; background-color: ${backgroundColor};`
        );
    }
}

// SERVICE WORKER LIFECYCLE EVENTS

self.addEventListener("install", (event) => {
    debug("Service Worker Installed");

    self.skipWaiting();
});

self.addEventListener("activate", async (event) => {
    debug("Service Worker Activated");

    // Create the two cachess
    event.waitUntil(
        (async () => {
            await clients.claim();
        })()
    );
    // Remove other versions
    let cache_names = await caches.keys();
    cache_names.forEach((cache_name) => {
        if (cache_name != DOC_CACHE_NAME && cache_name != RES_CACHE_NAME) {
            debug(`Service Worker => Deleting '${cache_name}'`, "red");
            caches.delete(cache_name);
        }
    });
});

self.addEventListener("fetch", (event) => {
    event.respondWith(STOP_CACHING ? fetch(event.request) : get_request(event));
});

async function get_request(request_event) {
    const request = request_event.request;
    const url = new URL(request.url).origin + new URL(request.url).pathname;

    if (url.includes("/gtag/")) {
        return fetch(request);
    }

    if (RES_CACHE == null) {
        DOC_CACHE = await caches.open(DOC_CACHE_NAME);
        RES_CACHE = await caches.open(RES_CACHE_NAME);
    }

    if (url.includes("menu.json")) {
        let menu = await getMenu(request_event);
        return menu;
    }

    const resourceSuffixes = [".js", ".html", ".css", "/", "manifest.json"];
    if (endsWithAny(url, resourceSuffixes)) {
        debug(`DOC: ${url}`);
        // Check if cached version exists
        let cache_match = await DOC_CACHE.match(request, { ignoreVary: true });
        if (cache_match) {
            // Perform network match in the background
            networkFetchAndSave(request, DOC_CACHE);

            // Return the cached version
            return cache_match;
        } else {
            debug(`${url} wasn't in cache, so doing fetch`, "yellow");
            // Nothing in cache, perform basic fetch request
            return fetch(request).then((response) => {
                saveResponse(request, response, DOC_CACHE);
                return response;
            });
        }
    } else {
        debug(`RES: ${url}`);
        // Resource like image, manifest etc.
        let cache_match = await RES_CACHE.match(request, { ignoreVary: true });
        if (cache_match) {
            debug(`${url} returned as cache`, "rgb(0, 255, 128)");
            return cache_match;
        }

        // log(`${url} wasn't in cache, so doing fetch`)
        return fetch(request).then((response) => {
            saveResponse(request, response, RES_CACHE);
            return response;
        });
    }

    return new Response(0);
}

/**
 * @param {Event} request_event
 */
async function getMenu(request_event) {
    const request = request_event.request;
    const url = request.url;

    if (RES_CACHE == null) {
        DOC_CACHE = await caches.open(DOC_CACHE_NAME);
        RES_CACHE = await caches.open(RES_CACHE_NAME);
    }

    // Check if AbortController is supported
    if (AbortController !== undefined) {
        // AbortController is supported, begin network fetch
        let abort_controller = new AbortController();
        let signal = abort_controller.signal;
        let timeout_id = setTimeout(() => abort_controller.abort(), 2500);
        let menu = await fetch(request, { signal: signal })
            .then((response) => {
                if (response.status == 404) throw new Error();

                return response;
            })
            .then((response) => {
                /* Network Match succeeded */

                // Clear the abort timeout
                clearTimeout(timeout_id);

                saveResponse(request, response, RES_CACHE);

                // Return network match
                debug("(menu) network fetch succeeded", "rgb(128, 255, 128)");
                return response;
            })
            .catch(async (err) => {
                debug("(menu) could not fetch in time", "rgb(255, 128, 128)");

                // Perform network request in the background
                networkFetchAndSave(request, RES_CACHE);

                /* Try for cache match */
                let cache_match = await RES_CACHE.match(request, {
                    ignoreVary: true,
                });

                if (cache_match) {
                    debug("(menu) Got from cache", "rgb(128, 128, 255)");
                }

                return cache_match;
            });

        // Return the cached version
        return menu;
    }

    // At this point we know AbortController is not supported

    return await fetch(request)
        .then((response) => {
            if (response.status == 404) throw new Error();

            return response;
        })
        .then((response) => {
            /* Network Match succeeded */

            saveResponse(request, response, RES_CACHE);

            // Return network match
            debug("(menu) network fetch succeeded", "rgb(128, 255, 128)");
            return response;
        })
        .catch(async (err) => {
            debug("could not fetch menu in time", "rgb(255, 128, 128)");

            // Perform network request in the background
            networkFetchAndSave(request, RES_CACHE);

            /* Try for cache match */
            let cache_match = await RES_CACHE.match(request, {
                ignoreVary: true,
            });

            if (cache_match) {
                debug("Got a valid cache match", "rgb(128, 128, 255)");
            }

            return cache_match;
        });
}

/**
 * Saves a copy of the response to the given cache
 * @param {Request} request
 * @param {Response} request
 * @param {Cache} cache
 */
function saveResponse(request, response, cache) {
    let clone = response.clone();
    cache.put(request, clone);
}

/**
 * Performs a network fetch for the request and saves it to the given cache
 * Asynchronously handled, so you can call this function and forget about it
 * @param {Request} request
 * @param {Cache} cache
 */
function networkFetchAndSave(request, cache) {
    fetch(request)
        .then((response) => {
            if (response.status == 404) return undefined;
            if (!response) return undefined;

            cache.put(request, response);
        })
        .catch((err) => err);
}
