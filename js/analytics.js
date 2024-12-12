// analytics.js

// Basic analytics tracking setup
document.addEventListener("DOMContentLoaded", () => {
    const trackEvent = (eventName, eventDetails = {}) => {
        console.log(`Event Tracked: ${eventName}`, eventDetails);
        // Replace with actual analytics tracking logic, e.g., Google Analytics or other platforms.
    };

    // Track page views
    trackEvent('page_view', { url: window.location.href });

    // Track navigation clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('navigation_click', { href: link.href });
        });
    });

    // Track portfolio image views
    document.querySelectorAll('.portfolio-grid img').forEach(img => {
        img.addEventListener('click', () => {
            trackEvent('portfolio_image_view', { src: img.src });
        });
    });

    // Track Instagram follow button
    const instaFollowButton = document.querySelector('.follow-btn');
    if (instaFollowButton) {
        instaFollowButton.addEventListener('click', () => {
            trackEvent('instagram_follow', { href: instaFollowButton.href });
        });
    }
});
