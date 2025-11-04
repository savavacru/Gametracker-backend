# 📋 Tareas Pendientes del Backend - GameTracker

Este documento detalla todas las funcionalidades que necesitas implementar en el backend de Node.js/Express para que el frontend funcione correctamente.

---

## 🔧 Configuración Inicial

### 1. Instalar Dependencias Necesarias
```bash
npm install express mongoose bcryptjs jsonwebtoken cookie-parser cors dotenv
```

**Explicación de cada paquete:**
- `express`: Framework web para Node.js
- `mongoose`: ODM para MongoDB
- `bcryptjs`: Encriptar contraseñas
- `jsonwebtoken`: Generar y verificar tokens JWT
- `cookie-parser`: Manejar cookies en las peticiones
- `cors`: Permitir peticiones desde el frontend (React)
- `dotenv`: Manejar variables de entorno

---

## 📁 Estructura de Carpetas Recomendada

```
backend/
├── server.js                 # Punto de entrada
├── .env                      # Variables de entorno
├── config/
│   └── db.js                # Conexión a MongoDB
├── models/
│   ├── Usuario.js           # Modelo de Usuario
│   └── Juego.js             # Modelo de Juego
├── routes/
│   ├── authRoutes.js        # Rutas de autenticación
│   └── juegoRoutes.js       # Rutas de juegos
├── controllers/
│   ├── authController.js    # Lógica de autenticación
│   └── juegoController.js   # Lógica de juegos
└── middleware/
    └── authMiddleware.js    # Middleware para verificar JWT
```

---

## 🗄️ Modelos de MongoDB

### Modelo: Usuario (`models/Usuario.js`)

```javascript
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
```

### Modelo: Juego (`models/Juego.js`)

```javascript
const mongoose = require('mongoose');

const juegoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  genero: {
    type: String,
    required: true,
    trim: true
  },
  horasJugadas: {
    type: Number,
    default: 0,
    min: 0
  },
  estado: {
    type: Boolean,
    default: false  // false = pendiente, true = completado
  },
  portadaUrl: {
    type: String,
    default: null
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true  // Cada juego pertenece a un usuario
  },
  fechaAgregado: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Juego', juegoSchema);
```

---

## 🔐 Endpoints de Autenticación

### Base URL: `/api/auth`

#### 1. **POST** `/api/auth/registro`
Registrar un nuevo usuario.

