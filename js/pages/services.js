/**
 * SERVICES.JS
 * Página de servicios - Listado detallado de servicios ofrecidos
 */

export default class Services {
    constructor() {
        this.title = 'Servicios - ElectroService';
    }

    getTitle() {
        return this.title;
    }

    async getHtml() {
        return `
            <div class="container fade-in">
                <!-- Hero de servicios -->
                <section class="hero">
                    <h1 class="hero-title">⚡ Nuestros Servicios</h1>
                    <p class="hero-subtitle">
                        Soluciones eléctricas completas para particulares y empresas
                    </p>
                </section>

                <!-- Lista completa de servicios -->
                <section style="margin: 3rem 0;">
                    <div class="grid">
                        <!-- Instalaciones Eléctricas -->
                        <div class="card">
                            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🏠</div>
                            <h3 class="card-title">Instalaciones Eléctricas Completas</h3>
                            <p class="card-text">
                                Diseño e instalación de sistemas eléctricos desde cero para viviendas, locales y oficinas.
                            </p>
                            <ul style="margin-top: 1rem; color: var(--text-secondary); line-height: 1.8;">
                                <li>✓ Cuadros eléctricos y protecciones</li>
                                <li>✓ Cableado y canalizaciones</li>
                                <li>✓ Iluminación LED eficiente</li>
                                <li>✓ Tomas de corriente y mecanismos</li>
                            </ul>
                        </div>

                        <!-- Boletines y Certificados -->
                        <div class="card">
                            <div style="font-size: 2.5rem; margin-bottom: 1rem;">📋</div>
                            <h3 class="card-title">Boletines y Certificados</h3>
                            <p class="card-text">
                                Emisión de certificados eléctricos oficiales necesarios para altas y legalizaciones.
                            </p>
                            <ul style="margin-top: 1rem; color: var(--text-secondary); line-height: 1.8;">
                                <li>✓ Boletín de instalación eléctrica</li>
                                <li>✓ Certificados de eficiencia energética</li>
                                <li>✓ Inspecciones periódicas</li>
                                <li>✓ Gestión de documentación</li>
                            </ul>
                        </div>

                        <!-- Reparaciones -->
                        <div class="card">
                            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔧</div>
                            <h3 class="card-title">Reparaciones y Averías</h3>
                            <p class="card-text">
                                Diagnóstico y solución de problemas eléctricos con servicio de urgencias 24h.
                            </p>
                            <ul style="margin-top: 1rem; color: var(--text-secondary); line-height: 1.8;">
                                <li>✓ Detección de averías</li>
                                <li>✓ Cortocircuitos y sobrecargas</li>
                                <li>✓ Problemas de iluminación</li>
                                <li>✓ Servicio urgente 24/7</li>
                            </ul>
                        </div>

                        <!-- Domótica -->
                        <div class="card">
                            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🏡</div>
                            <h3 class="card-title">Domótica y Automatización</h3>
                            <p class="card-text">
                                Convierte tu hogar o negocio en inteligente con sistemas de automatización modernos.
                            </p>
                            <ul style="margin-top: 1rem; color: var(--text-secondary); line-height: 1.8;">
                                <li>✓ Control de iluminación inteligente</li>
                                <li>✓ Persianas y climatización automática</li>
                                <li>✓ Sistemas de seguridad</li>
                                <li>✓ Control por voz y app móvil</li>
                            </ul>
                        </div>

                        <!-- Mantenimiento -->
                        <div class="card">
                            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
                            <h3 class="card-title">Mantenimiento Preventivo</h3>
                            <p class="card-text">
                                Revisiones periódicas para garantizar la seguridad y eficiencia de tus instalaciones.
                            </p>
                            <ul style="margin-top: 1rem; color: var(--text-secondary); line-height: 1.8;">
                                <li>✓ Revisión de cuadros eléctricos</li>
                                <li>✓ Comprobación de tomas de tierra</li>
                                <li>✓ Termografía infrarroja</li>
                                <li>✓ Planes de mantenimiento anuales</li>
                            </ul>
                        </div>

                        <!-- Iluminación -->
                        <div class="card">
                            <div style="font-size: 2.5rem; margin-bottom: 1rem;">💡</div>
                            <h3 class="card-title">Iluminación Profesional</h3>
                            <p class="card-text">
                                Diseño e instalación de sistemas de iluminación LED eficientes y decorativos.
                            </p>
                            <ul style="margin-top: 1rem; color: var(--text-secondary); line-height: 1.8;">
                                <li>✓ Iluminación LED de bajo consumo</li>
                                <li>✓ Iluminación decorativa y ambiental</li>
                                <li>✓ Sistemas de emergencia</li>
                                <li>✓ Control de intensidad (dimmers)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- Sectores de trabajo -->
                <section style="margin: 3rem 0;">
                    <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem; color: var(--text-primary);">
                        Sectores en los que Trabajamos
                    </h2>
                    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏠</div>
                            <h4>Residencial</h4>
                        </div>
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏢</div>
                            <h4>Comercial</h4>
                        </div>
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏭</div>
                            <h4>Industrial</h4>
                        </div>
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏨</div>
                            <h4>Hostelería</h4>
                        </div>
                    </div>
                </section>

                <!-- Llamada a la acción -->
                <section style="margin: 3rem 0;">
                    <div class="card" style="background: var(--primary-color); color: white; text-align: center; padding: 2rem;">
                        <h2 style="color: white; margin-bottom: 1rem;">¿No encuentras lo que buscas?</h2>
                        <p style="margin-bottom: 1.5rem; opacity: 0.95;">
                            Contáctanos y cuéntanos tu proyecto. Ofrecemos soluciones personalizadas.
                        </p>
                        <a href="/contacto" class="btn btn-primary" data-link style="background: white; color: var(--primary-color);">
                            Solicitar Presupuesto
                        </a>
                    </div>
                </section>
            </div>
        `;
    }

    async afterRender() {
        console.log('Página de servicios cargada');
    }
}
