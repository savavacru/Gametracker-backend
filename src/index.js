import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import juegoRoutes from './routes/juegoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  'https://savavacru.github.io',
  'https://gametracker-ruddy.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'La política de CORS no permite el acceso desde este origen.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/juegos", juegoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", usuarioRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API de GameTracker funcionando correctamente" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});