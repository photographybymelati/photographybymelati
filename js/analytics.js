// analytics.js

// Google Analytics Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA4 Measurement ID

// Track Page Views and Sections
document.addEventListener('DOMContentLoaded', () => {
    initializeTracking();
    trackScrollDepth();
    trackEngagement();
    trackForms();
    trackSocialInteractions();
});

// Initialize Tracking
function initializeTracking() {
    // Track page view with custom dimensions
    gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
    });

    // Track sections viewed
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'section_view', {
                    'event_category': 'Content',
                    'event_label': entry.target.id
                });
                observer.unobserve(entry.target); // Only track first view
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Track Scroll Depth
function trackScrollDepth() {
    const scrollDepths = [25, 50, 75, 100];
    let trackedDepths = new Set();

    window.addEventListener('scroll', () => {
        const scrollPercent = getScrollPercent();
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.has(depth)) {
                trackedDepths.add(depth);
                gtag('event', 'scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': `${depth}%`
                });
            }
        });
    });
}

function getScrollPercent() {
    const h = document.documentElement;
    const b = document.body;
    return (h.scrollTop || b.scrollTop) / ((h.scrollHeight || b.scrollHeight) - h.clientHeight) * 100;
}

// Track User Engagement
function trackEngagement() {
    // Track time spent
    const timeIntervals = [30, 60, 120, 300]; // seconds
    timeIntervals.forEach(interval => {
        setTimeout(() => {
            gtag('event', 'time_spent', {
                'event_category': 'Engagement',
                'event_label': `${interval} seconds`
            });
        }, interval * 1000);
    });

    // Track interactions
    document.addEventListener('click', e => {
        const target = e.target;
        
        // Portfolio clicks
        if (target.closest('.portfolio-item')) {
            gtag('event', 'portfolio_view', {
                'event_category': 'Portfolio',
                'event_label': target.closest('.portfolio-item').querySelector('img').alt
            });
        }

        // Pricing clicks
        if (target.closest('.pricing-card')) {
            gtag('event', 'pricing_view', {
                'event_category': 'Pricing',
                'event_label': target.closest('.pricing-card').querySelector('h3').textContent
            });
        }
    });
}

// Track Form Submissions
function trackForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => {
            gtag('event', 'form_submission', {
                'event_category': 'Contact',
                'event_label': form.getAttribute('id') || 'Contact Form'
            });
        });
    });
}

// Track Social Interactions
function trackSocialInteractions() {
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'social_click', {
                'event_category': 'Social',
                'event_label': link.textContent
            });
        });
    });

    // Instagram feed clicks
    document.querySelectorAll('.insta-item').forEach(item => {
        item.addEventListener('click', () => {
            gtag('event', 'instagram_feed_click', {
                'event_category': 'Social',
                'event_label': 'Instagram Feed Post'
            });
        });
    });
}

// Error Tracking
window.addEventListener('error', e => {
    gtag('event', 'javascript_error', {
        'event_category': 'Error',
        'event_label': `${e.message} (${e.filename}:${e.lineno})`
    });
});
