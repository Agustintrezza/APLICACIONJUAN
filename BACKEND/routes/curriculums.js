const express = require('express');
const Curriculum = require('../models/Curriculum');
const multer = require('multer'); // Manejar archivos
const router = express.Router();

// Configuración de multer para manejar la imagen
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', async (req, res) => {
    try {
      console.log('Request Body:', req.body);
  
      const { imagen, ...otrosDatos } = req.body;
  
      if (!imagen) {
        return res.status(400).json({ error: 'La imagen o archivo es requerido' });
      }
  
      // Validar formato de la imagen
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const mimeType = imagen.split(';')[0].split(':')[1];
      if (!allowedFormats.includes(mimeType)) {
        return res.status(400).json({
          error: 'Formato de archivo no permitido. Solo se permiten PDF, JPG y PNG.',
        });
      }
  
      const newCurriculum = new Curriculum({
        ...otrosDatos,
        imagen, // Guarda la imagen como base64
      });
  
      const savedCurriculum = await newCurriculum.save();
  
      res.status(201).json({
        message: 'Curriculum creado exitosamente',
        curriculum: savedCurriculum,
      });
    } catch (error) {
      console.error('Error en el servidor:', error.message);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
  });

module.exports = router;
