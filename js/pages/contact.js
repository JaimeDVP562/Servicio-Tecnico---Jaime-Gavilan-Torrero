/**
 * CONTACT.JS
 * Página de contacto - Formulario de presupuesto y datos de contacto
 */

export default class Contact {
    constructor() {
        this.title = 'Contacto - ElectroService';
    }

    getTitle() {
        return this.title;
    }

    async getHtml() {
        return `
            <div class="container fade-in">
                <!-- Hero -->
                <section class="hero">
                    <h1 class="hero-title">📞 Solicita tu Presupuesto</h1>
                    <p class="hero-subtitle">
                        Sin compromiso. Te respondemos en menos de 24 horas
                    </p>
                </section>

                <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin: 3rem 0;">
                    <!-- Formulario de contacto -->
                    <section class="card">
                        <h2 class="card-title">Formulario de Contacto</h2>
                        <p class="card-text" style="margin-bottom: 2rem;">
                            Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                        </p>
                        
                        <form id="contactForm" style="display: flex; flex-direction: column; gap: 1.5rem;">
                            <div class="form-group">
                                <label for="name" class="form-label">Nombre completo *</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    class="form-input" 
                                    required 
                                    placeholder="Juan Pérez"
                                >
                            </div>

                            <div class="form-group">
                                <label for="email" class="form-label">Email *</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    class="form-input" 
                                    required 
                                    placeholder="juan@ejemplo.com"
                                >
                            </div>

                            <div class="form-group">
                                <label for="phone" class="form-label">Teléfono *</label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    name="phone" 
                                    class="form-input" 
                                    required 
                                    placeholder="+34 123 456 789"
                                >
                            </div>

                            <div class="form-group">
                                <label for="service" class="form-label">Tipo de servicio</label>
                                <select id="service" name="service" class="form-select">
                                    <option value="">Selecciona un servicio</option>
                                    <option value="instalacion">Instalación eléctrica</option>
                                    <option value="reparacion">Reparación/Avería</option>
                                    <option value="mantenimiento">Mantenimiento</option>
                                    <option value="domotica">Domótica</option>
                                    <option value="certificado">Boletín/Certificado</option>
                                    <option value="iluminacion">Iluminación</option>
                                    <option value="otros">Otros</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="message" class="form-label">Mensaje *</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    class="form-textarea" 
                                    required 
                                    placeholder="Describe tu proyecto o necesidad..."
                                ></textarea>
                            </div>

                            <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem;">
                                <input 
                                    type="checkbox" 
                                    id="privacy" 
                                    name="privacy" 
                                    required
                                    style="width: auto;"
                                >
                                <label for="privacy" style="margin: 0; font-weight: normal; font-size: 0.875rem;">
                                    Acepto la política de privacidad y el tratamiento de mis datos *
                                </label>
                            </div>

                            <button type="submit" class="btn btn-primary" style="align-self: flex-start;">
                                Enviar Solicitud
                            </button>

                            <div id="formMessage" style="display: none; padding: 1rem; border-radius: var(--radius-md); margin-top: 1rem;"></div>
                        </form>
                    </section>

                    <!-- Información de contacto -->
                    <section style="display: grid; gap: 1.5rem;">
                        <div class="card">
                            <h3 class="card-title">📍 Dirección</h3>
                            <p class="card-text">
                                Calle Principal, 123<br>
                                28001 Madrid, España
                            </p>
                        </div>

                        <div class="card">
                            <h3 class="card-title">📞 Teléfono</h3>
                            <p class="card-text">
                                <strong>Fijo:</strong> +34 91 123 45 67<br>
                                <strong>Móvil:</strong> +34 600 123 456<br>
                                <strong>Urgencias 24h:</strong> +34 600 999 888
                            </p>
                        </div>

                        <div class="card">
                            <h3 class="card-title">📧 Email</h3>
                            <p class="card-text">
                                <strong>General:</strong> info@electroservice.es<br>
                                <strong>Presupuestos:</strong> presupuestos@electroservice.es
                            </p>
                        </div>

                        <div class="card">
                            <h3 class="card-title">🕒 Horario</h3>
                            <p class="card-text">
                                <strong>Lunes - Viernes:</strong> 8:00 - 20:00<br>
                                <strong>Sábados:</strong> 9:00 - 14:00<br>
                                <strong>Domingos:</strong> Cerrado<br>
                                <em style="color: var(--primary-color); margin-top: 0.5rem; display: block;">
                                    Servicio de urgencias disponible 24/7
                                </em>
                            </p>
                        </div>
                    </section>
                </div>

                <!-- Mapa (placeholder) -->
                <section class="card" style="margin: 2rem 0; padding: 0; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #e0e0e0, #bdbdbd); height: 300px; display: flex; align-items: center; justify-content: center; color: #757575;">
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🗺️</div>
                            <p>Mapa de ubicación</p>
                            <p style="font-size: 0.875rem;">(Integración con Google Maps)</p>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    async afterRender() {
        console.log('Página de contacto cargada');
        
        // Manejar envío del formulario
        const form = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Obtener datos del formulario
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                console.log('Datos del formulario:', data);
                
                // Simular envío (aquí iría la llamada a un backend o servicio de email)
                formMessage.style.display = 'block';
                formMessage.style.backgroundColor = 'var(--success)';
                formMessage.style.color = 'white';
                formMessage.innerHTML = `
                    <strong>✓ ¡Mensaje enviado con éxito!</strong><br>
                    Nos pondremos en contacto contigo en menos de 24 horas.
                `;
                
                // Limpiar formulario
                form.reset();
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            });
        }
    }
}
