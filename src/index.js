import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import juegoRoutes from './routes/juegoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

dotenv.config();

const app = express();

// Middlewares
// Configuración de CORS para permitir cookies desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // URL del frontend
  credentials: true, // Permitir envío de cookies
}));

app.use(express.json()); // Para parsear JSON
app.use(cookieParser()); // Para parsear cookies

// Conexión a la base de datos
connectDB();

// Rutas
app.use("/api/juegos", juegoRoutes);
app.use("/api/usuarios", usuarioRoutes); // Rutas originales
app.use("/api/auth", usuarioRoutes); // Alias para compatibilidad con frontend

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "API de GameTracker funcionando correctamente" });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});