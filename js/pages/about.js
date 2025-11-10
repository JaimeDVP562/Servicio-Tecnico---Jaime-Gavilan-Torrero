/**
 * ABOUT.JS
 * Página sobre nosotros - Información de la empresa
 */

export default class About {
    constructor() {
        this.title = 'Sobre Nosotros - ElectroService';
    }

    getTitle() {
        return this.title;
    }

    async getHtml() {
        return `
            <div class="container fade-in">
                <!-- Hero -->
                <section class="hero">
                    <h1 class="hero-title">Sobre ElectroService</h1>
                    <p class="hero-subtitle">
                        Más de 15 años ofreciendo soluciones eléctricas de calidad
                    </p>
                </section>

                <!-- Quiénes somos -->
                <section style="margin: 3rem 0;">
                    <div class="card">
                        <h2 class="card-title" style="text-align: center; margin-bottom: 2rem;">
                            ¿Quiénes Somos?
                        </h2>
                        <p class="card-text" style="font-size: 1.125rem; line-height: 1.8; text-align: justify;">
                            <strong>ElectroService</strong> es una empresa especializada en servicios técnicos eléctricos 
                            fundada en 2010. Nacimos con el objetivo de ofrecer soluciones eléctricas profesionales, 
                            seguras y eficientes tanto para particulares como para empresas.
                        </p>
                        <p class="card-text" style="font-size: 1.125rem; line-height: 1.8; text-align: justify; margin-top: 1rem;">
                            A lo largo de estos años, hemos realizado cientos de proyectos de instalación, mantenimiento 
                            y reparación eléctrica, consolidándonos como una de las referencias en el sector en nuestra zona. 
                            Nuestra filosofía se basa en la <strong>calidad</strong>, la <strong>profesionalidad</strong> y 
                            la <strong>satisfacción del cliente</strong>.
                        </p>
                    </div>
                </section>

                <!-- Valores -->
                <section style="margin: 3rem 0;">
                    <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem; color: var(--text-primary);">
                        Nuestros Valores
                    </h2>
                    <div class="grid">
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                            <h3 class="card-title">Compromiso</h3>
                            <p class="card-text">
                                Nos comprometemos con cada proyecto, por pequeño que sea, ofreciendo 
                                el máximo nivel de profesionalidad.
                            </p>
                        </div>

                        <div class="card" style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
                            <h3 class="card-title">Seguridad</h3>
                            <p class="card-text">
                                La seguridad es nuestra prioridad. Cumplimos con todas las normativas 
                                y certificaciones vigentes.
                            </p>
                        </div>

                        <div class="card" style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">💡</div>
                            <h3 class="card-title">Innovación</h3>
                            <p class="card-text">
                                Apostamos por las últimas tecnologías y soluciones más eficientes 
                                del mercado.
                            </p>
                        </div>

                        <div class="card" style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🤝</div>
                            <h3 class="card-title">Confianza</h3>
                            <p class="card-text">
                                Construimos relaciones duraderas con nuestros clientes basadas en 
                                la transparencia y honestidad.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Equipo -->
                <section style="margin: 3rem 0;">
                    <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem; color: var(--text-primary);">
                        Nuestro Equipo
                    </h2>
                    <div class="card">
                        <p class="card-text" style="font-size: 1.125rem; line-height: 1.8; text-align: center;">
                            Contamos con un equipo de <strong>electricistas certificados</strong> con amplia experiencia 
                            en todo tipo de instalaciones eléctricas. Todos nuestros técnicos están al día en las últimas 
                            normativas y tecnologías del sector, garantizando un servicio de máxima calidad.
                        </p>
                        <div class="grid" style="margin-top: 2rem; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                            <div style="text-align: center; padding: 1rem;">
                                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👷</div>
                                <h4>Técnicos Certificados</h4>
                            </div>
                            <div style="text-align: center; padding: 1rem;">
                                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📚</div>
                                <h4>Formación Continua</h4>
                            </div>
                            <div style="text-align: center; padding: 1rem;">
                                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛠️</div>
                                <h4>Equipo Profesional</h4>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Cifras -->
                <section style="margin: 3rem 0;">
                    <div class="card" style="background: var(--secondary-color); color: white; padding: 3rem;">
                        <h2 style="text-align: center; margin-bottom: 3rem; font-size: 2rem; color: white;">
                            ElectroService en Números
                        </h2>
                        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem;">
                            <div style="text-align: center;">
                                <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">15+</div>
                                <div style="opacity: 0.9;">Años de Experiencia</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">500+</div>
                                <div style="opacity: 0.9;">Proyectos Completados</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">450+</div>
                                <div style="opacity: 0.9;">Clientes Satisfechos</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">24/7</div>
                                <div style="opacity: 0.9;">Servicio de Urgencias</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Certificaciones -->
                <section style="margin: 3rem 0;">
                    <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem; color: var(--text-primary);">
                        Certificaciones y Garantías
                    </h2>
                    <div class="card">
                        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                            <div style="padding: 1rem; text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: 0.5rem;">✓</div>
                                <h4>Empresa Autorizada</h4>
                                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">
                                    Instaladora autorizada por la Comunidad
                                </p>
                            </div>
                            <div style="padding: 1rem; text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: 0.5rem;">✓</div>
                                <h4>Seguro de RC</h4>
                                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">
                                    Seguro de responsabilidad civil
                                </p>
                            </div>
                            <div style="padding: 1rem; text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: 0.5rem;">✓</div>
                                <h4>Garantía 2 Años</h4>
                                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">
                                    En todos nuestros trabajos
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA final -->
                <section style="margin: 3rem 0;">
                    <div class="card" style="background: var(--primary-color); color: white; text-align: center; padding: 2rem;">
                        <h2 style="color: white; margin-bottom: 1rem;">¿Quieres trabajar con nosotros?</h2>
                        <p style="margin-bottom: 1.5rem; opacity: 0.95;">
                            Contacta con nuestro equipo y descubre cómo podemos ayudarte.
                        </p>
                        <a href="/contacto" class="btn btn-primary" data-link style="background: white; color: var(--primary-color);">
                            Contactar Ahora
                        </a>
                    </div>
                </section>
            </div>
        `;
    }

    async afterRender() {
        console.log('Página sobre nosotros cargada');
    }
}
