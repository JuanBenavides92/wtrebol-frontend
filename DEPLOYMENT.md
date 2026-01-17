# Deployment Instructions - WTREBOL Frontend

## 🚀 Docker Deployment

### Prerequisitos
- Docker instalado en el servidor
- Backend corriendo en `https://api.wtrebol.com`
- Puerto 3000 disponible

### Paso 1: Variables de Entorno en Producción

El archivo `.env.production` ya está configurado con:
```bash
NEXT_PUBLIC_API_URL=https://api.wtrebol.com
```

**IMPORTANTE**: Durante el Docker build, asegúrate de que esta variable esté disponible.

### Paso 2: Dockerfile

Crea un `Dockerfile` en la raíz del proyecto:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_PUBLIC_API_URL=https://api.wtrebol.com

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set to production
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://api.wtrebol.com

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
```

### Paso 3: next.config.ts

Agrega output standalone para Docker (si no está ya):

```typescript
const nextConfig = {
  output: 'standalone', // <-- Agregar esto
  // ... resto de configuración
}
```

### Paso 4: Build y Run

```bash
# Build the Docker image
docker build -t wtrebol-frontend --build-arg NEXT_PUBLIC_API_URL=https://api.wtrebol.com .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.wtrebol.com \
  wtrebol-frontend
```

### Paso 5: Docker Compose (Opcional)

Crea `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      args:
        NEXT_PUBLIC_API_URL: https://api.wtrebol.com
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.wtrebol.com
    restart: unless-stopped
```

Luego ejecuta:
```bash
docker-compose up -d
```

## ✅ Verificación

Una vez desplegado, verifica:

1. **Health Check**:
   ```bash
   curl http://localhost:3000
   ```

2. **API Connection**:
   - Abre el navegador en `http://tu-servidor:3000`
   - Verifica que carguen los slides
   - Revisa la consola del navegador (F12) - NO debe haber errores de localhost

3. **Server-Side Rendering**:
   - Haz `curl http://localhost:3000/servicios`
   - Debes ver el HTML renderizado con los servicios

## 🔧 Troubleshooting

### Problema: Sigue apuntando a localhost
**Solución**: Verifica que las variables de entorno estén correctamente inyectadas:
```bash
docker exec -it <container-id> env | grep NEXT_PUBLIC_API_URL
```

### Problema: 404 en las páginas
**Solución**: Asegúrate de copiar `.next/static` en el Dockerfile

### Problema: Build falla
**Solución**: Elimina `.next` y `node_modules` localmente antes de hacer build en Docker

## 📝 Notas Importantes

- ✅ El build local mostrará localhost en los logs - es NORMAL
- ✅ Lo que importa es que use `NEXT_PUBLIC_API_URL` en RUNTIME
- ✅ Docker build usará las variables de entorno que le pases
- ✅ El SSR funcionará correctamente en producción

**El proyecto está preparado para deployment con Docker SSR!** 🚀
