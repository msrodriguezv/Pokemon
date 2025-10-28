/* manejo de rutas */
export function initRouter() {
    window.addEventListener('hashchange', loadRoute);
    loadRoute();
}

function loadRoute() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    const route = window.location.hash || '#/login';
    const auth = JSON.parse(localStorage.getItem('auth'));

    // Limpiar clases del body
    document.body.className = '';

    if (!auth && route !== '#/login') {
        window.location.hash = '#/login';
        return;
    }

    // Cargar estilos dinámicos según la ruta
    const dynamicStyles = document.getElementById('dynamic-styles');
}