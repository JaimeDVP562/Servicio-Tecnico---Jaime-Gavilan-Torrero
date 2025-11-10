/**
 * ROUTER.JS
 * Sistema de enrutamiento para SPA usando History API
 * Maneja la navegación sin recargar la página
 */

// Importar páginas
import Home from './pages/home.js';
import Services from './pages/services.js';
import Contact from './pages/contact.js';
import About from './pages/about.js';

/**
 * Definición de rutas
 * Cada ruta tiene un path y una vista asociada
 */
const routes = [
    { path: '/', view: Home },
    { path: '/servicios', view: Services },
    { path: '/contacto', view: Contact },
    { path: '/sobre-nosotros', view: About }
];

/**
 * Coincide la ruta actual con las rutas definidas
 * @param {string} pathname - Ruta actual del navegador
 * @returns {Object} - Ruta coincidente o ruta 404
 */
const matchRoute = (pathname) => {
    // Buscar coincidencia exacta
    const match = routes.find(route => route.path === pathname);
    
    // Si no hay coincidencia, redirigir a home
    if (!match) {
        return routes[0]; // Home como fallback
    }
    
    return match;
};

/**
 * Navega a una nueva ruta usando History API
 * @param {string} url - URL a la que navegar
 */
export const navigateTo = (url) => {
    // Actualizar la URL sin recargar la página
    window.history.pushState(null, null, url);
    
    // Renderizar la nueva vista
    router();
};

/**
 * Actualiza la clase 'active' en los enlaces de navegación
 */
const updateActiveNavLink = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        // Obtener el href del enlace
        const linkPath = new URL(link.href).pathname;
        
        // Añadir o quitar clase 'active'
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

/**
 * Cierra el menú móvil después de hacer clic en un enlace
 */
const closeMobileMenu = () => {
    const navList = document.getElementById('navList');
    const navToggle = document.getElementById('navToggle');
    
    if (navList && navToggle) {
        navList.classList.remove('active');
        navToggle.classList.remove('active');
    }
};

/**
 * Router principal
 * Renderiza la vista correspondiente a la ruta actual
 */
export const router = async () => {
    // Obtener la ruta actual
    const pathname = window.location.pathname;
    
    // Encontrar la ruta coincidente
    const route = matchRoute(pathname);
    
    // Obtener el contenedor principal
    const app = document.getElementById('app');
    
    if (!app) {
        console.error('Contenedor #app no encontrado');
        return;
    }
    
    try {
        // Crear instancia de la vista
        const view = new route.view();
        
        // Añadir clase de transición
        app.classList.add('page-transition');
        
        // Renderizar el HTML de la vista
        app.innerHTML = await view.getHtml();
        
        // Ejecutar el método afterRender si existe
        if (typeof view.afterRender === 'function') {
            await view.afterRender();
        }
        
        // Actualizar navegación activa
        updateActiveNavLink();
        
        // Cerrar menú móvil si está abierto
        closeMobileMenu();
        
        // Scroll al inicio de la página
        window.scrollTo(0, 0);
        
        // Actualizar el título de la página
        document.title = view.getTitle ? view.getTitle() : 'ElectroService - Servicio Técnico Eléctrico';
        
    } catch (error) {
        console.error('Error al cargar la vista:', error);
        app.innerHTML = `
            <div class="container">
                <div class="hero" style="background: linear-gradient(135deg, #f44336, #e91e63);">
                    <h1 class="hero-title">⚠️ Error</h1>
                    <p class="hero-subtitle">No se pudo cargar la página</p>
                    <button class="btn btn-outline" onclick="location.href='/'">Volver al inicio</button>
                </div>
            </div>
        `;
    }
};

/**
 * Inicializa el router y los event listeners
 */
export const initRouter = () => {
    // Manejar clics en enlaces con data-link
    document.addEventListener('click', (e) => {
        // Verificar si el clic fue en un enlace con data-link
        const link = e.target.closest('[data-link]');
        
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Navegar a la nueva ruta
            navigateTo(href);
        }
    });
    
    // Manejar navegación con botones atrás/adelante del navegador
    window.addEventListener('popstate', router);
    
    // Manejar toggle del menú móvil
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            const nav = document.getElementById('nav');
            if (nav && !nav.contains(e.target) && navList.classList.contains('active')) {
                navList.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Renderizar la vista inicial
    router();
};
