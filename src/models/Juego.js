import mongoose from "mongoose";

const juegoSchema = new mongoose.Schema({
    titulo: {
        type : String,
        required: true,
    },
    genero:{
        type: String,
        required: true,
    },
    horasJugadas:{
        type: Number,
        default:0,
    },
    estado:{
        type: Boolean,
        default: false,
    },
    portada:{
        type: String,
        required: true,
    },
    calificacion:{
        type: Number,
        default: 0,
    },
});

const Juego = mongoose.model("Juego", juegoSchema);

export default Juego;