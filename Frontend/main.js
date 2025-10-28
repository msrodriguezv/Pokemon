// Importar e inicializar el router
import { initRouter } from './src/routers/router.js';

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Aplicación PokéFav iniciada');
  
  // Inicializar el router
  initRouter();
});