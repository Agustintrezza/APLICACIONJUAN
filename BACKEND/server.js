const express = require('express');
const path = require('path'); // Importar path para manejar rutas de archivos
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware de CORS
const allowedOrigins = [
  'http://localhost:5173', // Dominio para desarrollo
  'https://aplicacionjuan-1.onrender.com', // Dominio del frontend en producción
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Permitir el acceso
    } else {
      callback(new Error('Not allowed by CORS')); // Bloquear otros orígenes
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware para analizar JSON
app.use(express.json({ limit: '10mb' }));

// Conectar a MongoDB
connectDB();

// Rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/curriculums', require('./routes/curriculums'));
app.use('/api/listas', require('./routes/listas'));

// Servir el frontend en producción
const __dirname = path.resolve(); // Obtener el directorio raíz
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'dist'))); // Servir los archivos estáticos del frontend

  // Redirigir todas las rutas desconocidas al index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// Ruta de prueba (puede eliminarse si no es necesaria)
app.get('/', (req, res) => {
  res.send('API Running');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
