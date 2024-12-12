// /assets/js/main.js

import { Gallery } from './components/gallery.js';
import { Lightbox } from './components/lightbox.js';
import { FormHandler } from './components/forms.js';
import { initializeAnimations } from './utils/animations.js';
import { initializeLazyLoading } from './utils/lazyload.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeGallery();
    initializeForms();
    initializeAnimations();
    initializeLazyLoading();
});

// Navigation
function initializeNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Hide header on scroll down, show on scroll up
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('header-hidden');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('header-hidden')) {
            header.classList.add('header-hidden');
        } else if (currentScroll < lastScroll && header.classList.contains('header-hidden')) {
            header.classList.remove('header-hidden');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

// Gallery
function initializeGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        const gallery = new Gallery(galleryContainer, {
            columns: window.innerWidth > 768 ? 3 : 1,
            lightbox: true
        });
        
        // Initialize filters if they exist
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                gallery.filter(category);
            });
        });
    }
}

// Forms
function initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        new FormHandler(form, {
            validateOnInput: true,
            submitEndpoint: form.action,
            onSuccess: (response) => {
                console.log('Form submitted successfully:', response);
            },
            onError: (error) => {
                console.error('Form submission error:', error);
            }
        });
    });
}

// Initialize Instagram Feed
function initializeInstagramFeed() {
    const instagramGrid = document.querySelector('.instagram-grid');
    if (instagramGrid) {
        // Fetch and display Instagram feed
        // Note: This would typically use the Instagram Basic Display API
        // For now, we'll use placeholder images
        const feedItems = Array.from({ length: 6 }, (_, i) => ({
            image: `/api/placeholder/600/${i % 2 ? '600' : '900'}`,
            link: 'https://instagram.com/photographyby
link: 'https://instagram.com/photographybymelati'
    }));

    instagramGrid.innerHTML = feedItems.map(item => `
        <a href="${item.link}" class="insta-item" target="_blank" rel="noopener">
            <img src="${item.image}" alt="Instagram Post" loading="lazy">
            <div class="overlay">
                <svg class="instagram-icon" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span class="view-post">View on Instagram</span>
            </div>
        </a>
    `).join('');
}

// Performance Optimizations
function initializePerformance() {
    // Preload critical images
    const imagesToPreload = document.querySelectorAll('[data-preload]');
    imagesToPreload.forEach(img => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.src;
        document.head.appendChild(preloadLink);
    });

    // Add intersection observer for animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => observer.observe(element));
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeGallery();
    initializeForms();
    initializeInstagramFeed();
    initializePerformance();
});

// Add service worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
