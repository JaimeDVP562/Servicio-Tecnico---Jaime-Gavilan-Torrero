/**
 * UI Manager
 * Handles DOM manipulation and user interface updates
 * 
 * @author Jaime Gavilán Torrero
 * @version 1.0.0
 */

import { showAlert, showLoading, hideLoading, showError, showSuccess } from '../utils/alerts.js';

class UIManager {
  constructor(storage, api) {
    this.storage = storage;
    this.api = api;
    this.currentUser = null;
    this.dashboardData = {
      tickets: [],
      repuestos: [],
      stats: {}
    };
  }

  /**
   * Initialize UI components
   */
  init() {
    this.bindEvents();
    this.updateTimestamp();
    console.log('✅ UI Manager initialized');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Refresh dashboard button
    const refreshBtn = document.getElementById('refresh-dashboard');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshDashboard());
    }

    // Profile dropdown
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileDropdown) {
      profileDropdown.addEventListener('click', (e) => this.handleProfileDropdown(e));
    }

    // Search functionality (placeholder for Sprint 2)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e));
    }

    // Responsive sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }
  }

  /**
   * Show the private zone (dashboard)
   * @param {Object} user - Current user data
   */
  async showPrivateZone(user) {
    this.currentUser = user;
    
    // Hide public zone
    const publicZone = document.getElementById('public-zone');
    const privateZone = document.getElementById('private-zone');
    
    if (publicZone) publicZone.classList.add('d-none');
    if (privateZone) {
      privateZone.classList.remove('d-none');
      
      // Update user info in navbar
      this.updateUserNavbar(user);
      
      // Load dashboard data
      await this.loadDashboard();
    }
  }

  /**
   * Show the public zone (login)
   */
  showPublicZone() {
    const publicZone = document.getElementById('public-zone');
    const privateZone = document.getElementById('private-zone');
    
    if (privateZone) privateZone.classList.add('d-none');
    if (publicZone) {
      publicZone.classList.remove('d-none');
      
      // Clear login form
      this.clearLoginForm();
    }
    
    this.currentUser = null;
  }

  /**
   * Update user information in navbar
   * @param {Object} user - User data
   */
  updateUserNavbar(user) {
    const userNameElement = document.getElementById('user-name');
    const userRoleElement = document.getElementById('user-role');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (userNameElement) {
      userNameElement.textContent = user.username || 'Usuario';
    }
    
    if (userRoleElement) {
      const role = user.role?.name || 'Técnico';
      userRoleElement.textContent = role;
      userRoleElement.className = `badge ${this.getRoleBadgeClass(role)}`;
    }
    
    if (userAvatarElement) {
      const initials = this.getUserInitials(user.username || 'U');
      userAvatarElement.textContent = initials;
    }
  }

  /**
   * Load and display dashboard data
   */
  async loadDashboard() {
    try {
      showLoading();
      
      // Load data in parallel
      const [ticketsData, repuestosData, statsData] = await Promise.allSettled([
        this.loadRecentTickets(),
        this.loadLowStockRepuestos(),
        this.loadDashboardStats()
      ]);

      // Update dashboard sections
      if (ticketsData.status === 'fulfilled') {
        this.updateTicketsSection(ticketsData.value);
      }
      
      if (repuestosData.status === 'fulfilled') {
        this.updateRepuestosSection(repuestosData.value);
      }
      
      if (statsData.status === 'fulfilled') {
        this.updateStatsCards(statsData.value);
      }
      
      this.updateTimestamp();
      
    } catch (error) {
      console.error('❌ Dashboard load failed:', error);
      showError('Error al cargar el dashboard');
    } finally {
      hideLoading();
    }
  }

  /**
   * Load recent tickets
   */
  async loadRecentTickets() {
    try {
      const tickets = await this.api.getTickets({ 
        pagination: { page: 1, pageSize: 5 },
        sort: ['fecha_creacion:desc']
      });
      
      this.dashboardData.tickets = tickets.data || [];
      return tickets.data || [];
    } catch (error) {
      console.warn('Failed to load tickets from API, using cache');
      const cached = await this.storage.getAll('tickets');
      return cached.slice(0, 5);
    }
  }

  /**
   * Load low stock repuestos
   */
  async loadLowStockRepuestos() {
    try {
      const repuestos = await this.api.getRepuestos({
        filters: { stock: { $lt: 10 } },
        pagination: { page: 1, pageSize: 5 }
      });
      
      this.dashboardData.repuestos = repuestos.data || [];
      return repuestos.data || [];
    } catch (error) {
      console.warn('Failed to load repuestos from API, using cache');
      const cached = await this.storage.getAll('repuestos');
      return cached.filter(r => r.stock < 10).slice(0, 5);
    }
  }

  /**
   * Load dashboard statistics
   */
  async loadDashboardStats() {
    try {
      // In a real implementation, this would be a specific API endpoint
      const [ticketsCount, repuestosCount] = await Promise.allSettled([
        this.api.getTicketsCount(),
        this.api.getRepuestosCount()
      ]);

      const stats = {
        totalTickets: ticketsCount.status === 'fulfilled' ? ticketsCount.value : 0,
        totalRepuestos: repuestosCount.status === 'fulfilled' ? repuestosCount.value : 0,
        pendingTickets: 0,
        lowStock: 0
      };

      this.dashboardData.stats = stats;
      return stats;
    } catch (error) {
      console.warn('Failed to load stats');
      return { totalTickets: 0, totalRepuestos: 0, pendingTickets: 0, lowStock: 0 };
    }
  }

  /**
   * Update tickets section in dashboard
   * @param {Array} tickets - Tickets data
   */
  updateTicketsSection(tickets) {
    const container = document.getElementById('recent-tickets');
    if (!container) return;

    if (!tickets || tickets.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="bi bi-inbox fs-1"></i>
          <p class="mt-2">No hay tickets recientes</p>
        </div>
      `;
      return;
    }

    const ticketsHTML = tickets.map(ticket => `
      <div class="card mb-2">
        <div class="card-body py-2">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-title mb-1">#${ticket.id} - ${ticket.titulo || 'Sin título'}</h6>
              <small class="text-muted">Cliente: ${ticket.cliente?.nombre || 'Desconocido'}</small>
            </div>
            <div class="text-end">
              <span class="badge ${this.getEstadoBadgeClass(ticket.estado)}">
                ${ticket.estado || 'Nuevo'}
              </span>
              <br>
              <small class="text-muted">
                ${this.formatDate(ticket.fecha_creacion)}
              </small>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = ticketsHTML;
  }

  /**
   * Update repuestos section in dashboard
   * @param {Array} repuestos - Repuestos data
   */
  updateRepuestosSection(repuestos) {
    const container = document.getElementById('low-stock-repuestos');
    if (!container) return;

    if (!repuestos || repuestos.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="bi bi-check-circle fs-1"></i>
          <p class="mt-2">Stock suficiente</p>
        </div>
      `;
      return;
    }

    const repuestosHTML = repuestos.map(repuesto => `
      <div class="card mb-2">
        <div class="card-body py-2">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-title mb-1">${repuesto.nombre || 'Sin nombre'}</h6>
              <small class="text-muted">Ref: ${repuesto.referencia || 'N/A'}</small>
            </div>
            <div class="text-end">
              <span class="badge ${this.getStockBadgeClass(repuesto.stock)}">
                Stock: ${repuesto.stock || 0}
              </span>
              <br>
              <small class="text-muted">
                €${repuesto.precio?.toFixed(2) || '0.00'}
              </small>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = repuestosHTML;
  }

  /**
   * Update statistics cards
   * @param {Object} stats - Statistics data
   */
  updateStatsCards(stats) {
    this.updateStatCard('total-tickets-count', stats.totalTickets || 0);
    this.updateStatCard('total-repuestos-count', stats.totalRepuestos || 0);
    this.updateStatCard('pending-tickets-count', stats.pendingTickets || 0);
    this.updateStatCard('low-stock-count', stats.lowStock || 0);
  }

  /**
   * Update individual stat card
   * @param {string} elementId - Element ID
   * @param {number} value - New value
   */
  updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      // Animate number change
      const currentValue = parseInt(element.textContent) || 0;
      this.animateNumber(element, currentValue, value, 1000);
    }
  }

  /**
   * Animate number transition
   * @param {HTMLElement} element - Element to animate
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} duration - Animation duration in ms
   */
  animateNumber(element, start, end, duration) {
    const range = end - start;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.round(start + (range * progress));
      element.textContent = current;

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16); // ~60fps
  }

  /**
   * Clear login form
   */
  clearLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.reset();
      
      // Clear validation states
      const inputs = loginForm.querySelectorAll('.form-control');
      inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
      });
    }
  }

  /**
   * Refresh dashboard data
   */
  async refreshDashboard() {
    showSuccess('Actualizando dashboard...');
    await this.loadDashboard();
    showSuccess('Dashboard actualizado');
  }

  /**
   * Handle search input
   * @param {Event} event - Input event
   */
  handleSearch(event) {
    const query = event.target.value.trim();
    if (query.length > 2) {
      // Placeholder for search functionality in Sprint 2
      console.log('Search query:', query);
    }
  }

  /**
   * Toggle responsive sidebar
   */
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('show');
    }
  }

  /**
   * Handle profile dropdown
   * @param {Event} event - Click event
   */
  handleProfileDropdown(event) {
    event.preventDefault();
    // Profile dropdown functionality will be enhanced in Sprint 2
  }

  /**
   * Update last update timestamp
   */
  updateTimestamp() {
    const timestampElement = document.getElementById('last-update');
    if (timestampElement) {
      timestampElement.textContent = new Date().toLocaleString();
    }
  }

  /**
   * Get badge class for ticket estado
   * @param {string} estado - Ticket estado
   */
  getEstadoBadgeClass(estado) {
    const classes = {
      'nuevo': 'bg-primary',
      'en_progreso': 'bg-warning',
      'pendiente': 'bg-info',
      'completado': 'bg-success',
      'cerrado': 'bg-secondary'
    };
    return classes[estado?.toLowerCase()] || 'bg-secondary';
  }

  /**
   * Get badge class for user role
   * @param {string} role - User role
   */
  getRoleBadgeClass(role) {
    const classes = {
      'admin': 'bg-danger',
      'tecnico': 'bg-primary',
      'usuario': 'bg-secondary'
    };
    return classes[role?.toLowerCase()] || 'bg-secondary';
  }

  /**
   * Get badge class for stock level
   * @param {number} stock - Stock quantity
   */
  getStockBadgeClass(stock) {
    if (stock === 0) return 'bg-danger';
    if (stock < 5) return 'bg-warning';
    if (stock < 10) return 'bg-info';
    return 'bg-success';
  }

  /**
   * Get user initials
   * @param {string} name - User name
   */
  getUserInitials(name) {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  /**
   * Format date for display
   * @param {string|Date} date - Date to format
   */
  formatDate(date) {
    if (!date) return 'N/A';
    
    try {
      const d = new Date(date);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  /**
   * Show loading state for specific element
   * @param {string} elementId - Element ID
   */
  showElementLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
      `;
    }
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.storage.getLocal('theme', 'light');
  }

  /**
   * Set theme (placeholder for Sprint 2)
   * @param {string} theme - Theme name
   */
  setTheme(theme) {
    this.storage.setLocal('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    console.log(`Theme changed to: ${theme}`);
  }
}

export default UIManager;