const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    let token;

    // 🔹 1. Intentar desde header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 🔹 2. Si no hay token
    if (!token) {
      return res.status(401).json({ error: "Token requerido" });
    }

    // 🔹 3. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 4. Adjuntar usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();

  } catch (error) {
    console.error("JWT ERROR:", error.message);

    return res.status(401).json({
      error: "Token inválido o expirado"
    });
  }
};

module.exports = authMiddleware;