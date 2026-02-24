FROM node:22-slim AS builder

WORKDIR /app

# Primero las dependencias para Docker caché
COPY package*.json ./
RUN npm ci

# Luego copiamos el resto y construimos
COPY . .
RUN npm run build:prod

# Nginx para servir la SPA
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos el build correcto desde la etapa anterior
# En Angular 17.1+ usando application builder, se guarda en dist/<project-name>/browser
COPY --from=builder /app/dist/clip-studio/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
