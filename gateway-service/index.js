const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const CATALOG_URL = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:8000';
const USERS_URL = process.env.USERS_SERVICE_URL || 'http://users-service:8000';

// --- RUTAS SIMPLES (Proxy) ---

// Catálogo completo
app.get('/api/peliculas', async (req, res) => {
    const resp = await axios.get(`${CATALOG_URL}/peliculas`);
    res.json(resp.data);
});

// Registrar progreso (Desde el reproductor de video)
app.post('/api/historial', async (req, res) => {
    const resp = await axios.post(`${USERS_URL}/historial`, req.body);
    res.json(resp.data);
});

// --- RUTA COMPUESTA (El requisito "Seguir Viendo") ---
// Esta ruta obtiene el historial del usuario Y rellena los datos de la película
app.get('/api/seguir-viendo/:usuarioId', async (req, res) => {
    try {
        // 1. Obtener historial del usuario (IDs y minutos)
        const historialResp = await axios.get(`${USERS_URL}/historial/${req.params.usuarioId}`);
        const historial = historialResp.data; // [{ peliculaId: "xyz", minutoPausa: 15 }, ...]

        if (historial.length === 0) return res.json([]);

        // 2. Extraer IDs de las películas
        const idsPeliculas = historial.map(item => item.peliculaId);

        // 3. Pedir al catálogo los detalles de ESAS películas
        const detallesResp = await axios.post(`${CATALOG_URL}/peliculas/batch`, { ids: idsPeliculas });
        const detallesPeliculas = detallesResp.data; // [{ id: "xyz", titulo: "Avatar", caratula: "..." }, ...]

        // 4. Combinar la información
        const resultado = historial.map(item => {
            const detalle = detallesPeliculas.find(p => p.id === item.peliculaId);
            return {
                ...item, // minutoPausa, fecha, etc.
                pelicula: detalle || null // Título, imagen, etc.
            };
        });

        res.json(resultado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error componiendo historial" });
    }
});

// El '0.0.0.0' es la clave para que Docker permita conexiones externas
app.listen(8000, '0.0.0.0', () => {
  console.log('Gateway running on port 8000');
});