# Dockerfile para SPA de Servicio Técnico Eléctrico
# Usa Nginx como servidor web

FROM nginx:alpine

# Copiar archivos de la SPA al directorio de Nginx
COPY . /usr/share/nginx/html

# Copiar configuración personalizada de Nginx para SPAs
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Nginx se inicia automáticamente con la imagen base
CMD ["nginx", "-g", "daemon off;"]
