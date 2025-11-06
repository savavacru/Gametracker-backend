import express from "express"
import { 
    obtenerJuegos, 
    agregarJuego, 
    actualizarJuego,
    eliminarJuego,
    buscarJuegos 
} from "../controllers/juegoController.js"
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.get("/buscar/:nombre", buscarJuegos); // Búsqueda en RAWG
router.get("/", obtenerJuegos); // Catálogo de juegos (público)

// Rutas protegidas (requieren autenticación)
router.post("/", verificarToken, agregarJuego); // Agregar juego a biblioteca personal
router.put("/:id", verificarToken, actualizarJuego); // Editar juego de biblioteca personal
router.delete("/:id", verificarToken, eliminarJuego); // Eliminar juego de biblioteca personal

export default router;