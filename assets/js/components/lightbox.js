// /assets/js/components/lightbox.js

export class Lightbox {
    constructor(options = {}) {
        this.options = {
            animation: options.animation || 'fade', // fade, slide
            closeOnOverlay: options.closeOnOverlay !== false,
            keyboard: options.keyboard !== false,
            swipe: options.swipe !== false,
            ...options
        };
        
        this.isOpen = false;
        this.currentImage = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.createLightbox();
        this.attachEventListeners();
    }
    
    createLightbox() {
        this.element = document.createElement('div');
        this.element.className = 'lightbox';
        this.element.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <div class="lightbox-image-container">
                    <img src="" alt="" class="lightbox-image">
                </div>
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-prev" aria-label="Previous image">&larr;</button>
                <button class="lightbox-next" aria-label="Next image">&rarr;</button>
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            </div>
        `;
        
        document.body.appendChild(this.element);
        
        // Cache elements
        this.overlay = this.element.querySelector('.lightbox-overlay');
        this.content = this.element.querySelector('.lightbox-content');
        this.image = this.element.querySelector('.lightbox-image');
        this.caption = this.element.querySelector('.lightbox-caption');
        this.counter = this.element.querySelector('.lightbox-counter');
    }
    
    attachEventListeners() {
        // Close button
        this.element.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        
        // Navigation buttons
        this.element.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
        this.element.querySelector('.lightbox-next').addEventListener('click', () => this.next());
        
        // Overlay click
        if (this.options.closeOnOverlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        // Keyboard navigation
        if (this.options.keyboard) {
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
        }
        
        // Touch events for swipe
        if (this.options.swipe) {
            this.content.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            });
            
            this.content.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe();
            });
        }
    }
    
    handleKeyDown(e) {
        if (!this.isOpen) return;
        
        switch(e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                this.prev();
                break;
            case 'ArrowRight':
                this.next();
                break;
        }
    }
    
    handleSwipe() {
        const swipeDistance = this.touchEndX - this.touchStartX;
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                this.prev();
            } else {
                this.next();
            }
        }
    }
    
    open(imageUrl, caption = '', index = 0, total = 1) {
        this.isOpen = true;
        this.image.src = imageUrl;
        this.caption.textContent = caption;
        this.counter.textContent = `${index + 1} / ${total}`;
        
        document.body.style.overflow = 'hidden';
        this.element.classList.add('active');
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.element.classList.add('visible');
        });
    }
    
    close() {
        this.isOpen = false;
        this.element.classList.remove('visible');
        
        // Wait for animation to complete
        setTimeout(() => {
            this.element.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }
    
    prev() {
        if (this.options.onPrev) {
            this.options.onPrev();
        }
    }
    
    next() {
        if (this.options.onNext) {
            this.options.onNext();
        }
    }
    
    destroy() {
        if (this.options.keyboard) {
            document.removeEventListener('keydown', this.handleKeyDown);
        }
        this.element.remove();
    }
}
