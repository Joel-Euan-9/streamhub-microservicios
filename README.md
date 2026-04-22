# StreamHub - Microservicios

## Instrucciones para el equipo
Clonar el repo: git clone https://github.com/Joel-Euan-9/streamhub-microservicios.git

Crear archivos .env:

    En catalog-service/, copia .env.example y nómbralo .env

    En users-service/, copia .env.example y nómbralo .env

    En gateway-service/, copia .env.example y nómbralo .env

    En interactions-service/, copia .env.example y nómbralo .env

    En frontend/, copia .env.local.example y nómbralo .env.local

Encender todo: 

    docker-compose up -d --build.

Configurar la DB (Solo la primera vez en orden):

    docker compose exec catalog-service npx prisma generate

    docker compose exec catalog-service npx prisma migrate dev --name init

    docker compose exec catalog-service node prisma/seed.js


    docker compose exec users-service npx prisma generate

    docker compose exec users-service npx prisma migrate dev --name init

    docker compose exec users-service node prisma/seed.js


    docker compose exec interactions-service npx prisma generate

    docker compose exec interactions-service npx prisma migrate dev --name init

Destruir y construir el contenedor método rápido:

    docker compose down

    docker compose up -d --build

Destruir y construir el contenedor desde 0 de forma limpia:

    git checkout desarrollo

    git pull origin desarrollo

    docker compose down -v --rmi all

    docker compose up -d --build

    Ejecutar todas las migraciones

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