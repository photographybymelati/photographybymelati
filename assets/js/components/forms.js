// /assets/js/components/gallery.js

export class Gallery {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            columns: options.columns || 3,
            gap: options.gap || '2rem',
            lightbox: options.lightbox !== false,
            ...options
        };
        
        this.items = [];
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.container.style.columns = this.options.columns;
        this.container.style.columnGap = this.options.gap;
        
        // Initialize items
        this.items = Array.from(this.container.querySelectorAll('.gallery-item'));
        
        // Add event listeners
        this.items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (this.options.lightbox) {
                    this.openLightbox(index);
                }
            });
            
            // Lazy load images
            const img = item.querySelector('img');
            if (img && img.dataset.src) {
                this.lazyLoadImage(img);
            }
        });
        
        // Initialize lightbox if enabled
        if (this.options.lightbox) {
            this.initLightbox();
        }
        
        // Add intersection observer for animations
        this.initIntersectionObserver();
    }
    
    lazyLoadImage(img) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.dataset.src;
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    observer.unobserve(img);
                }
            });
        });
        
        observer.observe(img);
    }
    
    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        this.items.forEach(item => observer.observe(item));
    }
    
    initLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="" class="lightbox-image">
                <button class="lightbox-close">&times;</button>
                <div class="lightbox-nav">
                    <button class="lightbox-button prev">&larr;</button>
                    <button class="lightbox-button next">&rarr;</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.lightbox);
        
        // Add lightbox event listeners
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        this.lightbox.querySelector('.prev').addEventListener('click', () => this.prevImage());
        this.lightbox.querySelector('.next').addEventListener('click', () => this.nextImage());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        const img = this.items[index].querySelector('img');
        const lightboxImg = this.lightbox.querySelector('.lightbox-image');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateLightboxImage();
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateLightboxImage();
    }
    
    updateLightboxImage() {
        const img = this.items[this.currentIndex].querySelector('img');
        const lightboxImg = this.lightbox.querySelector('.lightbox-image');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }
    
    // Public methods for external control
    filter(category) {
        this.items.forEach(item => {
            const itemCategory = item.dataset.category;
            if (category === 'all' || itemCategory === category) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    destroy() {
        // Remove event listeners and clean up
        if (this.lightbox) {
            this.lightbox.remove();
        }
    }
}
