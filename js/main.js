// Utility functions
const utils = {
    debounce: (fn, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(null, args), delay);
        };
    },
    
    // Load image and return promise
    loadImage: (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
};

// Core functionality manager
class CoreFunctionality {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
    }

    initializeComponents() {
        // Mobile menu
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        
        // Parallax elements
        this.parallaxElements = document.querySelectorAll('.parallax');
        
        // Lightbox
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = this.lightbox?.querySelector('img');
        
        // Portfolio images
        this.portfolioImages = document.querySelectorAll('.portfolio-grid img');
    }

    setupEventListeners() {
        // Mobile menu
        if (this.menuToggle && this.navLinks) {
            this.menuToggle.addEventListener('click', () => {
                this.navLinks.classList.toggle('active');
                this.menuToggle.setAttribute('aria-expanded', 
                    this.navLinks.classList.contains('active'));
            });
        }

        // Parallax scrolling
        if (this.parallaxElements.length) {
            window.addEventListener('scroll', utils.debounce(() => {
                requestAnimationFrame(() => this.handleParallax());
            }, 10));
        }

        // Lightbox functionality
        if (this.lightbox && this.portfolioImages.length) {
            this.setupLightbox();
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));
    }

    handleParallax() {
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            const yOffset = window.pageYOffset * speed;
            element.style.transform = `translateY(${yOffset}px)`;
        });
    }

    setupLightbox() {
        this.portfolioImages.forEach(img => {
            img.addEventListener('click', () => this.openLightbox(img.src));
        });

        this.lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-lightbox') || e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Add navigation buttons
        const prevBtn = this.lightbox.querySelector('.prev-image');
        const nextBtn = this.lightbox.querySelector('.next-image');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateLightbox('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateLightbox('next'));
    }

    handleKeyboardNav(e) {
        if (!this.lightbox?.classList.contains('open')) return;
        
        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.navigateLightbox('prev');
                break;
            case 'ArrowRight':
                this.navigateLightbox('next');
                break;
        }
    }

    openLightbox(src) {
        if (!this.lightboxImage || !this.lightbox) return;
        
        utils.loadImage(src)
            .then(() => {
                this.lightboxImage.src = src;
                this.lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            })
            .catch(error => {
                console.error('Failed to load image:', error);
                // Implement proper error handling/user feedback
            });
    }

    closeLightbox() {
        if (!this.lightbox) return;
        
        this.lightbox.classList.remove('open');
        document.body.style.overflow = '';
        this.lightboxImage.src = '';
    }

    navigateLightbox(direction) {
        const currentImg = Array.from(this.portfolioImages)
            .find(img => img.src === this.lightboxImage.src);
        if (!currentImg) return;

        const currentIndex = Array.from(this.portfolioImages).indexOf(currentImg);
        let newIndex;

        if (direction === 'prev') {
            newIndex = currentIndex === 0 ? this.portfolioImages.length - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === this.portfolioImages.length - 1 ? 0 : currentIndex + 1;
        }

        this.openLightbox(this.portfolioImages[newIndex].src);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CoreFunctionality();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CoreFunctionality, utils };
}
