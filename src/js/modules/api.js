/**
 * API Client for Strapi Backend Communication
 * Handles all HTTP requests with proper error handling and retries
 * 
 * @author Jaime Gavilán Torrero
 * @version 1.0.0
 */

export class APIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.options = {
      timeout: options.timeout || 10000,
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000,
      ...options
    };
    
    this.authToken = null;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Set authorization header for all requests
   */
  setAuthorizationHeader(token) {
    this.authToken = token;
  }

  /**
   * Clear authorization header
   */
  clearAuthorizationHeader() {
    this.authToken = null;
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  /**
   * POST request
   */
  async post(endpoint, data = null, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  /**
   * PUT request
   */
  async put(endpoint, data = null, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  /**
   * Main request method with retry logic
   */
  async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    let lastError;

    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        const response = await this.makeRequest(method, url, data, options);
        return response;
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx) except 408, 429
        if (error.status >= 400 && error.status < 500 && ![408, 429].includes(error.status)) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === this.options.maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await this.delay(this.options.retryDelay * (attempt + 1));
        console.warn(`⚠️ Request failed, retrying... (${attempt + 1}/${this.options.maxRetries})`);
      }
    }

    throw lastError;
  }

  /**
   * Make individual HTTP request
   */
  async makeRequest(method, url, data, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers
        },
        signal: controller.signal,
        ...options
      };

      // Add body for POST, PUT requests
      if (data && ['POST', 'PUT'].includes(method)) {
        config.body = JSON.stringify(data);
      }

      console.log(`🌐 ${method} ${url}`);
      
      const response = await fetch(url, config);
      
      clearTimeout(timeoutId);

      // Handle different response types
      const result = await this.handleResponse(response);
      
      console.log(`✅ ${method} ${url} - ${response.status}`);
      
      return result;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new APIError(`Request timeout after ${this.options.timeout}ms`, 408);
      }
      
      throw this.handleError(error);
    }
  }

  /**
   * Handle HTTP response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (e) {
        data = null;
      }
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new APIError(
        data?.message || data?.error?.message || `HTTP ${response.status}`,
        response.status,
        data
      );
      throw error;
    }

    return data;
  }

  /**
   * Handle request errors
   */
  handleError(error) {
    if (error instanceof APIError) {
      return error;
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new APIError('Network error - check your connection', 0);
    }

    return new APIError(error.message || 'Unknown error', 500);
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    if (this.authToken) {
      return {
        'Authorization': `Bearer ${this.authToken}`
      };
    }
    return {};
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Strapi-specific methods
   */

  /**
   * Login to Strapi
   */
  async login(credentials) {
    return this.post('/auth/local', credentials);
  }

  /**
   * Register new user
   */
  async register(userData) {
    return this.post('/auth/local/register', userData);
  }

  /**
   * Get current user
   */
  async getMe() {
    return this.get('/users/me?populate=*');
  }

  /**
   * Generic CRUD operations for Strapi collections
   */

  /**
   * Get all items from a collection
   */
  async getCollection(collectionName, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/${collectionName}?${queryString}` : `/${collectionName}`;
    return this.get(endpoint);
  }

  /**
   * Get single item from collection
   */
  async getItem(collectionName, id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/${collectionName}/${id}?${queryString}` : `/${collectionName}/${id}`;
    return this.get(endpoint);
  }

  /**
   * Create new item in collection
   */
  async createItem(collectionName, data) {
    return this.post(`/${collectionName}`, { data });
  }

  /**
   * Update item in collection
   */
  async updateItem(collectionName, id, data) {
    return this.put(`/${collectionName}/${id}`, { data });
  }

  /**
   * Delete item from collection
   */
  async deleteItem(collectionName, id) {
    return this.delete(`/${collectionName}/${id}`);
  }

  /**
   * Upload file to Strapi
   */
  async uploadFile(file, options = {}) {
    const formData = new FormData();
    formData.append('files', file);
    
    if (options.ref) formData.append('ref', options.ref);
    if (options.refId) formData.append('refId', options.refId);
    if (options.field) formData.append('field', options.field);

    return this.request('POST', '/upload', formData, {
      headers: {
        // Don't set Content-Type, let browser set it with boundary
        ...this.getAuthHeaders()
      }
    });
  }

  /**
   * TechFix Pro specific API methods
   */

  /**
   * Get all tickets
   */
  async getTickets(filters = {}) {
    return this.getCollection('tickets', {
      populate: '*',
      sort: 'createdAt:desc',
      ...filters
    });
  }

  /**
   * Create new ticket
   */
  async createTicket(ticketData) {
    return this.createItem('tickets', ticketData);
  }

  /**
   * Update ticket
   */
  async updateTicket(id, ticketData) {
    return this.updateItem('tickets', id, ticketData);
  }

  /**
   * Delete ticket
   */
  async deleteTicket(id) {
    return this.deleteItem('tickets', id);
  }

  /**
   * Get all repuestos (spare parts)
   */
  async getRepuestos(filters = {}) {
    return this.getCollection('repuestos', {
      populate: '*',
      sort: 'nombre:asc',
      ...filters
    });
  }

  /**
   * Create new repuesto
   */
  async createRepuesto(repuestoData) {
    return this.createItem('repuestos', repuestoData);
  }

  /**
   * Update repuesto
   */
  async updateRepuesto(id, repuestoData) {
    return this.updateItem('repuestos', id, repuestoData);
  }

  /**
   * Delete repuesto
   */
  async deleteRepuesto(id) {
    return this.deleteItem('repuestos', id);
  }

  /**
   * Get dashboard stats
   */
  async getDashboardStats() {
    try {
      const [tickets, repuestos] = await Promise.all([
        this.getTickets({ 'pagination[limit]': 1000 }),
        this.getRepuestos({ 'pagination[limit]': 1000 })
      ]);

      return {
        totalTickets: tickets.meta?.pagination?.total || tickets.data?.length || 0,
        openTickets: tickets.data?.filter(t => t.attributes?.estado !== 'completado')?.length || 0,
        totalRepuestos: repuestos.meta?.pagination?.total || repuestos.data?.length || 0,
        lowStockRepuestos: repuestos.data?.filter(r => r.attributes?.stock < r.attributes?.stockMinimo)?.length || 0
      };
    } catch (error) {
      console.error('❌ Error getting dashboard stats:', error);
      return {
        totalTickets: 0,
        openTickets: 0,
        totalRepuestos: 0,
        lowStockRepuestos: 0
      };
    }
  }
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError() {
    return this.status >= 500;
  }

  get isTimeout() {
    return this.status === 408;
  }

  toString() {
    return `APIError ${this.status}: ${this.message}`;
  }
}

export default APIClient;