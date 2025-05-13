// https://unsplash.com/es/%C3%BAnete
const API_KEY = "XYpSwe2Jt7R1akS-u8xGkTpwiNy1-X-h7n5BTq9imr4"
export class ImageService {
    constructor() {
        this.BASE_URL = 'https://api.unsplash.com';
        this.imagesPerPage = 30;
    }

    async searchImages(query, page = 1) {
        try {
            const response = await fetch(
                `${this.BASE_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${this.imagesPerPage}`,
                {
                    headers: {
                        'Authorization': `Client-ID ${API_KEY}`
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Error al buscar imágenes');
            }

            const data = await response.json();
            return {
                results: data.results,
                total: data.total,
                totalPages: Math.ceil(data.total / this.imagesPerPage)
            };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

export class ImageGallery {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.paginationContainer = document.getElementById('pagination');
        this.imageService = new ImageService();
        this.currentPage = 1;
        this.currentQuery = '';
        this.isLoading = false;
        this.totalPages = 0;
        this.observer = null;
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isLoading) {
                        this.loadMoreImages();
                    }
                });
            },
            { threshold: 0.5 }
        );
    }

    async searchImages(query) {
        this.currentQuery = query;
        this.currentPage = 1;
        this.clearGallery();
        await this.loadImages();
    }

    clearGallery() {
        this.container.innerHTML = '';
        this.clearPagination();
    }

    clearPagination() {
        if (this.paginationContainer) {
            this.paginationContainer.innerHTML = '';
        }
    }

    async loadImages() {
        try {
            this.isLoading = true;
            const response = await this.imageService.searchImages(this.currentQuery, this.currentPage);
            const images = response.results;
            this.totalPages = response.totalPages;

            images.forEach(image => {
                const imageElement = this.createImageElement(image);
                this.container.appendChild(imageElement);
            });

            this.updatePagination();
        } catch (error) {
            console.error('Error al cargar imágenes:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    updatePagination() {
        this.clearPagination();
        if (!this.paginationContainer || this.totalPages <= 1) return;

        const paginationList = document.createElement('ul');
        paginationList.className = 'flex justify-center items-center space-x-2';

        // Previous button
        if (this.currentPage > 1) {
            const prevButton = this.createPaginationButton('←', () => this.goToPage(this.currentPage - 1));
            paginationList.appendChild(prevButton);
        }

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = this.createPaginationButton(i, () => this.goToPage(i));
            if (i === this.currentPage) {
                pageButton.classList.add('bg-blue-500', 'text-white');
            }
            paginationList.appendChild(pageButton);
        }

        // Next button
        if (this.currentPage < this.totalPages) {
            const nextButton = this.createPaginationButton('→', () => this.goToPage(this.currentPage + 1));
            paginationList.appendChild(nextButton);
        }

        this.paginationContainer.appendChild(paginationList);
    }

    createPaginationButton(text, onClick) {
        const button = document.createElement('li');
        button.className = 'px-3 py-2 rounded cursor-pointer hover:bg-gray-200 transition-colors';
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    async goToPage(page) {
        if (page === this.currentPage || page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.clearGallery();
        await this.loadImages();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    createImageElement(image) {
        const div = document.createElement('div');
        div.className = 'box';

        const img = document.createElement('img');
        img.src = image.urls.regular;
        img.alt = image.alt_description || 'Imagen de Unsplash';
        img.loading = 'lazy';

        // Determinar las clases según las dimensiones
        const width = image.width;
        const height = image.height;
        const ratio = width / height;

        if (ratio > 1.5) {
            // Imagen landscape (más ancha que alta)
            div.classList.add('box-landscape');
        } else if (ratio < 0.75) {
            // Imagen portrait (más alta que ancha)
            div.classList.add('box-portrait');
        } else if (width > 800 && height > 800) {
            // Imagen grande (doble)
            div.classList.add('box-double');
        }

        div.appendChild(img);
        return div;
    }

    async loadMoreImages() {
        if (!this.isLoading) {
            await this.loadImages();
        }
    }
} 