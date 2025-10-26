import Juego from '../models/Juego.js';

//Obtener todos los juegos
export const obtenerJuegos = async (req, res) => {
    try{
        const juegos = await Juego.find();
        res.json(juegos);
    }catch(error){
        res.status(500).json({mensaje: "Errror al obtener el juego"})
    }
};
export const agregarJuego = async (req, res) => {
    try{
        const nuevoJuego = new Juego(req.body);
        const guardado = await nuevoJuego.save();
        res.json(guardado);
    }catch(error){
        res.status(500).json({mensaje: "Errror al agregar el juego"})
    }
};
export const actualizarJuego = async (req, res) => {
    try{
        const juegoActualizado = await Juego.findByIdAndUpdate(req.param.id, req.body, {new: true});
        res.json(juegoActualizado);
    }catch(error){
        res.status(500).json({mensaje: "Errror al actualizar el juego"})
    }
};
export const eliminarJuego = async (req, res) => {
    try{
        await Juego.findByIdAndDelete(req.param.id);
        res.json("El juego se elimino.");
    }catch(error){
        res.status(500).json({mensaje: "Errror al eliminar el juego"})
    }
};