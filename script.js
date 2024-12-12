// script.js - Main functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lightbox
    const lightbox = new Lightbox();
    
    // Form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize header scroll effect
    initHeaderScroll();
});

class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.currentImageIndex = 0;
        this.images = document.querySelectorAll('.portfolio-item img');
        this.bindEvents();
    }

    bindEvents() {
        // Add click listeners to all portfolio images
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => this.open(index));
        });

        // Close lightbox when clicking outside image
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.close();
            }
        });

        // Navigation buttons
        document.querySelector('.close-lightbox').addEventListener('click', () => this.close());
        document.querySelector('.prev-image').addEventListener('click', () => this.prev());
        document.querySelector('.next-image').addEventListener('click', () => this.next());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.style.display === 'flex') {
                if (e.key === 'Escape') this.close();
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            }
        });
    }

    open(index) {
        this.currentImageIndex = index;
        this.lightbox.style.display = 'flex';
        this.updateImage();
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    prev() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }

    next() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateImage();
    }

    updateImage() {
        const lightboxImg = this.lightbox.querySelector('img');
        const currentImg = this.images[this.currentImageIndex];
        lightboxImg.src = currentImg.src;
        lightboxImg.alt = currentImg.alt;
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Basic form validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });

    if (isValid) {
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scrolled')) {
            // Scrolling down & header is visible
            header.classList.add('scrolled');
        } else if (currentScroll < lastScroll && header.classList.contains('scrolled')) {
            // Scrolling up & header is hidden
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}
