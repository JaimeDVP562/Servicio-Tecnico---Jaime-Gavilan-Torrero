/**
 * APP.JS
 * Punto de entrada principal de la aplicación SPA
 * Inicializa el router y configura la aplicación
 */

import { initRouter } from './router.js';

/**
 * Inicialización de la aplicación
 * Se ejecuta cuando el DOM está completamente cargado
 */
const init = () => {
    console.log('🚀 ElectroService SPA iniciado');
    
    // Inicializar el sistema de rutas
    initRouter();
    
    // Mostrar mensaje de bienvenida en consola
    console.log('%c⚡ ElectroService', 'color: #ff9800; font-size: 20px; font-weight: bold;');
    console.log('%cServicio Técnico Eléctrico Profesional', 'color: #2196f3; font-size: 14px;');
};

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // El DOM ya está listo
    init();
}
