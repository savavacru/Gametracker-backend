import express from "express"
import { obtenerJuegos, agregarJuego, actualizarJuego,eliminarJuego } from "../controllers/juegoController.js"

const router = express.Router();

router.get("/", obtenerJuegos);
router.post("/", agregarJuego);
router.put("/:id", actualizarJuego);
router.delete("/:id", eliminarJuego);

export default router;