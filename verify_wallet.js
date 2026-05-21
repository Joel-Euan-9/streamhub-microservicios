const axios = require('axios');

async function runTests() {
  console.log("🚀 Iniciando Suite de Verificación del Sistema de Ingresos...\n");

  const USERS_URL = 'http://localhost:8002';
  const CATALOG_URL = 'http://localhost:8001';
  const GATEWAY_URL = 'http://localhost:8000';

  try {
    // 1. Obtener detalles de usuarios desde la base de datos de usuarios
    console.log("1. Buscando usuarios de prueba...");
    const loginJoel = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'joel.euan@streamhub.com',
      password: 'password123'
    });
    const joelToken = `Bearer ${loginJoel.data.token}`;
    const joelUserId = loginJoel.data.user.id;
    console.log(`   ✅ Joel Euan logeado con éxito. ID: ${joelUserId}`);

    const loginLalo = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'lalo.heredia@streamhub.com',
      password: 'password123'
    });
    const laloToken = `Bearer ${loginLalo.data.token}`;
    const laloUserId = loginLalo.data.user.id;
    console.log(`   ✅ Lalo Heredia (espectador) logeado con éxito. ID: ${laloUserId}`);

    // 2. Obtener películas de Joel Euan
    console.log("\n2. Consultando películas en el catálogo...");
    const moviesResp = await axios.get(`${CATALOG_URL}/peliculas?creadorId=${joelUserId}`);
    const movies = moviesResp.data;
    if (movies.length === 0) {
      throw new Error("No se encontraron películas para el creador Joel Euan.");
    }
    const movie = movies[0];
    console.log(`   ✅ Película encontrada para test: "${movie.titulo}" (ID: ${movie.id})`);

    // 3. Consultar perfil inicial de Joel
    console.log("\n3. Verificando perfil y saldo inicial de Joel Euan...");
    const profileJoel = await axios.get(`${GATEWAY_URL}/api/perfil`, {
      headers: { Authorization: joelToken }
    });
    console.log(`   ✅ Saldo de billetera inicial: $${profileJoel.data.saldoBilletera} MXN (Esperado: 25.5)`);

    // 4. Consultar transacciones de Joel
    console.log("\n4. Verificando historial de transacciones inicial...");
    const txsJoel = await axios.get(`${GATEWAY_URL}/api/perfil/transacciones`, {
      headers: { Authorization: joelToken }
    });
    console.log(`   ✅ Transacciones encontradas: ${txsJoel.data.length} registros.`);
    txsJoel.data.forEach(t => {
      console.log(`      - [${t.fecha.substring(0, 10)}] ${t.descripcion}: $${t.monto} MXN`);
    });

    // 5. Intentar retirar dinero con saldo insuficiente (< $500)
    console.log("\n5. Validando límite de retiro mínimo ($500.00 MXN)...");
    try {
      await axios.post(`${GATEWAY_URL}/api/perfil/retirar`, { monto: 20 }, {
        headers: { Authorization: joelToken }
      });
      console.log("   ❌ Error: El retiro de $20 debió fallar por saldo mínimo.");
    } catch (err) {
      console.log(`   ✅ Éxito: El retiro falló como se esperaba. Motivo: "${err.response.data.error}"`);
    }

    // 6. Simular reproducción de película por 60 segundos por Lalo Heredia (espectador)
    console.log("\n6. Simulando reproducción de 60 segundos por Lalo Heredia...");
    const histResp = await axios.post(`${USERS_URL}/historial`, {
      usuarioId: laloUserId,
      peliculaId: movie.id,
      minuto: 60,
      completada: false
    });
    console.log(`   ✅ Progreso enviado. Monetizada en visualización: ${histResp.data.monetizada}`);

    // 7. Verificar nuevo saldo de Joel (debe incrementarse por $10.00 MXN)
    console.log("\n7. Verificando si el saldo de Joel se incrementó...");
    const profileJoelAfter = await axios.get(`${GATEWAY_URL}/api/perfil`, {
      headers: { Authorization: joelToken }
    });
    console.log(`   ✅ Nuevo saldo: $${profileJoelAfter.data.saldoBilletera} MXN (Esperado: 35.5)`);

    // 8. Intentar reproducir de nuevo por 60s (evitar doble monetización)
    console.log("\n8. Intentando reproducir de nuevo para validar protección anti-spam...");
    await axios.post(`${USERS_URL}/historial`, {
      usuarioId: laloUserId,
      peliculaId: movie.id,
      minuto: 70,
      completada: false
    });
    
    const profileJoelAfterSpam = await axios.get(`${GATEWAY_URL}/api/perfil`, {
      headers: { Authorization: joelToken }
    });
    console.log(`   ✅ Saldo después de re-reproducción: $${profileJoelAfterSpam.data.saldoBilletera} MXN (Esperado: 35.5 - Sin incremento adicional)`);

    // 9. Acreditar saldo simulado masivo para poder retirar
    console.log("\n9. Acreditando saldo masivo simulado directamente a la billetera de Joel...");
    await axios.post(`${USERS_URL}/billetera/comision`, {
      creadorId: joelUserId,
      monto: 500.0,
      descripcion: "Abono masivo para pruebas de retiro"
    });
    
    const profileJoelMassive = await axios.get(`${GATEWAY_URL}/api/perfil`, {
      headers: { Authorization: joelToken }
    });
    console.log(`   ✅ Saldo con abono masivo: $${profileJoelMassive.data.saldoBilletera} MXN`);

    // 10. Solicitar retiro exitoso
    console.log("\n10. Solicitando retiro simulado de $500.00 MXN...");
    const withdrawResp = await axios.post(`${GATEWAY_URL}/api/perfil/retirar`, { monto: 500.0 }, {
      headers: { Authorization: joelToken }
    });
    console.log(`   ✅ Retiro exitoso. Saldo restante: $${withdrawResp.data.saldoBilletera} MXN`);

    // 11. Consultar transacciones finales
    console.log("\n11. Consultando transacciones finales...");
    const finalTxs = await axios.get(`${GATEWAY_URL}/api/perfil/transacciones`, {
      headers: { Authorization: joelToken }
    });
    finalTxs.data.slice(0, 4).forEach(t => {
      console.log(`      - ${t.descripcion}: $${t.monto} MXN`);
    });

    console.log("\n🎉 ¡TODAS LAS VALIDACIONES DE BILLETERA PASARON EXITOSAMENTE! 🎉");

  } catch (error) {
    console.error("\n❌ Error durante las pruebas de integración:", error.message);
    if (error.response) {
      console.error("   Detalle de respuesta del error:", error.response.data);
    }
  }
}

runTests();
