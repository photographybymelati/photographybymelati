// Add this in a new file named script.js

// Lightbox functionality
class Lightbox {
    constructor() {
        this.init();
    }

    init() {
        this.lightbox = document.createElement('div');
        this.lightbox.id = 'lightbox';
        document.body.appendChild(this.lightbox);

        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="close-lightbox">&times;</button>
                <button class="prev-image">&#10094;</button>
                <button class="next-image">&#10095;</button>
                <img src="" alt="Lightbox Image">
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const portfolioItems = document.querySelectorAll('.portfolio-item img');
        portfolioItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });

        this.lightbox.querySelector('.close-lightbox').addEventListener('click', () => this.closeLightbox());
        this.lightbox.querySelector('.prev-image').addEventListener('click', () => this.prevImage());
        this.lightbox.querySelector('.next-image').addEventListener('click', () => this.nextImage());
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        this.lightbox.style.display = 'flex';
        this.updateImage();
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    updateImage() {
        const images = document.querySelectorAll('.portfolio-item img');
        const lightboxImg = this.lightbox.querySelector('img');
        lightboxImg.src = images[this.currentImageIndex].src;
    }

    prevImage() {
        const images = document.querySelectorAll('.portfolio-item img');
        this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
        this.updateImage();
    }

    nextImage() {
        const images = document.querySelectorAll('.portfolio-item img');
        this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
        this.updateImage();
    }
}

// Animation effects using Intersection Observer
const animateOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
};

// Form validation
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
    animateOnScroll();
    
    // Form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(contactForm)) {
                // Here you would normally send the form data to a server
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            }
        });
    }
});
