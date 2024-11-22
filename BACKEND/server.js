const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware de CORS
app.use(cors({
  origin: 'http://localhost:5173', // Permite solicitudes desde el puerto 5173
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Agrega OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // Permite Content-Type y Authorization en las solicitudes
  exposedHeaders: ['Content-Length'], // Expone Content-Length para el frontend
}));

// Manejo explícito de solicitudes OPTIONS
app.options('*', cors()); // Responde a todas las solicitudes OPTIONS

// Middleware para analizar JSON con límite de tamaño
app.use(express.json({ limit: '10mb' })); // Permite hasta 10 MB en el cuerpo de la solicitud

// Conectar a MongoDB
connectDB();

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Running');
});

// Rutas de la aplicación
app.use('/api/auth', require('./routes/auth'));
app.use('/api/curriculums', require('./routes/curriculums'));

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
