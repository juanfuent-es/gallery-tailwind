import './style.css'
import { ImageGallery } from './imageService.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const searchError = document.getElementById('searchError');
  const gallery = new ImageGallery('grid-container');

  // Validación del formulario
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const query = searchInput.value.trim();
    
    // Validaciones
    if (query.length < 3) {
      showError('La búsqueda debe tener al menos 3 caracteres');
      return;
    }

    if (query.length > 50) {
      showError('La búsqueda no puede tener más de 50 caracteres');
      return;
    }

    try {
      hideError();
      await gallery.searchImages(query);
    } catch (error) {
      showError('Error al buscar imágenes. Por favor, intenta de nuevo.');
    }
  });

  // Validación en tiempo real
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    
    if (query.length < 3) {
      showError('La búsqueda debe tener al menos 3 caracteres');
    } else if (query.length > 50) {
      showError('La búsqueda no puede tener más de 50 caracteres');
    } else {
      hideError();
    }
  });

  function showError(message) {
    searchError.textContent = message;
    searchError.classList.remove('hidden');
  }

  function hideError() {
    searchError.classList.add('hidden');
  }
});
