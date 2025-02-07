const express = require('express');
const path = require('path'); // Importar path para manejar rutas de archivos
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware de CORS
const allowedOrigins = [
  'http://localhost:5173', // Dominio para desarrollo
  'https://aplicacionjuan-1-o797.onrender.com', // Dominio para desarrollo
  'https://aplicacionjuan-1.onrender.com',  // Dominio del frontend en producción
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (por ejemplo, desde herramientas como Postman)
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

// Middleware para servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../FRONTEND', 'dist');
  console.log(`Serving static files from: ${staticPath}`);

  // Servir archivos estáticos (como index.html, JS, CSS, etc.)
  app.use(express.static(staticPath));

  // Redirigir todas las rutas desconocidas al index.html para manejar rutas SPA
  app.get('*', (req, res) => {
    console.log(`Redirecting request for unknown route: ${req.originalUrl}`);
    res.sendFile(path.join(staticPath, 'index.html'), (err) => {
      if (err) {
        console.error(`[ERROR] No se pudo servir index.html: ${err.message}`);
        res.status(500).send('Error al servir la aplicación');
      }
    });
  });
}

// Ruta de prueba (opcional)
app.get('/', (req, res) => {
  console.log('API root route accessed');
  res.send('API Running');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
