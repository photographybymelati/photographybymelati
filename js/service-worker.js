// service-worker.js

const CACHE_NAME = 'melati-photography-v1';
const RUNTIME_CACHE = 'runtime-cache';

// Resources to cache on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/analytics.js',
    '/js/animations.js',
    '/assets/images/hero-image.webp',
    // Add other critical assets
];

// Install event - precache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// Fetch event - handle requests
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // HTML files - network-first strategy
    if (event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request).then(response => {
                        return response || caches.match('/offline.html');
                    });
                })
        );
        return;
    }

    // Images - cache-first strategy
    if (event.request.headers.get('accept').includes('image')) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request).then(response => {
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                });
            })
        );
        return;
    }

    // All other requests - network-first strategy
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

// Handle offline analytics
self.addEventListener('sync', event => {
    if (event.tag === 'sync-analytics') {
        event.waitUntil(syncAnalytics());
    }
});

async function syncAnalytics() {
    try {
        const analytics = await getAnalyticsFromIDB();
        await fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(analytics)
        });
        await clearAnalyticsFromIDB();
    } catch (error) {
        console.error('Error syncing analytics:', error);
    }
}
