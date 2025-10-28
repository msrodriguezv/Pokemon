import { LoginView } from '../views/LoginView.js';
import { HomeView } from '../views/HomeView.js';
import { isAuthenticated } from '../api/api.js';

// Mapa de rutas
const routes = {
  '#/': { view: LoginView, requiresAuth: false },
  '#/login': { view: LoginView, requiresAuth: false },
  '#/home': { view: HomeView, requiresAuth: true },
  // Agregar más rutas aquí:
  // '#/favorites': { view: FavoritesView, requiresAuth: true },
};

let currentView = null;

/**
 * Cargar y renderizar una vista
 */
function loadRoute() {
  const hash = window.location.hash || '#/';
  const route = routes[hash];

  // Si la ruta no existe, redirigir
  if (!route) {
    if (isAuthenticated()) {
      window.location.hash = '#/home';
    } else {
      window.location.hash = '#/login';
    }
    return;
  }

  // Protección de rutas
  if (route.requiresAuth && !isAuthenticated()) {
    window.location.hash = '#/login';
    return;
  }

  // Si está autenticado y va a login, redirigir a home
  if ((hash === '#/' || hash === '#/login') && isAuthenticated()) {
    window.location.hash = '#/home';
    return;
  }

  // Limpiar vista anterior
  if (currentView && typeof currentView.destroy === 'function') {
    currentView.destroy();
  }

  // Crear y renderizar nueva vista
  const ViewClass = route.view;
  currentView = new ViewClass();

  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = currentView.render();

    if (typeof currentView.afterRender === 'function') {
      currentView.afterRender();
    }
  }

  // Limpiar clases del body
  document.body.className = '';
  
  // Agregar clase según la ruta
  const routeName = hash.replace('#/', '') || 'login';
  document.body.classList.add(`${routeName}-page`);
}

/**
 * Navegar a una ruta programáticamente
 */
function navigate(hash) {
  window.location.hash = hash;
}

/**
 * Inicializar el router
 */
export function initRouter() {
  // Manejar cambios de hash
  window.addEventListener('hashchange', loadRoute);
  
  // Cargar ruta inicial
  loadRoute();

  // Manejar clicks en enlaces con data-link
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    
    if (link) {
      e.preventDefault();
      const hash = link.getAttribute('href');
      navigate(hash);
    }
  });
}

export { loadRoute, navigate };