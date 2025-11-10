module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Reglas específicas requeridas en el proyecto
    'camelcase': 'error',
    'no-unused-vars': 'error',
    'no-var': 'error',
    'semi': ['error', 'always'],
    
    // Reglas adicionales para calidad de código
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'prefer-const': 'error',
    'arrow-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'brace-style': ['error', '1tbs'],
    'keyword-spacing': 'error',
    'space-before-blocks': 'error',
    'space-infix-ops': 'error'
  },
  globals: {
    // Variables globales de Bootstrap y APIs del navegador
    'bootstrap': 'readonly',
    'localStorage': 'readonly',
    'sessionStorage': 'readonly',
    'indexedDB': 'readonly',
    'fetch': 'readonly',
    'FormData': 'readonly',
    'URLSearchParams': 'readonly'
  }
};