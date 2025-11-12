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

router.get("/catalogo/:categoria", obtenerJuegosCatalogo);
router.get("/buscar/:nombre", buscarJuegos);

router.get("/", verificarTokenOpcional, obtenerJuegos);

router.post("/", verificarToken, agregarJuego);
router.put("/:id", verificarToken, actualizarJuego);
router.delete("/:id", verificarToken, eliminarJuego);

export default router;