const express = require('express')
const path = require('path') // Importar path para manejar rutas de archivos
const connectDB = require('./config/db')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware de CORS
const allowedOrigins = [
  'http://localhost:5173', // Dominio para desarrollo
  'https://aplicacionjuan-1.onrender.com', // Dominio del frontend en producción
]

const corsOptions = {
  origin: (origin, callback) => {
    console.log(`[CORS] Origin: ${origin || 'undefined (no origin)'}`)
    // Permitir si el origen es nulo (undefined) o si está en la lista de orígenes permitidos
    if (!origin || allowedOrigins.includes(origin) || origin === 'null') {
      console.log(`CORS allowed for origin: ${origin || 'undefined (no origin)'}`)
      callback(null, true) // Permitir el acceso
    } else {
      console.log(`CORS denied for origin: ${origin}`)
      callback(new Error('Not allowed by CORS')) // Bloquear otros orígenes
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))

// Middleware para analizar JSON
app.use(express.json({ limit: '10mb' }))

// Conectar a MongoDb
connectDB()

// Rutas de la API
app.use('/api/auth', require('./routes/auth'))
app.use('/api/curriculums', require('./routes/curriculums'))
app.use('/api/listas', require('./routes/listas'))

// Middleware para servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../FRONTEND', 'dist')
  console.log(`[DEBUG] Serving static files from: ${staticPath}`)

  app.use(express.static(staticPath, {
    setHeaders: (res, filePath) => {
      console.log(`[DEBUG] Serving static file: ${filePath}`)
    }
  }))

  // Redirigir todas las rutas desconocidas al index.html
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../FRONTEND', 'dist', 'index.html');
    console.log(`[DEBUG] Redirigiendo a index.html para la ruta: ${req.originalUrl}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`[ERROR] No se pudo servir index.html: ${err.message}`);
        res.status(500).send('Error al servir la aplicación');
      }
    });
  });
} else {
  // En modo desarrollo, podemos agregar más logs sobre el servidor
  console.log('[DEBUG] En modo desarrollo, sirviendo archivos desde /public')
  app.use(express.static(path.join(__dirname, 'public')))
}

// Ruta de prueba (opcional)
app.get('/', (req, res) => {
  console.log('[DEBUG] API root route accessed')
  res.send('API Running')
})

// Ruta para obtener curriculums
app.get('/api/curriculums/:id', (req, res) => {
  console.log(`[DEBUG] Solicitud GET a /api/curriculums/${req.params.id}`)
  // Aquí va la lógica para manejar la solicitud
})

// Ruta para obtener listas
app.get('/api/listas/:id', (req, res) => {
  console.log(`[DEBUG] Solicitud GET a /api/listas/${req.params.id}`)
  // Aquí va la lógica para manejar la solicitud
})

// Iniciar el servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`[DEBUG] Server running on port ${PORT}`)
});
