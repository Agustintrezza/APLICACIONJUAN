const mongoose = require('mongoose');

const CurriculumSchema = new mongoose.Schema({
  nombre: { type: String, required: true, minlength: 3 },
  apellido: { type: String, required: true, minlength: 2 },
  genero: { type: String, enum: ['Masculino', 'Femenino', ''], default: '' },
  edad: { type: Number, min: 18 },
  telefonoFijo: { type: String, default: '' },
  celular: { type: String, required: true },
  email: { type: String, default: '' },
  pais: { type: String, default: 'Argentina', required: true },
  provincia: { type: String, default: 'Buenos Aires', required: true },
  zona: { type: String, default: '' },
  localidad: { type: String, default: '' },
  ubicacionManual: { type: String, default: '' },
  calificacion: { 
    type: String, 
    enum: ['1- Muy bueno', '2- Bueno', '3- Regular'], 
    required: true 
  },
  nivelEstudios: { type: String, default: '' },
  experiencia: { type: String, default: '' },
  idiomas: { type: [String], default: [] },
  imagen: { type: String, required: true }, // URL de la imagen en Cloudinary
  comentarios: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Curriculum', CurriculumSchema);
