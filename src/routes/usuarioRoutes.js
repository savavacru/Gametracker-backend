import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  logoutUsuario,
  obtenerPerfil,
} from "../controllers/usuarioController.js";
import { verificarToken, verificarSesion } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.post("/register", registrarUsuario); // POST /api/auth/register
router.post("/registro", registrarUsuario); // Alias español
router.post("/login", loginUsuario); // POST /api/auth/login

// Rutas privadas (requieren autenticación)
router.post("/logout", verificarToken, logoutUsuario); // POST /api/auth/logout
router.get("/perfil", verificarToken, obtenerPerfil); // GET /api/auth/perfil o /api/usuarios/perfil
router.get("/verificar", verificarSesion, obtenerPerfil); // GET /api/auth/verificar (usa middleware especial)

export default router;