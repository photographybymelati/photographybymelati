// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
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
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', function() {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        });
    }
}

// Navigation
function initializeNavigation() {
    const header = document.querySelector('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile Menu Toggle
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Header Hide/Show on Scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
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
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
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
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;

    // Sample portfolio data - replace with actual data
    const portfolioItems = [
        { image: 'https://placehold.co/800x1200', category: 'Weddings' },
        { image: 'https://placehold.co/800x1200', category: 'Portraits' },
        { image: 'https://placehold.co/800x1200', category: 'Families' },
        { image: 'https://placehold.co/800x1200', category: 'Real Estate' }
    ];

    portfolioItems.forEach(function(item) {
        const div = document.createElement('div');
        div.className = 'portfolio-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.category}" loading="lazy">
            <div class="portfolio-category">${item.category}</div>
        `;
        div.addEventListener('click', function() {
            openLightbox(item.image);
        });
        portfolioGrid.appendChild(div);
    });
}

// Instagram Feed
function initializeInstagramFeed() {
    const instagramFeed = document.querySelector('.instagram-masonry');
    if (!instagramFeed) return;

    // Sample feed items - replace with actual Instagram API data
    const feedItems = Array.from({ length: 6 }, (_, i) => ({
        image: `/api/placeholder/${600}/${600}`,
        link: 'https://instagram.com/photographybymelati',
        alt: `Instagram Post ${i + 1}`
    }));

    instagramFeed.innerHTML = feedItems.map(item => `
        <a href="${item.link}" class="insta-item" target="_blank" rel="noopener noreferrer">
            <img src="${item.image}" alt="${item.alt}" loading="lazy">
            <div class="overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="instagram-icon">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span class="view-post">View on Instagram</span>
            </div>
        </a>
    `).join('');
}

// Lightbox
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-image');
    const nextBtn = lightbox.querySelector('.next-image');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevImage);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }
    
    // Close on outside click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display !== 'flex') return;
        
        switch(e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': showPrevImage(); break;
            case 'ArrowRight': showNextImage(); break;
        }
    });
}

function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    lightboxImg.src = imageSrc;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    // Implement when needed
    console.log('Previous image');
}

function showNextImage() {
    // Implement when needed
    console.log('Next image');
}

// Lazy Loading
function initializeLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const imageOptions = {
        threshold: 0,
        rootMargin: '50px'
    };

    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(function(img) {
        imageObserver.observe(img);
    });
}

// Form Handling
function initializeForm() {
    const form = document.getElementById('client-questionnaire');
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Form will submit automatically to Formspree
            setTimeout(function() {
                submitButton.textContent = 'Submit Questionnaire';
                submitButton.disabled = false;
            }, 2000);
        });
    }
}
