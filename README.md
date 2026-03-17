# StreamHub - Microservicios

## Instrucciones para el equipo
Clonar el repo: git clone https://github.com/Joel-Euan-9/streamhub-microservicios.git

Crear archivos .env:

    En catalog-service/, copia .env.example y nómbralo .env.

    En users-service/, copia .env.example y nómbralo .env.

    En gateway-service/, copia .env.example y nómbralo .env.

Encender todo: 

    docker-compose up -d --build.

Configurar la DB (Solo la primera vez en orden):

    docker compose exec catalog-service npx prisma generate

    docker compose exec catalog-service npx prisma migrate dev --name init

    docker compose exec catalog-service node prisma/seed.js


    docker compose exec users-service npx prisma generate

    docker compose exec users-service npx prisma migrate dev --name init

    docker compose exec users-service node prisma/seed.js

Verificar:

    Backend: http://localhost:8000/docs

    Frontend: 
    Principal: http://localhost:3000
    Inicio: http://localhost:3000/inicio
    Login: http://localhost:3000/login

Integrantes:

    Joel Euan
    Eduardo Heredia
    Julio Olivera
    Moisés Pérez