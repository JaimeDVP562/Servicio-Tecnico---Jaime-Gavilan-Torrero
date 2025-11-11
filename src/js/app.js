/**
 * TechFix Pro - Main Application Entry Point
 * Single Page Application for Technical Service Management
 * 
 * @author Jaime Gavilán Torrero
 * @version 1.0.0
 */

// Import modules
import AuthManager from './modules/auth.js';
import APIClient from './modules/api.js';
import StorageManager from './modules/storage.js';
import UIManager from './modules/ui.js';
import RouterManager from './modules/router.js';
import { showAlert, showLoading, hideLoading, showSuccess, showError } from './utils/alerts.js';

/**
 * Main Application Class
 * Manages the entire SPA lifecycle and coordinates all modules
 */
class TechFixApp {
  constructor() {
    this.isInitialized = false;
    this.modules = {};
    
    // Configuration
    this.config = {
      apiBaseUrl: 'http://localhost:1337/api',
      apiTimeout: 10000,
      offlineRetryInterval: 30000,
      maxRetries: 3
    };
  }

  /**
   * Initialize the application
   * Sets up all modules and starts the app
   */
  async initialize() {
    try {
      showLoading();
      
      console.log('🚀 Initializing TechFix Pro v1.0.0...');
      
      // Initialize core modules
      await this.initializeModules();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize routing
      await this.initializeRouting();
      
      // Check authentication status
      await this.checkAuthenticationStatus();
      
      this.isInitialized = true;
      hideLoading();
      
      console.log('✅ TechFix Pro initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing TechFix Pro:', error);
      hideLoading();
      showAlert('Error al inicializar la aplicación', 'error');
    }
  }

