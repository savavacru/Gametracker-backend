import express from "express"
import { 
    obtenerJuegos, 
    agregarJuego, 
    actualizarJuego,
    eliminarJuego,
    buscarJuegos,
    obtenerJuegosCatalogo
} from "../controllers/juegoController.js"
import { verificarToken, verificarTokenOpcional } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.get("/catalogo/:categoria", obtenerJuegosCatalogo); // Catálogo por categorías desde RAWG
router.get("/buscar/:nombre", buscarJuegos); // Búsqueda en RAWG

// Ruta que filtra por usuario si está autenticado, o devuelve todos si no lo está
router.get("/", verificarTokenOpcional, obtenerJuegos); // Biblioteca personal (si está autenticado)

// Rutas protegidas (requieren autenticación)
router.post("/", verificarToken, agregarJuego); // Agregar juego a biblioteca personal
router.put("/:id", verificarToken, actualizarJuego); // Editar juego de biblioteca personal
router.delete("/:id", verificarToken, eliminarJuego); // Eliminar juego de biblioteca personal

export default router;