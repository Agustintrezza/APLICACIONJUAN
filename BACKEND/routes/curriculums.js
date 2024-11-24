const express = require('express');
const Curriculum = require('../models/Curriculum');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const sanitize = require('mongo-sanitize');

const router = express.Router();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para crear un nuevo Curriculum
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const file = req.file;
    const { calificacion, ...otrosDatos } = req.body;

    if (!file) {
      return res.status(400).json({ error: "La imagen o archivo es obligatorio." });
    }

    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedFormats.includes(file.mimetype)) {
      return res.status(400).json({ error: "Formato de archivo no permitido. Solo JPG, JPEG, PNG y PDF." });
    }

    if (!['1- Muy bueno', '2- Bueno', '3- Regular'].includes(calificacion)) {
      return res.status(400).json({ error: "Calificación inválida." });
    }

    let uploadedFile;
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'curriculums' },
        (error, result) => {
          if (error) return reject(error);
          uploadedFile = result;
          resolve();
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    const sanitizedData = sanitize({ ...otrosDatos, calificacion });
    const newCurriculum = new Curriculum({
      ...sanitizedData,
      imagen: uploadedFile.secure_url,
    });

    const savedCurriculum = await newCurriculum.save();
    res.status(201).json({ message: "Curriculum creado exitosamente", curriculum: savedCurriculum });
  } catch (error) {
    res.status(500).json({ error: "Ocurrió un error al procesar la solicitud." });
  }
});

module.exports = router;