  /**
   * Initialize all application modules
   */
  async initializeModules() {
    try {
      // Initialize storage first (needed by other modules)
      this.modules.storage = new StorageManager();
      await this.modules.storage.init();
      
      // Initialize API client
      this.modules.api = new APIClient(this.config.apiBaseUrl, {
        timeout: this.config.apiTimeout,
        retries: this.config.apiRetries,
        retryDelay: this.config.apiRetryDelay
      });
      
      // Initialize authentication manager
      this.modules.auth = new AuthManager(this.modules.api, this.modules.storage);
      
      // Initialize UI manager
      this.modules.ui = new UIManager(this.modules.storage, this.modules.api);
      this.modules.ui.init();
      
      // Initialize router
      this.modules.router = new RouterManager(this.modules.ui, this.modules.auth);
      this.modules.router.init();
      
      console.log('✅ All modules initialized successfully');
      
    } catch (error) {
      console.error('❌ Module initialization failed:', error);
      throw new Error(`Module initialization failed: ${error.message}`);
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // DOM Content Loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onDOMReady();
      });
    } else {
      this.onDOMReady();
    }

    // Online/Offline detection
    window.addEventListener('online', () => {
      console.log('🌐 Connection restored');
      showAlert('Conexión restaurada', 'success');
      this.modules.connection?.setOnline(true);
    });

    window.addEventListener('offline', () => {
      console.log('📵 Connection lost');
      showAlert('Sin conexión a internet', 'warning');
      this.modules.connection?.setOnline(false);
    });

    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('🚨 Global error:', event.error);
      showAlert('Ha ocurrido un error inesperado', 'error');
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 Unhandled promise rejection:', event.reason);
      showAlert('Error en la aplicación', 'error');
      event.preventDefault();
    });
  }

  /**
   * DOM Ready event handler
   */
  onDOMReady() {
    console.log('📄 DOM ready');
    
    // Setup login form if in public zone
    this.setupLoginForm();
    
    // Setup navigation if in private zone
    this.setupNavigation();
    
    // Setup logout functionality
    this.setupLogout();
  }

  /**
   * Setup login form event listeners
   */
  setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.getElementById('toggle-password');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
    
    if (togglePassword) {
      togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
    }
  }

  /**
   * Setup navigation event listeners
   */
  setupNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.modules.router?.navigate(page);
      });
    });
  }

  /**
   * Setup logout functionality
   */
  setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }
  }

  /**
   * Initialize routing system
   */
  async initializeRouting() {
    if (this.modules.router) {
      await this.modules.router.initialize();
    }
  }

  /**
   * Check current authentication status
   */
  async checkAuthenticationStatus() {
    try {
      const isAuthenticated = await this.modules.auth.isAuthenticated();
      
      if (isAuthenticated) {
        console.log('✅ User is authenticated');
        await this.showPrivateZone();
      } else {
        console.log('🔒 User not authenticated');
        await this.showPublicZone();
      }
      
    } catch (error) {
      console.error('❌ Error checking authentication:', error);
      await this.showPublicZone();
    }
  }

  /**
   * Handle login form submission
   */
  async handleLogin(event) {
    event.preventDefault();
    
    try {
      const formData = new FormData(event.target);
      const credentials = {
        identifier: formData.get('email'),
        password: formData.get('password')
      };

      const loginBtn = document.getElementById('login-btn');
      const loginSpinner = document.getElementById('login-spinner');
      
      // UI feedback
      loginBtn.disabled = true;
      loginSpinner?.classList.remove('d-none');
      
      // Validate form
      if (!this.validateLoginForm(credentials)) {
        throw new Error('Por favor, completa todos los campos correctamente');
      }
      
      // Attempt login
      const result = await this.modules.auth.login(credentials);
      
      if (result.success) {
        showAlert('¡Bienvenido de nuevo!', 'success');
        await this.showPrivateZone();
      } else {
        throw new Error(result.message || 'Error de autenticación');
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      showAlert(error.message || 'Error al iniciar sesión', 'error');
      
    } finally {
      // Reset UI
      const loginBtn = document.getElementById('login-btn');
      const loginSpinner = document.getElementById('login-spinner');
      
      loginBtn.disabled = false;
      loginSpinner?.classList.add('d-none');
    }
  }

  /**
   * Validate login form
   */
  validateLoginForm(credentials) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!credentials.identifier || !credentials.password) {
      return false;
    }
    
    if (!emailRegex.test(credentials.identifier)) {
      return false;
    }
    
    if (credentials.password.length < 6) {
      return false;
    }
    
    return true;
  }

  /**
   * Handle logout
   */
  async handleLogout() {
    try {
      await this.modules.auth.logout();
      showAlert('Sesión cerrada correctamente', 'info');
      await this.showPublicZone();
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      showAlert('Error al cerrar sesión', 'error');
    }
  }

  /**
   * Show public zone (login page)
   */
  async showPublicZone() {
    const publicZone = document.getElementById('public-zone');
    const privateZone = document.getElementById('private-zone');
    
    if (publicZone && privateZone) {
      publicZone.classList.remove('d-none');
      privateZone.classList.add('d-none');
    }
  }

  /**
   * Show private zone (dashboard)
   */
  async showPrivateZone() {
    const publicZone = document.getElementById('public-zone');
    const privateZone = document.getElementById('private-zone');
    
    if (publicZone && privateZone) {
      publicZone.classList.add('d-none');
      privateZone.classList.remove('d-none');
      
      // Update user info in navbar
      await this.updateUserInfo();
      
      // Navigate to dashboard by default
      this.modules.router?.navigate('dashboard');
    }
  }

  /**
   * Update user info in navbar
   */
  async updateUserInfo() {
    try {
      const user = await this.modules.auth.getCurrentUser();
      const userNameElement = document.getElementById('user-name');
      
      if (user && userNameElement) {
        userNameElement.textContent = user.username || user.email || 'Usuario';
      }
      
    } catch (error) {
      console.error('❌ Error updating user info:', error);
    }
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('#toggle-password i');
    
    if (passwordInput && toggleIcon) {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleIcon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
    }
  }
}

// Initialize application when DOM is ready
const app = new TechFixApp();

// Make app globally accessible for debugging
window.TechFixApp = app;

// Auto-initialize
app.initialize().catch(error => {
  console.error('Failed to initialize TechFix Pro:', error);
});

// Export for module usage
export { TechFixApp };