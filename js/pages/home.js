/**
 * HOME.JS
 * Página de inicio - Vista principal de la SPA
 */

export default class Home {
    constructor() {
        this.title = 'Inicio - ElectroService';
    }

    /**
     * Devuelve el título de la página
     */
    getTitle() {
        return this.title;
    }

    /**
     * Genera el HTML de la página de inicio
     */
    async getHtml() {
        return `
            <div class="container fade-in">
                <!-- Hero principal -->
                <section class="hero">
                    <h1 class="hero-title">⚡ Servicio Técnico Eléctrico Profesional</h1>
                    <p class="hero-subtitle">
                        Instalaciones, reparaciones y mantenimiento eléctrico con más de 15 años de experiencia
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
                        <a href="/contacto" class="btn btn-primary" data-link>Solicitar Presupuesto</a>
                        <a href="/servicios" class="btn btn-outline" data-link>Ver Servicios</a>
                    </div>
                </section>

                <!-- Características destacadas -->
                <section style="margin: 3rem 0;">
                    <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem; color: var(--text-primary);">
                        ¿Por qué elegirnos?
                    </h2>
                    <div class="grid">
                        <div class="card">
                            <div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">🔧</div>
                            <h3 class="card-title" style="text-align: center;">Profesionalidad</h3>
                            <p class="card-text" style="text-align: center;">
                                Técnicos certificados con amplia experiencia en instalaciones eléctricas
                            </p>
                        </div>
                        
                        <div class="card">
                            <div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">⚡</div>
                            <h3 class="card-title" style="text-align: center;">Rapidez</h3>
                            <p class="card-text" style="text-align: center;">
                                Respuesta inmediata. Servicios de urgencia 24/7 para emergencias
                            </p>
                        </div>
                        
                        <div class="card">
                            <div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">✓</div>
                            <h3 class="card-title" style="text-align: center;">Garantía</h3>
                            <p class="card-text" style="text-align: center;">
                                Todos nuestros trabajos incluyen garantía de hasta 2 años
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Servicios destacados -->
                <section style="margin: 3rem 0;">
                    <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem; color: var(--text-primary);">
                        Nuestros Servicios Principales
                    </h2>
                    <div class="grid">
                        <div class="card">
                            <h3 class="card-title">🏠 Instalaciones Residenciales</h3>
                            <p class="card-text">
                                Instalación completa de sistemas eléctricos en viviendas, incluyendo cuadros eléctricos, 
                                iluminación, enchufes y domótica.
                            </p>
                        </div>
                        
                        <div class="card">
                            <h3 class="card-title">🏢 Instalaciones Comerciales</h3>
                            <p class="card-text">
                                Proyectos eléctricos para locales comerciales, oficinas y naves industriales con 
                                certificación oficial.
                            </p>
                        </div>
                        
                        <div class="card">
                            <h3 class="card-title">🔌 Mantenimiento y Reparaciones</h3>
                            <p class="card-text">
                                Revisiones periódicas, detección de averías, reparación de fallos eléctricos y 
                                actualización de instalaciones.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 2rem;">
                        <a href="/servicios" class="btn btn-secondary" data-link>Ver Todos los Servicios</a>
                    </div>
                </section>

                <!-- Llamada a la acción -->
                <section style="margin: 3rem 0;">
                    <div class="card" style="background: linear-gradient(135deg, var(--primary-light), var(--secondary-light)); color: white; text-align: center; padding: 3rem;">
                        <h2 style="font-size: 2rem; margin-bottom: 1rem; color: white;">
                            ¿Necesitas un electricista?
                        </h2>
                        <p style="font-size: 1.125rem; margin-bottom: 2rem; opacity: 0.95;">
                            Solicita tu presupuesto sin compromiso. Respondemos en menos de 24 horas.
                        </p>
                        <a href="/contacto" class="btn btn-primary" data-link style="background: white; color: var(--primary-color);">
                            Contactar Ahora
                        </a>
                    </div>
                </section>
            </div>
        `;
    }

    /**
     * Método ejecutado después de renderizar el HTML
     * Útil para añadir event listeners o inicializar componentes
     */
    async afterRender() {
        console.log('Página de inicio cargada');
    }
}
