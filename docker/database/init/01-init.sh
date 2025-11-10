#!/bin/bash

# Script de inicialización para PostgreSQL
# Este script se ejecuta automáticamente cuando se crea el contenedor

set -e

echo "🚀 Iniciando configuración de base de datos TechFix Pro..."

# Crear la base de datos si no existe
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Verificar que la base de datos esté lista
    SELECT 'Database techfix_db is ready!' as status;
    
    -- Crear extensiones útiles
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    -- Log de inicialización
    INSERT INTO pg_stat_statements_info VALUES ('Database initialized for TechFix Pro');
EOSQL

echo "✅ Base de datos configurada correctamente!"
echo "📊 Extensiones instaladas: uuid-ossp, pgcrypto"
echo "🔗 Conexión: postgresql://strapi_user:strapi_password@localhost:5432/techfix_db"