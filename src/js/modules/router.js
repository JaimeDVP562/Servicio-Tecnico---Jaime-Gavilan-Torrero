/**
 * Router Manager
 * Handles client-side routing for SPA navigation
 * 
 * @author Jaime Gavilán Torrero
 * @version 1.0.0
 */

import { showAlert, showError } from '../utils/alerts.js';

class RouterManager {
  constructor(ui, auth) {
    this.ui = ui;
    this.auth = auth;
    this.routes = new Map();
    this.currentRoute = null;
    this.history = [];
    this.maxHistorySize = 20;
    
    // Define available routes
    this.defineRoutes();
  }

  /**
   * Initialize router
   */
  init() {
    // Listen for browser navigation
    window.addEventListener('popstate', (event) => {
      this.handlePopState(event);
    });

    // Handle hash changes
    window.addEventListener('hashchange', () => {
      this.handleRouteChange();
    });

    // Handle initial route
    this.handleRouteChange();
    
    console.log('✅ Router initialized');
  }

  /**
   * Define application routes
   */
  defineRoutes() {
    // Public routes (no authentication required)
    this.routes.set('', {
      name: 'login',
      title: 'Iniciar Sesión',
      requiresAuth: false,
      handler: () => this.showLoginView()
    });

    this.routes.set('login', {
      name: 'login',
      title: 'Iniciar Sesión',
      requiresAuth: false,
      handler: () => this.showLoginView()
    });

    // Private routes (authentication required)
    this.routes.set('dashboard', {
      name: 'dashboard',
      title: 'Dashboard',
      requiresAuth: true,
      handler: () => this.showDashboardView()
    });

    this.routes.set('tickets', {
      name: 'tickets',
      title: 'Gestión de Tickets',
      requiresAuth: true,
      handler: () => this.showTicketsView()
    });

    this.routes.set('tickets/new', {
      name: 'ticket-new',
      title: 'Nuevo Ticket',
      requiresAuth: true,
      handler: () => this.showNewTicketView()
    });

    this.routes.set('tickets/:id', {
      name: 'ticket-detail',
      title: 'Detalle del Ticket',
      requiresAuth: true,
      handler: (params) => this.showTicketDetailView(params.id)
    });

    this.routes.set('repuestos', {
      name: 'repuestos',
      title: 'Gestión de Repuestos',
      requiresAuth: true,
      handler: () => this.showRepuestosView()
    });

    this.routes.set('repuestos/new', {
      name: 'repuesto-new',
      title: 'Nuevo Repuesto',
      requiresAuth: true,
      handler: () => this.showNewRepuestoView()
    });

    this.routes.set('repuestos/:id', {
      name: 'repuesto-detail',
      title: 'Detalle del Repuesto',
      requiresAuth: true,
      handler: (params) => this.showRepuestoDetailView(params.id)
    });

    this.routes.set('clientes', {
      name: 'clientes',
      title: 'Gestión de Clientes',
      requiresAuth: true,
      handler: () => this.showClientesView()
    });

    this.routes.set('profile', {
      name: 'profile',
      title: 'Mi Perfil',
      requiresAuth: true,
      handler: () => this.showProfileView()
    });

    this.routes.set('settings', {
      name: 'settings',
      title: 'Configuración',
      requiresAuth: true,
      handler: () => this.showSettingsView()
    });
  }

  /**
   * Navigate to a route
   * @param {string} route - Route path
   * @param {Object} state - Optional state data
   * @param {boolean} replace - Replace current history entry
   */
  navigate(route, state = null, replace = false) {
    try {
      const url = `#${route}`;
      
      if (replace) {
        window.history.replaceState(state, '', url);
      } else {
        window.history.pushState(state, '', url);
      }
      
      this.handleRouteChange();
    } catch (error) {
      console.error('❌ Navigation failed:', error);
      showError('Error en la navegación');
    }
  }

  /**
   * Go back in history
   */
  goBack() {
    if (this.history.length > 1) {
      window.history.back();
    } else {
      this.navigate('dashboard');
    }
  }

  /**
   * Go forward in history
   */
  goForward() {
    window.history.forward();
  }

  /**
   * Handle route changes
   */
  handleRouteChange() {
    const hash = window.location.hash.slice(1); // Remove #
    const route = this.parseRoute(hash);
    
    // Check authentication for protected routes
    if (route.config?.requiresAuth && !this.auth.isAuthenticated()) {
      this.navigate('login', { redirectTo: hash });
      return;
    }

    // Update current route
    this.currentRoute = route;
    
    // Update browser title
    document.title = `TechFix Pro - ${route.config?.title || 'Gestión de Servicio Técnico'}`;
    
    // Add to history
    this.addToHistory(route);
    
    // Update active navigation
    this.updateActiveNavigation(route.name);
    
    // Execute route handler
    if (route.config?.handler) {
      try {
        route.config.handler(route.params);
      } catch (error) {
        console.error('❌ Route handler failed:', error);
        this.show404();
      }
    } else {
      this.show404();
    }
  }

