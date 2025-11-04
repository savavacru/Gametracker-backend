import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Middleware para verificar el token JWT desde las cookies
export const verificarToken = async (req, res, next) => {
  try {
    // Obtener el token de las cookies
    const token = req.cookies.token;

    // Verificar si el token existe
    if (!token) {
      return res.status(401).json({
        mensaje: "No autorizado. No se proporcionó token de autenticación",
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secreto_super_seguro"
    );

    // Buscar el usuario en la base de datos (sin incluir la contraseña)
    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (!usuario) {
      return res.status(401).json({
        mensaje: "No autorizado. Usuario no encontrado",
      });
    }

    // Agregar el usuario al objeto request
    req.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    };

    // Continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    console.error("Error en verificarToken:", error);

    // Manejar diferentes tipos de errores de JWT
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        mensaje: "Token inválido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        mensaje: "Token expirado. Por favor inicie sesión nuevamente",
      });
    }

    res.status(500).json({
      mensaje: "Error al verificar autenticación",
      error: error.message,
    });
  }
};

// Middleware para verificar sesión sin lanzar error (para ruta /verificar)
export const verificarSesion = async (req, res, next) => {
  try {
    // Obtener el token de las cookies
    const token = req.cookies.token;

    // Si no hay token, devolver autenticado: false
    if (!token) {
      return res.status(200).json({
        autenticado: false,
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secreto_super_seguro"
    );

    // Buscar el usuario en la base de datos (sin incluir la contraseña)
    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (!usuario) {
      return res.status(200).json({
        autenticado: false,
      });
    }

    // Si todo está bien, pasar al siguiente middleware/controlador
    req.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    };

    next();
  } catch (error) {
    console.error("Error en verificarSesion:", error);
    
    // En caso de error, devolver autenticado: false
    return res.status(200).json({
      autenticado: false,
    });
  }
};