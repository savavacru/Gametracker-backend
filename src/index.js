import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Juego from './models/Juego.js';
import JuegoRoutes from './routes/juegoRoutes.js'

dotenv.config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Conexion a la base de datos
connectDB();

app.use("/api/juegos", JuegoRoutes);

//Puerto
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
})