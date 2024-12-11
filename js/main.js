
// main.js

// DOM Elements
const header = document.querySelector('header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const loader = document.querySelector('.loader');
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('img');
const portfolioGrid = document.querySelector('.portfolio-grid');
const instagramFeed = document.querySelector('.instagram-masonry');

// Site Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeLoader();
    initializeNavigation();
    initializePortfolio();
    initializeInstagramFeed();
    initializeLightbox();
    initializeLazyLoading();
    initializeForm();
});

// Loading Screen
function initializeLoader() {
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });
}

// Navigation
function initializeNavigation() {
    // Mobile Menu Toggle
    mobileMenuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Header Hide/Show on Scroll
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

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
}

// Portfolio Grid
function initializePortfolio() {
    // Sample portfolio data - replace with actual data
    const portfolioItems = [
        { image: 'path/to/image1.jpg', category: 'Weddings' },
        { image: 'path/to/image2.jpg', category: 'Portraits' },
        // Add more items
    ];

    portfolioItems.forEach(item => {
        const portfolioItem = createPortfolioItem(item);
        portfolioGrid?.appendChild(portfolioItem);
    });
}

function createPortfolioItem(item) {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    div.innerHTML = `
        <img src="${item.image}" alt="${item.category}" loading="lazy">
        <div class="portfolio-category">${item.category}</div>
    `;
    div.addEventListener('click', () => openLightbox(item.image));
    return div;
}

// Instagram Feed
function initializeInstagramFeed() {
    // Fetch Instagram feed using their API
    // For now, using placeholder images
    const feedItems = Array.from({ length: 6 }, (_, i) => ({
        image: `https://placehold.co/600x${Math.random() > 0.5 ? '600' : '900'}`,
        link: 'https://instagram.com/photographybymelati'
    }));

    feedItems.forEach(item => {
        const feedItem = createInstagramItem(item);
        instagramFeed?.appendChild(feedItem);
    });
}

function createInstagramItem(item) {
    const a = document.createElement('a');
    a.className = 'insta-item';
    a.href = item.link;
    a.target = '_blank';
    a.innerHTML = `
        <img src="${item.image}" alt="Instagram Post" loading="lazy">
        <div class="overlay">
            <i class="instagram-icon"></i>
            <span class="view-post">View on Instagram</span>
        </div>
    `;
    return a;
}

// Lightbox
function initializeLightbox() {
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-image');
    const nextBtn = lightbox.querySelector('.next-image');

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', showPrevImage);
    nextBtn?.addEventListener('click', showNextImage);
    
    // Close on outside click
    lightbox?.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (!lightbox.style.display === 'flex') return;
        
        switch(e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': showPrevImage(); break;
            case 'ArrowRight': showNextImage(); break;
        }
    });
}

function openLightbox(imageSrc) {
    lightboxImage.src = imageSrc;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    // Implement previous image logic
}

function showNextImage() {
    // Implement next image logic
}

// Lazy Loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '50px'
    };

  function initializeForm() {
    const form = document.getElementById('client-questionnaire');
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Form will submit automatically to Formspree
            // Just handle the response
            setTimeout(() => {
                submitButton.textContent = 'Submit Questionnaire';
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));
}

// Export for use in other files if needed
export {
    openLightbox,
    closeLightbox
};
