// main.js

document.addEventListener("DOMContentLoaded", () => {
    // Loader Fade-out Effect
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => loader.classList.add('fade-out'), 1000);
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Parallax Effect
    const parallaxElements = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            element.style.backgroundPositionY = `${window.scrollY * speed}px`;
        });
    });

    // Lazy Loading for Images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.src = `https://placehold.co/600x400`;
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox?.querySelector('img');
    document.querySelectorAll('.portfolio-grid img').forEach(img => {
        img.src = `https://placehold.co/600x400`;
        img.addEventListener('click', () => {
            if (lightbox && lightboxImage) {
                lightboxImage.src = img.src;
                lightbox.classList.add('open');
            }
        });
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-lightbox') || e.target === lightbox) {
                lightbox.classList.remove('open');
            }
        });
    }
});
