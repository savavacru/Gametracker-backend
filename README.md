# 🎮 GameTracker Backend

API RESTful para la aplicación GameTracker - Sistema de seguimiento y gestión de videojuegos personales.

## 🚀 Tecnologías

- **Node.js** v18+ con ES Modules
- **Express** 5.1.0 - Framework web
- **MongoDB** con Mongoose - Base de datos
- **JWT** - Autenticación con cookies httpOnly
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Configurado para frontend en React

## 📋 Requisitos Previos

- Node.js 18 o superior
- MongoDB (local o MongoDB Atlas)
- Cuenta en RAWG API para búsqueda de juegos

## ⚙️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=tu_secreto_super_seguro
MONGODB_URI=mongodb://localhost:27017/gametracker
RAWG_KEY=tu_api_key_de_rawg
```

### 3. Ejecutar el servidor

**Modo desarrollo** (con nodemon):
```bash
npm run dev
```

**Modo producción**:
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
gametracker-backend/
├── src/
│   ├── config/
│   │   └── db.js              # Configuración de MongoDB
│   ├── controllers/
│   │   ├── juegoController.js # Lógica de juegos
│   │   └── usuarioController.js # Lógica de usuarios
│   ├── middleware/
│   │   └── authMiddleware.js  # Verificación de JWT
│   ├── models/
│   │   ├── Juego.js          # Modelo de juego
│   │   └── Usuario.js        # Modelo de usuario
│   ├── routes/
│   │   ├── juegoRoutes.js    # Rutas de juegos
│   │   └── usuarioRoutes.js  # Rutas de usuarios
│   └── index.js              # Punto de entrada
├── .env                      # Variables de entorno (no incluir en git)
├── .env.example             # Plantilla de variables
├── package.json
└── README.md
```

## 🛣️ API Endpoints

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/usuarios/register` | Registrar usuario | No |
| POST | `/api/usuarios/login` | Iniciar sesión | No |
| POST | `/api/usuarios/logout` | Cerrar sesión | Sí |
| GET | `/api/usuarios/perfil` | Obtener perfil | Sí |

### Juegos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/juegos` | Obtener juegos del usuario | Opcional* |
| POST | `/api/juegos` | Agregar juego | Sí |
| PUT | `/api/juegos/:id` | Editar juego | Sí |
| DELETE | `/api/juegos/:id` | Eliminar juego | Sí |

*La ruta GET /api/juegos usa `verificarTokenOpcional` - devuelve juegos del usuario si está autenticado, array vacío si no.

## 🔐 Autenticación

El sistema usa **JWT almacenado en cookies httpOnly** para mayor seguridad:

1. Usuario se registra o hace login
2. Servidor genera JWT y lo envía en cookie `token`
3. Cookie se incluye automáticamente en requests subsecuentes
4. Middleware `verificarToken` valida el token
5. Token expira en 2 horas

### Configuración de Cookies

```javascript
res.cookie("token", token, {
  httpOnly: true,                                    // No accesible desde JavaScript
  secure: process.env.NODE_ENV === "production",    // Solo HTTPS en producción
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 2 * 60 * 60 * 1000                        // 2 horas
});
```

## 💾 Modelos de Datos

### Usuario

```javascript
{
  nombre: String,
  email: String (único),
  password: String (hasheado con bcrypt)
}
```

### Juego

```javascript
{
  titulo: String (requerido),
  descripcion: String,
  imagen: String (URL),
  genero: String,
  plataforma: String,
  rating: Number (0-5),
  fechaLanzamiento: Date,
  horasJugadas: Number,
  estado: Boolean (completado/pendiente),
  usuario: ObjectId (referencia a Usuario)
}
```

## 🌐 CORS

El servidor está configurado para aceptar requests desde:

- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite dev server)
- URL configurada en `FRONTEND_URL`
- `https://savavacru.github.io` (GitHub Pages)

## 🚀 Despliegue en Producción

Ver [DEPLOYMENT.md](../DEPLOYMENT.md) para instrucciones completas de despliegue en Render.

### Resumen:

1. **MongoDB Atlas**: Crear cluster gratuito y obtener URI
2. **Render**: Crear Web Service
3. **Variables de entorno**: Configurar en Render Dashboard
4. **Build**: Automático con `npm install`
5. **Start**: Automático con `npm start`

## 🐛 Debugging

El servidor incluye logging detallado en:

- `verificarTokenOpcional`: Verificación de tokens
- `loginUsuario`: Proceso de inicio de sesión
- `obtenerJuegos`: Consultas de juegos filtradas por usuario
- `agregarJuego`: Creación de nuevos juegos

Logs marcados con emojis y separadores visuales para fácil identificación.

## 📝 Notas de Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT con expiración de 2 horas
- ✅ Cookies httpOnly (no accesibles desde JS)
- ✅ CORS configurado estrictamente
- ✅ Variables sensibles en .env (no en código)
- ✅ Validación de entrada en controllers

## 🤝 Contribuir

Este es un proyecto personal, pero sugerencias son bienvenidas.

## 📄 Licencia

ISC
