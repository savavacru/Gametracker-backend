import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  logoutUsuario,
  obtenerPerfil,
} from "../controllers/usuarioController.js";
import { verificarToken, verificarSesion } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);

router.post("/logout", verificarToken, logoutUsuario);
router.get("/perfil", verificarToken, obtenerPerfil);
router.get("/verificar", verificarSesion, obtenerPerfil);

export default router;