// /assets/js/utils/lazyload.js

export const initializeLazyLoading = () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const lazyBackgrounds = document.querySelectorAll('[data-background]');
    
    // Configure intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.tagName.toLowerCase() === 'img') {
                    loadImage(element);
                } else {
                    loadBackground(element);
                }
                
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    // Observe all lazy images
    lazyImages.forEach(image => {
        imageObserver.observe(image);
        // Add loading animation class
        image.classList.add('lazy-loading');
    });
    
    // Observe all lazy backgrounds
    lazyBackgrounds.forEach(element => {
        imageObserver.observe(element);
        element.classList.add('lazy-loading');
    });
    
    function loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        if (srcset) {
            img.srcset = srcset;
        }
        
        if (src) {
            img.src = src;
        }
        
        img.addEventListener('load', () => {
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
        });
    }
    
    function loadBackground(element) {
        const src = element.dataset.background;
        
        if (src) {
            const img = new Image();
            img.onload = () => {
                element.style.backgroundImage = `url(${src})`;
                element.classList.remove('lazy-loading');
                element.classList.add('lazy-loaded');
            };
            img.src = src;
        }
    }
};

// Helper function to check if an image is cached
export const isImageCached = (src) => {
    const img = new Image();
    img.src = src;
    return img.complete;
};

// Preload critical images
export const preloadImages = (images) => {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};
