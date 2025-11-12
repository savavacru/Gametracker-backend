import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export const verificarToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        mensaje: "No autorizado. No se proporcionó token de autenticación",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secreto_super_seguro"
    );

    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (!usuario) {
      return res.status(401).json({
        mensaje: "No autorizado. Usuario no encontrado",
      });
    }

    req.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    };

    next();
  } catch (error) {
    console.error("Error en verificarToken:", error);

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

export const verificarSesion = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(200).json({
        autenticado: false,
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secreto_super_seguro"
    );

    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (!usuario) {
      return res.status(200).json({
        autenticado: false,
      });
    }

    req.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    };

    next();
  } catch (error) {
    console.error("Error en verificarSesion:", error);
    
    return res.status(200).json({
      autenticado: false,
    });
  }
};

export const verificarTokenOpcional = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secreto_super_seguro"
    );

    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (usuario) {
      req.usuario = {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      };
    }

    next();
  } catch (error) {
    next();
  }
};