# 🔧 TechFix Pro - Servicio Técnico SPA

[![Coverage Status](https://img.shields.io/badge/coverage-0%25-red.svg)](https://github.com/JaimeDVP562/Servicio-Tecnico---Jaime-Gavilan-Torrero)
[![Build Status](https://img.shields.io/badge/build-pending-yellow.svg)](https://github.com/JaimeDVP562/Servicio-Tecnico---Jaime-Gavilan-Torrero/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-18%2B-green.svg)](package.json)

## 📋 Resumen del Proyecto

**TechFix Pro** es una Single Page Application (SPA) para gestión de un servicio técnico profesional, desarrollada sin frameworks utilizando únicamente JavaScript vanilla, DOM y Bootstrap. La aplicación implementa autenticación JWT, gestión offline-first con IndexedDB, y un sistema CRUD completo para la administración de tickets de reparación e inventario de repuestos.

### 🎯 Características Principales
- ✅ **Autenticación JWT** contra backend Strapi
- ✅ **Zona de administración** con privilegios CRUD
- ✅ **Funcionalidad offline-first** con IndexedDB
- ✅ **Formularios específicos** del dominio (tickets e inventario)
- ✅ **Tests unitarios e integración** con cobertura
- ✅ **CI/CD** con GitHub Actions
- ✅ **Arquitectura Docker** con Dev Containers

---

## 🏗️ Arquitectura General

### Stack Tecnológico
- **Frontend**: HTML5 + CSS3 + JavaScript ES6+ (Vanilla)
- **UI Framework**: Bootstrap 5.3
- **Backend**: Strapi (última versión gratuita estable)
- **Base de Datos**: PostgreSQL (Docker)
- **Almacenamiento Local**: localStorage + IndexedDB
- **Testing**: Jest + Testing Library
- **Linting**: ESLint
- **CI/CD**: GitHub Actions
- **Containerización**: Docker + Dev Containers

### Flujo de Datos
```
[Cliente] ↔ [SPA] ↔ [Strapi API] ↔ [PostgreSQL]
              ↕
         [IndexedDB + localStorage]
```

---

## 📦 Estructura del Proyecto

```
servicio-tecnico/
├── .devcontainer/          # Dev Container configuration
├── .github/                # GitHub Actions workflows
│   └── workflows/
├── docker/                 # Docker configurations
│   ├── strapi/
│   └── database/
├── src/                    # Source code
│   ├── css/
│   ├── js/
│   │   ├── modules/
│   │   ├── utils/
│   │   └── tests/
│   └── assets/
├── docs/                   # Documentation
├── tests/                  # Test files
├── .eslintrc.js           # ESLint configuration
├── .gitignore
├── package.json
├── docker-compose.yml
├── README.md
└── index.html
```

---

## 🚀 Planificación por Sprints

### 📅 **SPRINT 1: Base y Autenticación** (Semanas 1-2)

#### Objetivos
- Establecer la infraestructura base del proyecto
- Implementar sistema de autenticación completo
- Configurar entorno de desarrollo

#### Tareas Principales
1. **Configuración de Proyecto**
   - ✅ Estructura de carpetas
   - ✅ Configuración ESLint
   - ✅ package.json y dependencias
   - ✅ .gitignore y configuración Git
   - ✅ Dev Container setup

2. **Docker y Strapi Backend**
   - ✅ Configuración docker-compose
   - ✅ Strapi setup con PostgreSQL
   - ✅ Content-types: usuarios, tickets, repuestos, dispositivos
   - ✅ Configuración JWT y CORS
   - ✅ Roles y permisos

3. **Sistema de Autenticación**
   - ✅ Login page público con Bootstrap
   - ✅ Validaciones HTML5 y JavaScript
   - ✅ Integración JWT con Strapi
   - ✅ Protección de rutas
   - ✅ Gestión de sesiones con localStorage

4. **Base de la Aplicación**
   - ✅ Estructura SPA básica
   - ✅ Navbar responsiva con Bootstrap
   - ✅ Enrutado básico por páginas
   - ✅ Sistema de alertas y feedback

#### Entregables Sprint 1
- [ ] Login funcional con autenticación JWT
- [ ] Zona privada básica (dashboard)
- [ ] Docker containers funcionando
- [ ] Strapi configurado con content-types
- [ ] Base de datos con datos de prueba
- [ ] Tests básicos del sistema de autenticación

#### Definición de Hecho Sprint 1
- Login autentica correctamente contra Strapi
- JWT se guarda en localStorage
- Redirección funciona según estado de autenticación
- Zona privada solo accesible con token válido
- Docker containers se levantan sin errores
- Tests de autenticación pasan al 100%

---

### 📅 **SPRINT 2: Formularios y Funcionalidad Core** (Semanas 3-4)

#### Objetivos
- Implementar formularios específicos del servicio técnico
- Desarrollar funcionalidad CRUD completa
- Integrar almacenamiento offline-first

#### Tareas Principales
1. **Formulario de Tickets de Reparación**
   - ✅ Modal con formulario completo
   - ✅ Campos: cliente, dispositivo, problema, prioridad, coste
   - ✅ Validaciones HTML5 y JavaScript
   - ✅ Manipulación DOM (contadores, show/hide)
   - ✅ Integración con API Strapi

2. **Formulario de Inventario de Repuestos**
   - ✅ Gestión de repuestos y stock
   - ✅ Campos: código, nombre, categoría, stock, precio, proveedor
   - ✅ Validaciones de negocio (rangos, formatos)
   - ✅ Feedback visual de stock bajo
   - ✅ CRUD completo

3. **Gestión de Usuarios (Admin)**
   - ✅ Listado con buscador y paginación
   - ✅ Alta y edición de usuarios
   - ✅ Gestión de privilegios de administrador
   - ✅ Solo visible para usuarios admin

4. **Almacenamiento Offline**
   - ✅ Implementación IndexedDB
   - ✅ Cache de listados de usuarios
   - ✅ Sincronización automática
   - ✅ Detección de conexión

#### Entregables Sprint 2
- [ ] Formularios de tickets funcionando completamente
- [ ] Gestión de inventario con validaciones
- [ ] CRUD de usuarios para administradores
- [ ] Funcionalidad offline básica implementada
- [ ] Tests de integración de formularios

#### Definición de Hecho Sprint 2
- Todos los formularios validan correctamente
- CRUD operations funcionan con Strapi
- Datos se cachean en IndexedDB
- Aplicación funciona sin conexión para lectura
- Feedback visual funciona en todos los formularios
- Tests de integración cubren formularios principales

---

### 📅 **SPRINT 3: Calidad y Despliegue** (Semanas 5-6)

#### Objetivos
- Completar suite de testing
- Configurar CI/CD pipeline
- Documentación final y refinamiento

#### Tareas Principales
1. **Testing Completo**
   - ✅ Tests unitarios (>80% cobertura)
   - ✅ Tests de integración con mocks
   - ✅ Tests de linting automáticos
   - ✅ Configuración nyc/Istanbul

2. **CI/CD Pipeline**
   - ✅ GitHub Actions workflow
   - ✅ Tests automáticos en PRs
   - ✅ Generación de coverage reports
   - ✅ Badges en README

3. **Documentación Final**
   - ✅ README completo
   - ✅ Instrucciones de instalación
   - ✅ Documentación de API
   - ✅ Guía de contribución

4. **Refinamiento y Optimización**
   - ✅ Mejoras de UX/UI
   - ✅ Optimización de rendimiento
   - ✅ Manejo de errores robusto
   - ✅ Accesibilidad básica

#### Entregables Sprint 3
- [ ] Suite de tests completa con >80% cobertura
- [ ] Pipeline CI/CD funcionando
- [ ] Documentación técnica completa
- [ ] Aplicación refinada y optimizada

#### Definición de Hecho Sprint 3
- Coverage badge muestra >80%
- GitHub Actions pipeline pasa todos los checks
- README incluye todos los puntos requeridos
- Aplicación desplegada y funcionando
- Código cumple estándares ESLint
- Performance optimizada (loading <3s)

---

## 💾 Gestión de Almacenamiento

### localStorage
**Propósito**: Datos simples y persistentes de sesión
- `auth_token`: JWT para autenticación
- `user_data`: Información básica del usuario logueado
- `app_config`: Configuraciones de la aplicación

### IndexedDB
**Propósito**: Almacenamiento estructurado para funcionalidad offline
- **Store `usuarios`**: Cache de listado de usuarios
- **Store `tickets`**: Cache de tickets de reparación
- **Store `repuestos`**: Cache de inventario
- **Store `metadata`**: Timestamps de sincronización

### Estrategia Offline-First
1. **Lectura**: Intentar API → Fallback a IndexedDB
2. **Escritura**: Cola de operaciones pendientes
3. **Sincronización**: Al detectar conexión o refresh

---

## 🔧 Configuración del Entorno

### Requisitos Previos
- Node.js 18+
- Docker & Docker Compose
- VS Code (recomendado)
- Git

### Instalación Local
```bash
# Clonar repositorio
git clone https://github.com/JaimeDVP562/Servicio-Tecnico---Jaime-Gavilan-Torrero.git
cd Servicio-Tecnico---Jaime-Gavilan-Torrero

# Instalar dependencias
npm install

# Levantar servicios Docker
docker-compose up -d

# Abrir en VS Code con Dev Container
code .
```

### Entorno Dev Container
**Extensiones incluidas**:
- ESLint
- Prettier
- Jest Runner
- Docker
- GitLens

**Servicios incluidos**:
- Strapi (puerto 1337)
- PostgreSQL (puerto 5432)
- pgAdmin (puerto 5050)

---

## 🧪 Testing y Calidad

### ESLint Configuration
```javascript
// Reglas aplicadas
{
  "camelcase": "error",
  "no-unused-vars": "error", 
  "no-var": "error",
  "semi": ["error", "always"]
}
```

### Coverage Requirements
- **Mínimo**: 80% cobertura total
- **Tests unitarios**: Lógica de negocio
- **Tests integración**: Formularios y API calls (mocked)
- **Tests linting**: ESLint rules compliance

---

## 🔄 Flujo de Git y Versionado

### Estrategia de Ramas
- **`main`**: Código en producción (protegida)
- **`develop`**: Rama de desarrollo principal  
- **`feature/[nombre]`**: Ramas de características
- **`hotfix/[nombre]`**: Correcciones urgentes

### Proceso de Trabajo
1. Crear rama desde `develop`
2. Desarrollo y commits
3. Pull Request a `develop`
4. Code Review requerido
5. Merge (sin borrar rama)
6. Deploy desde `main`

### Versionado
- **Tags semánticos**: v1.0.0, v1.1.0, etc.
- **Versión final**: Tag v1.0.0 para entrega

---

## 📊 Gestión con Trello

### Estructura del Tablero
- **📋 Por Hacer**: Backlog priorizado
- **🔄 Haciendo**: En desarrollo activo (WIP limit: 3)
- **✅ Hecho**: Completadas y validadas

### Información de Tarjetas
- Sprint asignado (S1, S2, S3)
- Descripción detallada
- Dependencias identificadas
- Estimación de esfuerzo
- Responsable asignado

**🔗 Tablero**: [TechFix Pro - Trello](https://trello.com/b/techfix-pro) *(Compartido con tutor)*

---

## 📈 Definición de Hecho (DoD)

### Código
- [ ] Funcionalidad implementada según especificación
- [ ] Código revisado por al menos 1 persona
- [ ] Tests unitarios escritos y pasando
- [ ] Cobertura de tests >80% para nueva funcionalidad
- [ ] ESLint rules cumplidas sin warnings
- [ ] Documentación actualizada (README, JSDoc)

### Features
- [ ] Validaciones HTML5 y JavaScript funcionando
- [ ] Feedback visual claro (éxito/error)
- [ ] Funcionalidad offline implementada (si aplica)
- [ ] Responsive design verificado
- [ ] Tests manuales completados
- [ ] Integración con Strapi funcionando

### Sprint
- [ ] Todos los entregables completados
- [ ] Demo funcional preparada
- [ ] Tests de regresión pasando
- [ ] Performance dentro de límites aceptables
- [ ] Documentación de sprint actualizada
- [ ] Reflexión post-sprint documentada

---

## 📝 Reflexiones por Sprint

### Sprint 1 - Reflexión
*[Pendiente - Se completará al finalizar Sprint 1]*

**Logros**:
- TBD

**Desafíos**:
- TBD

**Lecciones Aprendidas**:
- TBD

**Mejoras para Sprint 2**:
- TBD

### Sprint 2 - Reflexión  
*[Pendiente - Se completará al finalizar Sprint 2]*

### Sprint 3 - Reflexión
*[Pendiente - Se completará al finalizar Sprint 3]*

---

## 🚀 Quick Start

### Desarrollo Rápido
```bash
# Con Docker (Recomendado)
docker-compose up -d
npm run dev

# Sin Docker  
npm run strapi:dev
npm run serve
```

### Testing
```bash
npm run test          # Tests unitarios
npm run test:coverage # Coverage report
npm run lint          # ESLint check
npm run lint:fix      # Fix automático
```

### Deployment
```bash
npm run build         # Build para producción
npm run start         # Servidor producción
```

---

## 📚 Recursos y Referencias

- [Documentación Strapi](https://docs.strapi.io/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [ESLint Rules](https://eslint.org/docs/rules/)

---

## 👥 Contribución

Este proyecto sigue las mejores prácticas de desarrollo:
- Commits semánticos
- Code review obligatorio
- Tests antes de merge
- Documentación actualizada

---

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

---

**🎯 Proyecto académico - 2º DAW**  
**👨‍🎓 Autor**: Jaime Gavilán Torrero  
**📅 Curso**: 2024-2025  
**🏫 Centro**: [Nombre del Centro]

---

*Última actualización: Noviembre 2024*