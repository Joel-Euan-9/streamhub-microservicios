FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ELIMINADA LA LÍNEA: RUN npx prisma generate 
# El gateway no usa base de datos directa, solo HTTP.

EXPOSE 8000

CMD ["node", "index.js"]