**Body (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta exitosa (201):**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": "64abc123...",
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Tareas:**
- ✅ Validar que el email no exista
- ✅ Encriptar password con bcrypt
- ✅ Crear usuario en MongoDB
- ✅ Generar JWT
- ✅ Enviar cookie con el token (httpOnly: true)
- ✅ Retornar datos del usuario (sin password)

---

#### 2. **POST** `/api/auth/login`
Iniciar sesión.

**Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Login exitoso",
  "usuario": {
    "id": "64abc123...",
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Tareas:**
- ✅ Buscar usuario por email
- ✅ Comparar password con bcrypt
- ✅ Generar JWT
- ✅ Enviar cookie con el token (httpOnly: true, secure en producción)
- ✅ Retornar datos del usuario

---

#### 3. **POST** `/api/auth/logout`
Cerrar sesión.

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Sesión cerrada exitosamente"
}
```

**Tareas:**
- ✅ Limpiar la cookie del token
- ✅ Retornar confirmación

---

#### 4. **GET** `/api/auth/verificar`
Verificar si hay una sesión activa (cookie válida).

**Headers:**
- Cookie con el JWT

**Respuesta exitosa (200):**
```json
{
  "autenticado": true,
  "usuario": {
    "id": "64abc123...",
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Respuesta sin autenticación (401):**
```json
{
  "autenticado": false
}
```

**Tareas:**
- ✅ Verificar JWT desde la cookie
- ✅ Si es válido, buscar usuario y retornarlo
- ✅ Si no es válido, retornar autenticado: false

---

## 🎮 Endpoints de Juegos

### Base URL: `/api/juegos`

**IMPORTANTE:** Todos estos endpoints necesitan autenticación (middleware).

#### 1. **GET** `/api/juegos`
Obtener todos los juegos del usuario autenticado.

**Headers:**
- Cookie con JWT

**Respuesta exitosa (200):**
```json
[
  {
    "_id": "64xyz789...",
    "titulo": "Zelda: Breath of the Wild",
    "genero": "Aventura",
    "horasJugadas": 120,
    "estado": true,
    "portadaUrl": "https://...",
    "usuarioId": "64abc123...",
    "fechaAgregado": "2025-11-01T..."
  },
  {
    "_id": "64xyz790...",
    "titulo": "The Witcher 3",
    "genero": "RPG",
    "horasJugadas": 85,
    "estado": false,
    "portadaUrl": "https://...",
    "usuarioId": "64abc123...",
    "fechaAgregado": "2025-11-02T..."
  }
]
```

**Tareas:**
- ✅ Verificar JWT (middleware)
- ✅ Obtener userId del token
- ✅ Buscar juegos donde `usuarioId === userId`
- ✅ Retornar array de juegos

---

#### 2. **POST** `/api/juegos`
Agregar un nuevo juego a la biblioteca del usuario.

**Headers:**
- Cookie con JWT

**Body (JSON):**
```json
{
  "titulo": "Elden Ring",
  "genero": "RPG",
  "horasJugadas": 0,
  "estado": false,
  "portadaUrl": "https://..."
}
```

**Respuesta exitosa (201):**
```json
{
  "_id": "64xyz791...",
  "titulo": "Elden Ring",
  "genero": "RPG",
  "horasJugadas": 0,
  "estado": false,
  "portadaUrl": "https://...",
  "usuarioId": "64abc123...",
  "fechaAgregado": "2025-11-04T..."
}
```

**Tareas:**
- ✅ Verificar JWT (middleware)
- ✅ Obtener userId del token
- ✅ Crear juego asociándolo al usuario (`usuarioId`)
- ✅ Guardar en MongoDB
- ✅ Retornar el juego creado

---

#### 3. **PUT** `/api/juegos/:id`
Editar un juego existente.

**Headers:**
- Cookie con JWT

**Parámetros URL:**
- `id`: ID del juego a editar

**Body (JSON):**
```json
{
  "titulo": "Elden Ring",
  "genero": "Action RPG",
  "horasJugadas": 50,
  "estado": false
}
```

**Respuesta exitosa (200):**
```json
{
  "_id": "64xyz791...",
  "titulo": "Elden Ring",
  "genero": "Action RPG",
  "horasJugadas": 50,
  "estado": false,
  "portadaUrl": "https://...",
  "usuarioId": "64abc123...",
  "fechaAgregado": "2025-11-04T..."
}
```

**Tareas:**
- ✅ Verificar JWT (middleware)
- ✅ Obtener userId del token
- ✅ Buscar juego por ID y verificar que `usuarioId === userId` (seguridad)
- ✅ Actualizar campos del juego
- ✅ Retornar el juego actualizado

---

#### 4. **DELETE** `/api/juegos/:id`
Eliminar un juego de la biblioteca.

**Headers:**
- Cookie con JWT

**Parámetros URL:**
- `id`: ID del juego a eliminar

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Juego eliminado exitosamente"
}
```

**Tareas:**
- ✅ Verificar JWT (middleware)
- ✅ Obtener userId del token
- ✅ Buscar juego por ID y verificar que `usuarioId === userId` (seguridad)
- ✅ Eliminar juego de MongoDB
- ✅ Retornar confirmación

---

## 🔒 Middleware de Autenticación

### `middleware/authMiddleware.js`

Este middleware debe:
1. Leer la cookie que contiene el JWT
2. Verificar que el token sea válido
3. Extraer el `userId` del token
4. Adjuntarlo a `req.usuario` para que los controladores lo usen
5. Si no hay token o es inválido, retornar 401 Unauthorized

**Ejemplo de uso en rutas:**
```javascript
router.get('/juegos', authMiddleware, obtenerJuegos);
router.post('/juegos', authMiddleware, agregarJuego);
```

---

## 🌐 Configuración de CORS

En `server.js`, configura CORS para permitir cookies:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // URL del frontend
  credentials: true // Permite enviar cookies
}));
```

---

## 🍪 Configuración de Cookies

Las cookies JWT deben tener estas opciones:

```javascript
res.cookie('token', jwt_token, {
  httpOnly: true,      // No accesible desde JavaScript
  secure: false,       // En desarrollo false, en producción true (HTTPS)
  sameSite: 'lax',     // Protección CSRF
  maxAge: 24 * 60 * 60 * 1000  // 24 horas
});
```

---

## 🔐 Variables de Entorno (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gametracker
JWT_SECRET=tu_clave_secreta_muy_segura_12345
NODE_ENV=development
```

---

## ✅ Checklist de Implementación

### Configuración Inicial
- [ ] Instalar todas las dependencias
- [ ] Configurar conexión a MongoDB
- [ ] Configurar variables de entorno (.env)
- [ ] Configurar CORS con credentials
- [ ] Configurar cookie-parser

### Modelos
- [ ] Crear modelo Usuario
- [ ] Crear modelo Juego (con relación a Usuario)

### Autenticación
- [ ] POST /api/auth/registro
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/verificar
- [ ] Crear middleware de autenticación

### CRUD de Juegos
- [ ] GET /api/juegos (obtener juegos del usuario)
- [ ] POST /api/juegos (agregar juego)
- [ ] PUT /api/juegos/:id (editar juego)
- [ ] DELETE /api/juegos/:id (eliminar juego)
- [ ] Validar que cada operación solo afecte juegos del usuario autenticado

### Seguridad
- [ ] Encriptar contraseñas con bcrypt
- [ ] Generar JWT correctamente
- [ ] Validar tokens en cada petición protegida
- [ ] Verificar que los usuarios solo accedan a sus propios juegos
- [ ] Configurar cookies httpOnly

---

## 🚀 Comandos para Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (con nodemon)
npm run dev

# O ejecutar normalmente
node server.js
```

---

## 📝 Notas Importantes

1. **Todos los juegos están asociados a un usuario**: El campo `usuarioId` es obligatorio
2. **Seguridad**: Siempre verifica que el usuario solo pueda ver/editar/eliminar SUS propios juegos
3. **Cookies**: Usa httpOnly para evitar ataques XSS
4. **CORS**: Debe estar configurado con `credentials: true`
5. **JWT Secret**: Usa una clave segura y guárdala en .env

---

## 🆘 Posibles Errores y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| CORS error | CORS no configurado | Agregar `credentials: true` en CORS |
| 401 Unauthorized | JWT no se envía | Verificar que cookie-parser esté configurado |
| Juegos de otros usuarios | No validar usuarioId | Siempre filtrar por `usuarioId` |
| Password en respuesta | No excluir password | Usar `.select('-password')` |

---

**¡Éxito con la implementación del backend! 🎮🚀**
