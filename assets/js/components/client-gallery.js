// /assets/js/components/client-gallery.js

export class ClientGallery {
    constructor(options = {}) {
        this.options = {
            galleryEndpoint: '/api/gallery',
            downloadEndpoint: '/api/download',
            favoriteEndpoint: '/api/favorites',
            password: options.password || null,
            ...options
        };
        
        this.favorites = new Set();
        this.init();
    }
    
    async init() {
        if (this.options.password) {
            await this.authenticate();
        }
        
        await this.loadGallery();
        this.initializeUI();
        this.loadFavorites();
    }
    
    async authenticate() {
        const response = await fetch(`${this.options.galleryEndpoint}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: this.options.password
            })
        });
        
        if (!response.ok) {
            throw new Error('Invalid gallery password');
        }
    }
    
    async loadGallery() {
        try {
            const response = await fetch(this.options.galleryEndpoint);
            const data = await response.json();
            
            this.images = data.images;
            this.renderGallery();
        } catch (error) {
            console.error('Error loading gallery:', error);
            this.showError('Failed to load gallery');
        }
    }
    
    renderGallery() {
        const container = document.querySelector('.client-gallery');
        if (!container) return;
        
        container.innerHTML = this.images.map(image => `
            <div class="gallery-item" data-id="${image.id}">
                <img 
                    src="${image.thumbnail}" 
                    data-src="${image.full}"
                    alt="${image.title}"
                    loading="lazy"
                >
                <div class="gallery-overlay">
                    <button class="favorite-btn ${this.favorites.has(image.id) ? 'active' : ''}"
                            aria-label="Favorite this image">
                        ♥
                    </button>
                    <button class="download-btn" aria-label="Download image">
                        ↓
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    initializeUI() {
        // Initialize masonry layout
        this.initMasonry();
        
        // Add event listeners
        document.addEventListener('click', e => {
            const galleryItem = e.target.closest('.gallery-item');
            if (!galleryItem) return;
            
            if (e.target.matches('.favorite-btn')) {
                this.toggleFavorite(galleryItem.dataset.id);
            } else if (e.target.matches('.download-btn')) {
                this.downloadImage(galleryItem.dataset.id);
            } else {
                this.showLightbox(galleryItem.dataset.id);
            }
        });
        
        // Initialize filters
        this.initFilters();
    }
    
    initMasonry() {
        // Initialize masonry layout
        // This would use a library like Masonry.js
    }
    
    initFilters() {
        const filterButtons = document.querySelectorAll('.gallery-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.filterImages(filter);
            });
        });
    }
    
    filterImages(filter) {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            const shouldShow = filter === 'all' || item.dataset.category === filter;
            item.style.display = shouldShow ? '' : 'none';
        });
        
        // Re-layout masonry
        this.initMasonry();
    }
    
    async toggleFavorite(imageId) {
        try {
            const response = await fetch(`${this.options.favoriteEndpoint}/${imageId}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                if (this.favorites.has(imageId)) {
                    this.favorites.delete(imageId);
                } else {
                    this.favorites.add(imageId);
                }
                
                this.updateFavoriteUI(imageId);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    }
    
    updateFavoriteUI(imageId) {
        const button = document.querySelector(`.gallery-item[data-id="${imageId}"] .favorite-btn`);
        if (button) {
            button.classList.toggle('active', this.favorites.has(imageId));
        }
    }
    
    async downloadImage(imageId) {
        try {
            const response = await fetch(`${this.options.downloadEndpoint}/${imageId}`);
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image-${imageId}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
            this.showError('Failed to download image');
        }
    }
    
    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'gallery-error';
        errorElement.textContent = message;
        
        document.body.appendChild(errorElement);
        setTimeout(() => errorElement.remove(), 3000);
    }
    
    loadFavorites() {
        const savedFavorites = localStorage.getItem('galleryFavorites');
        if (savedFavorites) {
            this.favorites = new Set(JSON.parse(savedFavorites));
        }
    }
    
    saveFavorites() {
        localStorage.setItem('galleryFavorites', JSON.stringify([...this.favorites]));
    }
}
