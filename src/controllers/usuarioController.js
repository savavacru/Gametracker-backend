import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

// Función auxiliar para generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secreto_super_seguro", {
    expiresIn: "2h", // Token expira en 2 horas
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/usuarios/register
// @access  Público
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: "Por favor proporcione nombre, email y contraseña",
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        mensaje: "El email ya está registrado",
      });
    }

    // Crear el usuario (la contraseña se encripta automáticamente con el middleware)
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
    });

    // Generar token JWT
    const token = generarToken(usuario._id);

    // Enviar cookie con el token
    res.cookie("token", token, {
      httpOnly: true, // No accesible desde JavaScript del cliente
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000, // 2 horas en milisegundos
    });

    // Responder con los datos del usuario (sin contraseña)
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

// @desc    Login de usuario
// @route   POST /api/usuarios/login
// @access  Público
export const loginUsuario = async (req, res) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 INICIO DE SESIÓN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const { email, password } = req.body;

    // Validar que los campos estén presentes
    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Por favor proporcione email y contraseña",
      });
    }

    console.log('📧 Email recibido:', email);

    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    console.log('✅ Usuario encontrado:', {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email
    });

    // Verificar la contraseña
    const passwordCorrecto = await usuario.compararPassword(password);
    if (!passwordCorrecto) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    console.log('✅ Contraseña correcta');

    // Generar token JWT
    const token = generarToken(usuario._id);
    console.log('🎫 Token generado:', token.substring(0, 20) + '...');

    // Enviar cookie con el token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });

    console.log('🍪 Cookie "token" establecida');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Responder con los datos del usuario
    res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("❌ Error en loginUsuario:", error);
    res.status(500).json({
      mensaje: "Error al hacer login",
      error: error.message,
    });
  }
};

// @desc    Logout de usuario
// @route   POST /api/usuarios/logout
// @access  Privado
export const logoutUsuario = (req, res) => {
  try {
    // Eliminar la cookie estableciendo maxAge en 0
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expira inmediatamente
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

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/usuarios/perfil
// @access  Privado
export const obtenerPerfil = async (req, res) => {
  try {
    // req.usuario fue establecido por el middleware verificarToken
    const usuario = await Usuario.findById(req.usuario.id).select("-password");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      autenticado: true, // Agregar campo para compatibilidad con el documento
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