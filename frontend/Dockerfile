# frontend/Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Construimos la aplicación para producción
RUN npm run build

EXPOSE 3000

# Iniciamos el servidor de producción (ya no usamos "dev")
CMD ["npm", "start"]