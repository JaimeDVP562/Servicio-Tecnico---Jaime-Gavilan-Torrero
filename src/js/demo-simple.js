/**
 * TechFix Pro - Demo Sprint 1 Ultra Básico
 * Login simple con localStorage
 */

// Credenciales hardcodeadas para la demo
const DEMO_CREDENTIALS = {
  email: 'admin@techfix.com',
  password: '123456'
};

// Variables globales
let isLoggedIn = false;
let currentUser = null;

/**
 * Inicializar la aplicación
 */
function initApp() {
  console.log('🔧 TechFix Pro - Iniciando...');
  
  // Verificar si ya hay sesión
  checkExistingSession();
  
  // Setup del formulario de login
  setupLoginForm();
  
  // Setup del logout
  setupLogout();
  
  console.log('✅ Aplicación lista');
}

/**
 * Verificar sesión existente
 */
function checkExistingSession() {
  const savedUser = localStorage.getItem('techfix_user');
  const savedToken = localStorage.getItem('techfix_token');
  
  if (savedUser && savedToken) {
    currentUser = JSON.parse(savedUser);
    isLoggedIn = true;
    showPrivateZone();
    console.log('👤 Sesión restaurada:', currentUser.email);
  } else {
    showPublicZone();
  }
}

/**
 * Setup del formulario de login
 */
function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    console.log('📝 Formulario de login configurado');
  }
}

/**
 * Setup del logout
 */
function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

/**
 * Manejar el login
 */
function handleLogin(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');
  
  console.log('🔐 Intentando login:', email);
  
  // Validación básica
  if (!email || !password) {
    showAlert('Por favor completa todos los campos', 'error');
    return;
  }
  
  // Verificar credenciales (demo)
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    // Login exitoso
    currentUser = {
      email: email,
      name: 'Técnico Admin',
      role: 'admin',
      loginTime: new Date().toISOString()
    };
    
    // Guardar en localStorage
    localStorage.setItem('techfix_user', JSON.stringify(currentUser));
    localStorage.setItem('techfix_token', 'demo-jwt-token-' + Date.now());
    
    isLoggedIn = true;
    
    showAlert('¡Bienvenido a TechFix Pro!', 'success');
    showPrivateZone();
    
    console.log('✅ Login exitoso');
    
  } else {
    showAlert('Credenciales incorrectas', 'error');
    console.log('❌ Login fallido');
  }
}

/**
 * Manejar el logout
 */
function handleLogout(event) {
  event.preventDefault();
  
  // Limpiar datos
  localStorage.removeItem('techfix_user');
  localStorage.removeItem('techfix_token');
  
  currentUser = null;
  isLoggedIn = false;
  
  showAlert('Sesión cerrada correctamente', 'info');
  showPublicZone();
  
  console.log('👋 Logout exitoso');
}

/**
 * Mostrar zona pública (login)
 */
function showPublicZone() {
  const publicZone = document.getElementById('public-zone');
  const privateZone = document.getElementById('private-zone');
  
  if (publicZone) publicZone.classList.remove('d-none');
  if (privateZone) privateZone.classList.add('d-none');
  
  // Limpiar formulario
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.reset();
  }
}

/**
 * Mostrar zona privada (dashboard)
 */
function showPrivateZone() {
  const publicZone = document.getElementById('public-zone');
  const privateZone = document.getElementById('private-zone');
  
  if (publicZone) publicZone.classList.add('d-none');
  if (privateZone) privateZone.classList.remove('d-none');
  
  // Actualizar info del usuario
  updateUserInfo();
}

/**
 * Actualizar información del usuario en la interfaz
 */
function updateUserInfo() {
  if (currentUser) {
    const userNameEl = document.getElementById('user-name');
    const userRoleEl = document.getElementById('user-role');
    
    if (userNameEl) userNameEl.textContent = currentUser.name;
    if (userRoleEl) userRoleEl.textContent = currentUser.role;
  }
}

/**
 * Mostrar alertas simples
 */
function showAlert(message, type = 'info') {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) {
    alert(message); // Fallback
    return;
  }
  
  const alertClass = type === 'error' ? 'alert-danger' : 
                     type === 'success' ? 'alert-success' : 
                     type === 'warning' ? 'alert-warning' : 'alert-info';
  
  const alertHtml = `
    <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  
  alertsContainer.innerHTML = alertHtml;
  
  // Auto-hide después de 3 segundos
  setTimeout(() => {
    alertsContainer.innerHTML = '';
  }, 3000);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}