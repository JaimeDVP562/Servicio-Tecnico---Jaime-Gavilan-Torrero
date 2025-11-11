/**
 * Authentication Manager
 * Handles JWT authentication with Strapi backend
 * 
 * @author Jaime Gavilán Torrero
 * @version 1.0.0
 */

import { showAlert } from '../utils/alerts.js';

export class AuthManager {
  constructor(apiClient, storageManager) {
    this.api = apiClient;
    this.storage = storageManager;
    this.currentUser = null;
    this.token = null;
    
    // Configuration
    this.config = {
      tokenKey: 'auth_token',
      userKey: 'user_data',
      refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
      maxLoginAttempts: 3,
      lockoutDuration: 15 * 60 * 1000 // 15 minutes
    };
    
    // Rate limiting for login attempts
    this.loginAttempts = 0;
    this.lockoutUntil = null;
  }

  /**
   * Initialize authentication manager
   */
  async initialize() {
    try {
      // Load stored token and user data
      await this.loadStoredAuth();
      
      // Setup token refresh interval
      this.setupTokenRefresh();
      
      console.log('🔐 AuthManager initialized');
      
    } catch (error) {
      console.error('❌ Error initializing AuthManager:', error);
      throw error;
    }
  }

  /**
   * Load stored authentication data
   */
  async loadStoredAuth() {
    try {
      this.token = this.storage.getItem(this.config.tokenKey);
      const userData = this.storage.getItem(this.config.userKey);
      
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
      
      // Validate stored token
      if (this.token && !this.isTokenValid(this.token)) {
        console.log('🔄 Stored token is invalid, clearing...');
        await this.clearAuth();
      }
      
    } catch (error) {
      console.error('❌ Error loading stored auth:', error);
      await this.clearAuth();
    }
  }

