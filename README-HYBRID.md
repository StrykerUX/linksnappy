# LinkSnappy - Sistema Híbrido de Almacenamiento 🔄

**Branch:** `DevelopSQL`

Esta versión de LinkSnappy incluye un **sistema híbrido** que puede usar tanto **archivos JSON** como **PostgreSQL** para almacenar datos.

## 🔄 **Cómo Funciona**

LinkSnappy detecta automáticamente qué tipo de almacenamiento usar basándose en las variables de entorno:

### 📁 **Modo JSON (Por Defecto)**
```bash
STORAGE_TYPE=json
# o simplemente no configurar nada
```
- ✅ **Sin configuración** - Funciona inmediatamente
- ✅ **Portátil** - Un solo archivo `data/urls.json`
- ✅ **Simple** - Perfecto para desarrollo y portafolios

### 🐘 **Modo PostgreSQL**
```bash
STORAGE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@host:5432/database
```
- ✅ **Escalable** - Soporta miles de URLs
- ✅ **Concurrent** - Múltiples instancias simultáneas
- ✅ **Backup automático** - Con herramientas estándar de PostgreSQL

## 🚀 **Configuración Rápida**

### **1. JSON (Desarrollo/Portafolio)**
```bash
# No necesitas configurar nada
npm run dev
```

### **2. PostgreSQL (Producción)**
```bash
# Configurar variables de entorno
STORAGE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@localhost:5432/linksnappy

# Instalar dependencias
npm install

# Ejecutar - se crean las tablas automáticamente
npm run dev
```

## 🗃️ **Estructura de Base de Datos PostgreSQL**

```sql
CREATE TABLE urls (
  short_code VARCHAR(10) PRIMARY KEY,
  original_url TEXT NOT NULL,
  qr_code TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE
);
```

## 🔧 **Migración de Datos**

### **JSON → PostgreSQL**
1. Configura PostgreSQL
2. Los datos JSON permanecen intactos
3. Nuevas URLs se guardan en PostgreSQL

### **PostgreSQL → JSON**
1. Cambia `STORAGE_TYPE=json`
2. Los datos PostgreSQL permanecen
3. Nuevas URLs se guardan en JSON

## 📊 **Comparación de Rendimiento**

| Característica | JSON | PostgreSQL |
|----------------|------|------------|
| **Setup** | ✅ Inmediato | ⚡ 2 minutos |
| **Velocidad** | ✅ Muy rápido (<1000 URLs) | ✅ Rápido (ilimitado) |
| **Escalabilidad** | ❌ Limitado | ✅ Ilimitado |
| **Backup** | 📁 Copiar archivo | 🔄 pg_dump |
| **Concurrent** | ❌ Un servidor | ✅ Múltiples servidores |

## 🌐 **Deployment**

### **Dokploy con JSON**
```bash
# Variables de entorno
BASE_URL=https://linksnappy.imstryker.com
STORAGE_TYPE=json
```

### **Dokploy con PostgreSQL**
```bash
# Variables de entorno
BASE_URL=https://linksnappy.imstryker.com
STORAGE_TYPE=postgresql
DATABASE_URL=postgresql://user:pass@db-host:5432/linksnappy
```

### **Vercel con PostgreSQL**
```bash
# Variables de entorno en Vercel
BASE_URL=https://your-app.vercel.app
STORAGE_TYPE=postgresql
DATABASE_URL=postgresql://vercel-user:pass@vercel-postgres/linksnappy
```

## 🔄 **API Sin Cambios**

Todas las APIs funcionan igual independientemente del storage:

```bash
POST /api/shorten          # Crear URL corta
GET  /api/url/[shortCode]  # Obtener información
GET  /api/redirect/[shortCode] # Redireccionar
GET  /api/analytics/[shortCode] # Analytics
GET  /api/urls             # Listar todas
```

## 🏗️ **Arquitectura del Sistema**

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │
│   (Next.js)     │────│   (Next.js)     │
└─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │ Storage Factory │
                       └─────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
            ┌─────────────────┐    ┌─────────────────┐
            │  JSON Storage   │    │PostgreSQL Store│
            │  (JsonStorage)  │    │(PostgreSQLStore│
            └─────────────────┘    └─────────────────┘
                    │                       │
                ┌───────┐              ┌──────────┐
                │ JSON  │              │PostgreSQL│
                │ File  │              │ Database │
                └───────┘              └──────────┘
```

## 🛠️ **Desarrollo**

### **Agregar Nuevo Storage**
1. Implementa `StorageInterface`
2. Agrega al `StorageFactory`
3. Actualiza variables de entorno

### **Testing**
```bash
# Test con JSON
STORAGE_TYPE=json npm test

# Test con PostgreSQL  
STORAGE_TYPE=postgresql DATABASE_URL=... npm test
```

## 🔒 **Seguridad**

- ✅ **Validación de URLs**
- ✅ **SQL Injection Protection** (PostgreSQL)
- ✅ **HTTPS Enforcement**
- ✅ **Input Sanitization**

## 📈 **Monitoreo**

Logs automáticos indican el tipo de storage:
```
📁 Using JSON file storage
🐘 Using PostgreSQL storage
⚠️  DATABASE_URL not found, falling back to JSON storage
```

---

**🎯 Beneficio Principal:** Flexibilidad total sin cambiar código. Perfecto para desarrollo con JSON y producción con PostgreSQL.