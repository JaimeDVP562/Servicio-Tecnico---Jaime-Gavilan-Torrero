# Servicio Técnico Eléctrico - SPA

Aplicación web de página única (SPA) para ofrecer servicios técnicos de electricidad.

## 📁 Estructura del Proyecto

```
proyectoServicioTécnico/
│
├── index.html              # Página principal (punto de entrada)
├── README.md              # Documentación del proyecto
│
├── css/                   # Hojas de estilo
│   └── styles.css         # Estilos principales
│
├── js/                    # JavaScript
│   ├── router.js          # Sistema de rutas SPA
│   ├── app.js             # Inicialización de la aplicación
│   └── pages/             # Vistas/páginas de la SPA
│       ├── home.js        # Página de inicio
│       ├── services.js    # Página de servicios
│       ├── contact.js     # Página de contacto/presupuesto
│       └── about.js       # Página sobre nosotros
│
└── assets/                # Recursos estáticos
    └── images/            # Imágenes (logos, iconos, fotos)
```

## 🚀 Características

- SPA con navegación sin recarga de página
- Diseño responsive para móviles y escritorio
- Orientado a servicios técnicos de electricidad
- Formulario de contacto/presupuesto
- Secciones: Inicio, Servicios, Contacto, Sobre nosotros

## 🛠️ Tecnologías

- HTML5
- CSS3 (variables, flexbox, grid)
- JavaScript ES6+ (módulos, History API)
- Sin frameworks externos (vanilla JS)

## � Cómo Ejecutar con Docker

### Opción 1: Docker Compose (Recomendado)
```powershell
# Construir y levantar el contenedor
docker-compose up --build

# En segundo plano
docker-compose up -d

# Detener
docker-compose down
```

Luego abre: **http://localhost:8080**

### Opción 2: Docker sin Compose
```powershell
# Construir la imagen
docker build -t electroservice-spa .

# Ejecutar el contenedor
docker run -d -p 8080:80 --name electroservice electroservice-spa

# Ver logs
docker logs electroservice

# Detener y eliminar
docker stop electroservice
docker rm electroservice
```

## 🌐 Otras Formas de Ejecutar

### Live Server (VS Code)
1. Instala la extensión "Live Server"
2. Click derecho en `index.html` → "Open with Live Server"
3. **Nota:** Solo navega con los enlaces, no escribas rutas en la URL

### Servidor Python
```powershell
python -m http.server 8000
```
Abre: **http://localhost:8000**

### Servidor Node.js
```powershell
npx http-server -p 8000
```

## 📋 Estado del Proyecto

1. ✅ Estructura de carpetas creada
2. ✅ HTML base implementado
3. ✅ Estilos CSS completos
4. ✅ Sistema de rutas (router)
5. ✅ Páginas/vistas creadas
6. ✅ Configuración Docker

## 📄 Páginas Disponibles

- **/** - Inicio (hero, características, servicios destacados)
- **/servicios** - Catálogo completo de servicios
- **/contacto** - Formulario de presupuesto
- **/sobre-nosotros** - Información de la empresa

## 🎨 Paleta de Colores

- **Primario:** `#ff9800` (Naranja - Electricidad/Energía)
- **Secundario:** `#2196f3` (Azul - Confianza)
- **Fondo:** `#f5f5f5` (Gris claro)
- **Footer:** `#263238` (Gris oscuro)

---
*Proyecto educativo - Curso 2025-26*