  /**
   * Authenticate user with email and password
   */
  async login(credentials) {
    try {
      // Check rate limiting
      if (this.isLockedOut()) {
        const remainingTime = Math.ceil((this.lockoutUntil - Date.now()) / 60000);
        throw new Error(`Demasiados intentos fallidos. Intenta de nuevo en ${remainingTime} minutos.`);
      }
      
      // Validate credentials format
      if (!this.validateCredentials(credentials)) {
        throw new Error('Credenciales inválidas');
      }
      
      console.log('🔑 Attempting login...');
      
      // Call Strapi auth endpoint
      const response = await this.api.post('/auth/local', credentials);
      
      if (response.jwt && response.user) {
        // Successful login
        await this.handleSuccessfulLogin(response);
        this.resetLoginAttempts();
        
        return {
          success: true,
          user: response.user,
          token: response.jwt
        };
      } else {
        throw new Error('Respuesta de autenticación inválida');
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      await this.handleFailedLogin();
      
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Handle successful login
   */
  async handleSuccessfulLogin(authData) {
    try {
      this.token = authData.jwt;
      this.currentUser = authData.user;
      
      // Store in localStorage
      this.storage.setItem(this.config.tokenKey, this.token);
      this.storage.setItem(this.config.userKey, JSON.stringify(this.currentUser));
      
      // Store in IndexedDB for offline access
      await this.storage.storeUserData(this.currentUser);
      
      // Set API authorization header
      this.api.setAuthorizationHeader(this.token);
      
      console.log('✅ Login successful');
      
    } catch (error) {
      console.error('❌ Error handling successful login:', error);
      throw error;
    }
  }

  /**
   * Handle failed login attempt
   */
  async handleFailedLogin() {
    this.loginAttempts++;
    
    if (this.loginAttempts >= this.config.maxLoginAttempts) {
      this.lockoutUntil = Date.now() + this.config.lockoutDuration;
      console.warn(`🚫 Account locked after ${this.config.maxLoginAttempts} failed attempts`);
    }
  }

  /**
   * Logout user and clear all auth data
   */
  async logout() {
    try {
      console.log('🔓 Logging out...');
      
      // Clear API authorization
      this.api.clearAuthorizationHeader();
      
      // Clear stored data
      await this.clearAuth();
      
      // Clear rate limiting
      this.resetLoginAttempts();
      
      console.log('✅ Logout successful');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  /**
   * Clear all authentication data
   */
  async clearAuth() {
    try {
      // Clear memory
      this.token = null;
      this.currentUser = null;
      
      // Clear localStorage
      this.storage.removeItem(this.config.tokenKey);
      this.storage.removeItem(this.config.userKey);
      
      // Clear IndexedDB user data
      await this.storage.clearUserData();
      
    } catch (error) {
      console.error('❌ Error clearing auth:', error);
    }
  }

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated() {
    try {
      // Check if we have a token
      if (!this.token) {
        return false;
      }
      
      // Check if token is valid
      if (!this.isTokenValid(this.token)) {
        await this.clearAuth();
        return false;
      }
      
      // Optionally verify with server
      if (navigator.onLine) {
        try {
          await this.verifyTokenWithServer();
          return true;
        } catch (error) {
          console.warn('⚠️ Token verification failed:', error);
          await this.clearAuth();
          return false;
        }
      }
      
      // If offline, trust the local token
      return true;
      
    } catch (error) {
      console.error('❌ Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    if (!await this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    
    return this.currentUser;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      if (!this.token) {
        throw new Error('No token to refresh');
      }
      
      console.log('🔄 Refreshing token...');
      
      const response = await this.api.post('/auth/refresh', {
        token: this.token
      });
      
      if (response.jwt) {
        this.token = response.jwt;
        this.storage.setItem(this.config.tokenKey, this.token);
        this.api.setAuthorizationHeader(this.token);
        
        console.log('✅ Token refreshed');
        return true;
      }
      
      throw new Error('Token refresh failed');
      
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      await this.clearAuth();
      return false;
    }
  }

  /**
   * Validate credentials format
   */
  validateCredentials(credentials) {
    if (!credentials || !credentials.identifier || !credentials.password) {
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.identifier)) {
      return false;
    }
    
    // Password validation
    if (credentials.password.length < 6) {
      return false;
    }
    
    return true;
  }

  /**
   * Check if token is valid (not expired)
   */
  isTokenValid(token) {
    try {
      if (!token) return false;
      
      // Decode JWT payload (simple decode, no verification)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const now = Date.now() / 1000;
      
      // Check expiration
      return payload.exp && payload.exp > now;
      
    } catch (error) {
      console.warn('⚠️ Invalid token format:', error);
      return false;
    }
  }

  /**
   * Verify token with server
   */
  async verifyTokenWithServer() {
    try {
      const response = await this.api.get('/users/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      if (response && response.id) {
        // Update current user data
        this.currentUser = response;
        this.storage.setItem(this.config.userKey, JSON.stringify(this.currentUser));
        return true;
      }
      
      throw new Error('Invalid user data received');
      
    } catch (error) {
      console.error('❌ Token verification error:', error);
      throw error;
    }
  }

  /**
   * Setup automatic token refresh
   */
  setupTokenRefresh() {
    setInterval(async () => {
      if (this.token && this.isTokenNearExpiry(this.token)) {
        console.log('⏰ Token near expiry, refreshing...');
        await this.refreshToken();
      }
    }, 60000); // Check every minute
  }

  /**
   * Check if token is near expiry
   */
  isTokenNearExpiry(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const now = Date.now();
      const expiry = payload.exp * 1000;
      
      return (expiry - now) < this.config.refreshThreshold;
      
    } catch (error) {
      return true; // Assume near expiry if can't parse
    }
  }

  /**
   * Check if account is locked out
   */
  isLockedOut() {
    return this.lockoutUntil && Date.now() < this.lockoutUntil;
  }

  /**
   * Reset login attempts
   */
  resetLoginAttempts() {
    this.loginAttempts = 0;
    this.lockoutUntil = null;
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error) {
    if (error.message) {
      if (error.message.includes('Invalid identifier or password')) {
        return 'Email o contraseña incorrectos';
      }
      if (error.message.includes('Your account email is not confirmed')) {
        return 'Debes confirmar tu email antes de iniciar sesión';
      }
      if (error.message.includes('Your account has been blocked')) {
        return 'Tu cuenta ha sido bloqueada';
      }
    }
    
    if (error.response?.status === 400) {
      return 'Credenciales inválidas';
    }
    
    if (error.response?.status === 429) {
      return 'Demasiados intentos, intenta más tarde';
    }
    
    if (!navigator.onLine) {
      return 'Sin conexión a internet';
    }
    
    return 'Error de conexión con el servidor';
  }
}

export default AuthManager;