/**
 * Alert System Utilities
 * Provides user feedback with Bootstrap-styled alerts
 * 
 * @author Jaime Gavilán Torrero
 * @version 1.0.0
 */

let alertCounter = 0;

/**
 * Show alert message to user
 * @param {string} message - Alert message
 * @param {string} type - Alert type: success, error, warning, info
 * @param {number} duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
 */
export function showAlert(message, type = 'info', duration = 5000) {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) {
    console.warn('⚠️ Alerts container not found');
    return;
  }

  const alertId = `alert-${++alertCounter}`;
  const alertClass = getAlertClass(type);
  const iconClass = getIconClass(type);

  const alertHTML = `
    <div class="alert ${alertClass} alert-dismissible fade show" role="alert" id="${alertId}">
      <i class="${iconClass} me-2"></i>
      <strong>${getAlertTitle(type)}</strong> ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  alertsContainer.insertAdjacentHTML('beforeend', alertHTML);

  // Auto-dismiss if duration is specified
  if (duration > 0) {
    setTimeout(() => {
      dismissAlert(alertId);
    }, duration);
  }

  // Add animation
  const alertElement = document.getElementById(alertId);
  if (alertElement) {
    alertElement.classList.add('slide-up');
  }
}

/**
 * Show loading spinner
 */
export function showLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.classList.remove('d-none');
  }
}

/**
 * Hide loading spinner
 */
export function hideLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.classList.add('d-none');
  }
}

/**
 * Dismiss specific alert
 */
export function dismissAlert(alertId) {
  const alert = document.getElementById(alertId);
  if (alert) {
    const bsAlert = new bootstrap.Alert(alert);
    bsAlert.close();
  }
}

/**
 * Clear all alerts
 */
export function clearAllAlerts() {
  const alertsContainer = document.getElementById('alerts-container');
  if (alertsContainer) {
    alertsContainer.innerHTML = '';
  }
}

/**
 * Get Bootstrap alert class for type
 */
function getAlertClass(type) {
  const classes = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info'
  };
  return classes[type] || 'alert-info';
}

/**
 * Get icon class for alert type
 */
function getIconClass(type) {
  const icons = {
    success: 'bi bi-check-circle-fill',
    error: 'bi bi-exclamation-triangle-fill',
    warning: 'bi bi-exclamation-triangle',
    info: 'bi bi-info-circle'
  };
  return icons[type] || 'bi bi-info-circle';
}

/**
 * Get alert title for type
 */
function getAlertTitle(type) {
  const titles = {
    success: '¡Éxito!',
    error: '¡Error!',
    warning: '¡Atención!',
    info: 'Información'
  };
  return titles[type] || 'Información';
}

/**
 * Show confirmation dialog
 */
export function showConfirmDialog(message, title = '¿Estás seguro?') {
  return new Promise((resolve) => {
    // For now, use browser confirm. In Sprint 2, we'll implement custom modal
    const result = confirm(`${title}\n\n${message}`);
    resolve(result);
  });
}

/**
 * Show success message with specific styling
 */
export function showSuccess(message, duration = 3000) {
  showAlert(message, 'success', duration);
}

/**
 * Show error message with specific styling
 */
export function showError(message, duration = 7000) {
  showAlert(message, 'error', duration);
}

/**
 * Show warning message with specific styling
 */
export function showWarning(message, duration = 5000) {
  showAlert(message, 'warning', duration);
}

/**
 * Show info message with specific styling
 */
export function showInfo(message, duration = 4000) {
  showAlert(message, 'info', duration);
}