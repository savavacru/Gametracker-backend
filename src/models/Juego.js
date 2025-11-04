import mongoose from "mongoose";

const juegoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        default: "",
    },
    imagen: {
        type: String,
        default: "",
    },
    genero: {
        type: String,
        default: "",
    },
    plataforma: {
        type: String,
        default: "",
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    fechaLanzamiento: {
        type: String,
        default: "",
    },
    horasJugadas: {
        type: Number,
        default: 0,
    },
    estado: {
        type: Boolean,
        default: false,
    },
    // Referencia al usuario propietario del juego
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
}, {
    timestamps: true, // Agrega createdAt y updatedAt
});

const Juego = mongoose.model("Juego", juegoSchema);

export default Juego;