// Enhanced analytics.js
class Analytics {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.maxBatchSize = 10;
        this.processInterval = 2000; // Process every 2 seconds
        this.initializeTracking();
    }

    initializeTracking() {
        // Initialize core tracking
        this.setupEventListeners();
        this.startQueueProcessing();

        // Track initial page view
        this.trackEvent('page_view', {
            url: window.location.href,
            referrer: document.referrer,
            title: document.title
        });
    }

    setupEventListeners() {
        // Track all navigation clicks
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackEvent('navigation_click', {
                    href: link.href,
                    text: link.textContent,
                    section: link.getAttribute('href')
                });
            });
        });

        // Track portfolio interactions
        document.querySelectorAll('.portfolio-grid img').forEach(img => {
            img.addEventListener('click', () => {
                this.trackEvent('portfolio_image_view', {
                    src: img.src,
                    alt: img.alt,
                    category: img.dataset.category
                });
            });
        });

        // Track form submissions
        const contactForm = document.querySelector('.contact form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.trackEvent('form_submission', {
                    formId: contactForm.id,
                    success: true
                });
            });
        }

        // Track social link clicks
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('social_click', {
                    platform: link.textContent.toLowerCase(),
                    href: link.href
                });
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', this.debounce(() => {
            const scrollPercent = this.getScrollPercent();
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackEvent('scroll_depth', {
                        depth: maxScroll
                    });
                }
            }
        }, 500));
    }

    trackEvent(eventName, eventDetails = {}) {
        try {
            const event = {
                eventName,
                timestamp: new Date().toISOString(),
                sessionId: this.getSessionId(),
                ...eventDetails,
                // Add common properties
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                userAgent: navigator.userAgent
            };

            this.queueEvent(event);
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    queueEvent(event) {
        this.queue.push(event);
        if (this.queue.length >= this.maxBatchSize) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        const batch = this.queue.splice(0, this.maxBatchSize);

        try {
            // Replace with your actual analytics endpoint
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(batch)
            });

            if (!response.ok) {
                throw new Error(`Analytics API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending analytics:', error);
            // Return failed events to queue
            this.queue.unshift(...batch);
        } finally {
            this.isProcessing = false;
        }
    }

    startQueueProcessing() {
        setInterval(() => this.processQueue(), this.processInterval);
    }

    // Utility methods
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    getScrollPercent() {
        const h = document.documentElement;
        const b = document.body;
        const st = 'scrollTop';
        const sh = 'scrollHeight';
        return Math.round(
            (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100
        );
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize analytics
const analytics = new Analytics();

// Export for use in other modules
export default analytics;
