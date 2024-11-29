const express = require('express');
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
