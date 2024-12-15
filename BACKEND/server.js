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
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`CORS allowed for origin: ${origin}`)
      callback(null, true) // Permitir el acceso
    } else {
      console.log(`CORS blocked for origin: ${origin}`)
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
  console.log(`Serving static files from: ${staticPath}`)

  app.use(express.static(staticPath)) // Servir los archivos estáticos del frontend

  // Redirigir todas las rutas desconocidas al index.html
  app.get('*', (req, res) => {
    console.log(`Request for: ${req.originalUrl}`)
    const indexPath = path.join(__dirname, '../FRONTEND', 'dist', 'index.html')
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`Error serving index.html: ${err.message}`)
        res.status(500).send('Error serving the application')
      }
    })
  })
}

// Ruta de prueba (opcional)
app.get('/', (req, res) => {
  console.log('API root route accessed')
  res.send('API Running')
})

// Iniciar el servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
