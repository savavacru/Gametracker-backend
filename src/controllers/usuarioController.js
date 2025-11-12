import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secreto_super_seguro", {
    expiresIn: "2h",
  });
};

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: "Por favor proporcione nombre, email y contraseña",
      });
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        mensaje: "El email ya está registrado",
      });
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password,
    });

    const token = generarToken(usuario._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message,
    });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Por favor proporcione email y contraseña",
      });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    const passwordCorrecto = await usuario.compararPassword(password);
    if (!passwordCorrecto) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    const token = generarToken(usuario._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({
      mensaje: "Error al hacer login",
      error: error.message,
    });
  }
};

export const logoutUsuario = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      mensaje: "Logout exitoso",
    });
  } catch (error) {
    console.error("Error en logoutUsuario:", error);
    res.status(500).json({
      mensaje: "Error al hacer logout",
      error: error.message,
    });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      autenticado: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        createdAt: usuario.createdAt,
      },
    });
  } catch (error) {
    console.error("Error en obtenerPerfil:", error);
    res.status(500).json({
      autenticado: false,
      mensaje: "Error al obtener perfil",
      error: error.message,
    });
  }
};