  /**
   * Parse route and extract parameters
   * @param {string} hash - Current hash
   */
  parseRoute(hash) {
    // Handle empty hash
    if (!hash) {
      return {
        name: 'login',
        path: '',
        params: {},
        config: this.routes.get('')
      };
    }

    // Try exact match first
    if (this.routes.has(hash)) {
      return {
        name: hash,
        path: hash,
        params: {},
        config: this.routes.get(hash)
      };
    }

    // Try parameterized routes
    for (const [pattern, config] of this.routes) {
      const params = this.matchPattern(pattern, hash);
      if (params !== null) {
        return {
          name: config.name,
          path: hash,
          params: params,
          config: config
        };
      }
    }

    // No match found
    return {
      name: '404',
      path: hash,
      params: {},
      config: null
    };
  }

  /**
   * Match route pattern with parameters
   * @param {string} pattern - Route pattern
   * @param {string} path - Current path
   */
  matchPattern(pattern, path) {
    if (!pattern.includes(':')) {
      return pattern === path ? {} : null;
    }

    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        const paramName = patternPart.slice(1);
        params[paramName] = pathPart;
      } else if (patternPart !== pathPart) {
        return null;
      }
    }

    return params;
  }

  /**
   * Add route to navigation history
   * @param {Object} route - Route object
   */
  addToHistory(route) {
    this.history.push({
      route: route,
      timestamp: Date.now()
    });

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Handle browser back/forward buttons
   * @param {PopStateEvent} event - Pop state event
   */
  handlePopState(event) {
    this.handleRouteChange();
  }

  /**
   * Update active navigation items
   * @param {string} routeName - Current route name
   */
  updateActiveNavigation(routeName) {
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to current nav item
    const activeItem = document.querySelector(`[data-route="${routeName}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }

  // Route Handlers - These show placeholder content for Sprint 1
  // Full implementation will be done in Sprint 2

  /**
   * Show login view
   */
  showLoginView() {
    this.ui.showPublicZone();
  }

  /**
   * Show dashboard view
   */
  showDashboardView() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.ui.showPrivateZone(user);
    }
  }

  /**
   * Show tickets view (placeholder)
   */
  showTicketsView() {
    this.showPlaceholderView('tickets', 'Gestión de Tickets');
  }

  /**
   * Show new ticket view (placeholder)
   */
  showNewTicketView() {
    this.showPlaceholderView('ticket-new', 'Crear Nuevo Ticket');
  }

  /**
   * Show ticket detail view (placeholder)
   * @param {string} ticketId - Ticket ID
   */
  showTicketDetailView(ticketId) {
    this.showPlaceholderView('ticket-detail', `Ticket #${ticketId}`);
  }

  /**
   * Show repuestos view (placeholder)
   */
  showRepuestosView() {
    this.showPlaceholderView('repuestos', 'Gestión de Repuestos');
  }

  /**
   * Show new repuesto view (placeholder)
   */
  showNewRepuestoView() {
    this.showPlaceholderView('repuesto-new', 'Agregar Repuesto');
  }

  /**
   * Show repuesto detail view (placeholder)
   * @param {string} repuestoId - Repuesto ID
   */
  showRepuestoDetailView(repuestoId) {
    this.showPlaceholderView('repuesto-detail', `Repuesto #${repuestoId}`);
  }

  /**
   * Show clientes view (placeholder)
   */
  showClientesView() {
    this.showPlaceholderView('clientes', 'Gestión de Clientes');
  }

  /**
   * Show profile view (placeholder)
   */
  showProfileView() {
    this.showPlaceholderView('profile', 'Mi Perfil');
  }

  /**
   * Show settings view (placeholder)
   */
  showSettingsView() {
    this.showPlaceholderView('settings', 'Configuración');
  }

  /**
   * Show placeholder view for Sprint 2 features
   * @param {string} viewName - View name
   * @param {string} title - View title
   */
  showPlaceholderView(viewName, title) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-gear me-2"></i>
                    ${title}
                  </h5>
                </div>
                <div class="card-body">
                  <div class="text-center py-5">
                    <i class="bi bi-tools display-1 text-muted"></i>
                    <h4 class="mt-3 text-muted">Próximamente</h4>
                    <p class="text-muted">
                      Esta funcionalidad se implementará en el <strong>Sprint 2</strong>.
                    </p>
                    <button class="btn btn-primary" onclick="history.back()">
                      <i class="bi bi-arrow-left me-2"></i>
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    showAlert(`Accediendo a: ${title} - Función en desarrollo para Sprint 2`, 'info');
  }

  /**
   * Show 404 error page
   */
  show404() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="container-fluid">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <div class="text-center py-5">
                <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
                <h2 class="mt-3">Página no encontrada</h2>
                <p class="text-muted">La página que buscas no existe o ha sido movida.</p>
                <div class="mt-4">
                  <button class="btn btn-primary me-2" onclick="window.location.hash='dashboard'">
                    <i class="bi bi-house me-2"></i>
                    Ir al Dashboard
                  </button>
                  <button class="btn btn-outline-secondary" onclick="history.back()">
                    <i class="bi bi-arrow-left me-2"></i>
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Get current route information
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Check if route requires authentication
   * @param {string} route - Route to check
   */
  requiresAuth(route) {
    const config = this.routes.get(route);
    return config?.requiresAuth || false;
  }

  /**
   * Get navigation history
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Clear navigation history
   */
  clearHistory() {
    this.history = [];
  }

  /**
   * Generate URL for route
   * @param {string} route - Route name
   * @param {Object} params - Route parameters
   */
  generateUrl(route, params = {}) {
    let url = route;
    
    // Replace parameters in URL
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
    
    return `#${url}`;
  }
}

export default RouterManager;