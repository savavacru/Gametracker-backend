import Juego from '../models/Juego.js';
import fetch from 'node-fetch';

export const obtenerJuegos = async (req, res) => {
    try{
        const filtro = req.usuario ? { usuario: req.usuario.id } : {};
        const juegos = await Juego.find(filtro).sort({ createdAt: -1 });
        res.json(juegos);
    }catch(error){
        console.error("Error al obtener juegos:", error);
        res.status(500).json({mensaje: "Error al obtener los juegos"})
    }
};

export const agregarJuego = async (req, res) => {
    try{
        const nuevoJuego = new Juego({
            ...req.body,
            usuario: req.usuario.id,
        });
        
        const guardado = await nuevoJuego.save();
        res.status(201).json(guardado);
    }catch(error){
        console.error("Error al agregar juego:", error);
        res.status(500).json({mensaje: "Error al agregar el juego"})
    }
};

export const actualizarJuego = async (req, res) => {
    try{
        const juego = await Juego.findById(req.params.id);
        
        if (!juego) {
            return res.status(404).json({ mensaje: "Juego no encontrado" });
        }

        if (juego.usuario.toString() !== req.usuario.id.toString()) {
            return res.status(403).json({ 
                mensaje: "No tienes permiso para actualizar este juego" 
            });
        }
        
        const juegoActualizado = await Juego.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        res.json(juegoActualizado);
    }catch(error){
        console.error("Error al actualizar juego:", error);
        res.status(500).json({mensaje: "Error al actualizar el juego"})
    }
};

export const eliminarJuego = async (req, res) => {
    try{
        const juego = await Juego.findById(req.params.id);
        
        if (!juego) {
            return res.status(404).json({ mensaje: "Juego no encontrado" });
        }

        if (juego.usuario.toString() !== req.usuario.id.toString()) {
            return res.status(403).json({ 
                mensaje: "No tienes permiso para eliminar este juego" 
            });
        }

        await Juego.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "El juego se eliminó correctamente" });
    }catch(error){
        console.error("Error al eliminar juego:", error);
        res.status(500).json({mensaje: "Error al eliminar el juego"})
    }
};

export const buscarJuegos = async (req, res) => {
    try {
        const { nombre } = req.params;
        
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ mensaje: "Debes proporcionar un nombre de juego" });
        }

        const RAWG_KEY = process.env.RAWG_KEY;
        
        if (!RAWG_KEY) {
            return res.status(500).json({ mensaje: "API Key de RAWG no configurada" });
        }

        const respuesta = await fetch(
            `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(nombre)}&page_size=10`
        );
        
        if (!respuesta.ok) {
            throw new Error(`RAWG API respondió con status ${respuesta.status}`);
        }

        const data = await respuesta.json();

        const juegos = data.results.map(juego => ({
            id: juego.id,
            titulo: juego.name,
            imagen: juego.background_image || "",
            rating: juego.rating || 0,
            fechaLanzamiento: juego.released || "",
            plataformas: juego.platforms?.map(p => p.platform.name).join(", ") || "",
            generos: juego.genres?.map(g => g.name).join(", ") || "",
            descripcion: juego.description_raw || ""
        }));

        res.json(juegos);
    } catch (error) {
        console.error("Error al buscar juegos en RAWG:", error);
        res.status(500).json({ 
            mensaje: "Error al buscar juegos", 
            error: error.message 
        });
    }
};

export const obtenerJuegosCatalogo = async (req, res) => {
    try {
        const { categoria } = req.params;
        const RAWG_KEY = process.env.RAWG_KEY;
        
        if (!RAWG_KEY) {
            return res.status(500).json({ mensaje: "API Key de RAWG no configurada" });
        }

        const categoriasMap = {
            'populares': { ordering: '-rating', page_size: 12 },
            'accion': { genres: 'action', page_size: 12 },
            'aventura': { genres: 'adventure', page_size: 12 },
            'estrategia': { genres: 'strategy', page_size: 12 },
            'rpg': { genres: 'role-playing-games-rpg', page_size: 12 },
            'deportes': { genres: 'sports', page_size: 12 },
        };

        const filtros = categoriasMap[categoria.toLowerCase()];
        
        if (!filtros) {
            return res.status(400).json({ mensaje: "Categoría no válida" });
        }

        let url = `https://api.rawg.io/api/games?key=${RAWG_KEY}`;
        if (filtros.genres) {
            url += `&genres=${filtros.genres}`;
        }
        if (filtros.ordering) {
            url += `&ordering=${filtros.ordering}`;
        }
        url += `&page_size=${filtros.page_size}`;

        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`RAWG API respondió con status ${respuesta.status}`);
        }

        const data = await respuesta.json();

        const juegos = data.results.map(juego => ({
            id: juego.id,
            titulo: juego.name,
            imagen: juego.background_image || "",
            rating: juego.rating || 0,
            fechaLanzamiento: juego.released || "",
            plataformas: juego.platforms?.map(p => p.platform.name).slice(0, 3).join(", ") || "",
            generos: juego.genres?.map(g => g.name).join(", ") || "",
        }));

        res.json(juegos);
    } catch (error) {
        console.error(`Error al obtener juegos de catálogo ${req.params.categoria}:`, error);
        res.status(500).json({ 
            mensaje: "Error al obtener juegos del catálogo", 
            error: error.message 
        });
    }
};