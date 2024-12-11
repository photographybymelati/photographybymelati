// Create a new file called animations.js

// Parallax Effect
const parallaxElements = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
        let speed = element.dataset.speed || 0.5;
        let yPos = -(window.pageYOffset * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Page Transition Effect
const transitionElement = document.createElement('div');
transitionElement.className = 'page-transition';
document.body.appendChild(transitionElement);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        transitionElement.classList.add('active');
        
        setTimeout(() => {
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            transitionElement.classList.remove('active');
        }, 500);
    });
});

// Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    document.body.classList.add('loaded');
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1000);
});

// Image Loading Animation
const images = document.querySelectorAll('img[data-src]');
const imageOptions = {
    threshold: 0,
    rootMargin: '0px 0px 50px 0px'
};

const loadImage = (image) => {
    image.src = image.dataset.src;
    image.classList.add('fade-in');
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadImage(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, imageOptions);

images.forEach(image => imageObserver.observe(image));
