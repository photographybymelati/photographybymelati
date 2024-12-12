// animations.js - Subtle animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initializeAnimations();
    
    // Handle loading screen
    handlePageLoad();
    
    // Initialize image lazy loading
    initializeLazyLoading();
});

function initializeAnimations() {
    // Subtle fade-in for sections
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '50px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-on-scroll');
        sectionObserver.observe(section);
    });
}

function handlePageLoad() {
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 500);
        });
    }
}

function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add subtle parallax effect to hero section
let parallaxElements = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
});
