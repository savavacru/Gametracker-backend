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

// Ruta de búsqueda en RAWG (pública, no requiere autenticación)
router.get("/buscar/:nombre", buscarJuegos);

// Rutas protegidas (requieren autenticación)
router.get("/", verificarToken, obtenerJuegos);
router.post("/", verificarToken, agregarJuego);
router.put("/:id", verificarToken, actualizarJuego);
router.delete("/:id", verificarToken, eliminarJuego);

export default router;