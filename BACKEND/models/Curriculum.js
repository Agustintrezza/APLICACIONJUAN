const mongoose = require('mongoose');

const CurriculumSchema = new mongoose.Schema({
  nombre: { type: String, required: true, minlength: 3 },
  apellido: { type: String, required: true, minlength: 2, index: true }, // Índice para búsquedas rápidas
  genero: { type: String, enum: ['Masculino', 'Femenino', ''], default: '' },
  edad: { type: Number, min: 18 },
  telefonoFijo: { type: String, default: '' },
  celular: { type: String, required: true, unique: true }, // Campo único para evitar duplicados
  email: { type: String, default: '' },
  pais: { type: String, default: 'Argentina', required: true },
  provincia: {
    type: String,
    default: '',
    validate: {
      validator: function (value) {
        return this.pais !== 'Argentina' || (value && value.trim().length > 0);
      },
      message: 'La provincia es obligatoria si el país es Argentina.',
    },
  },
  zona: { type: String, default: '' },
  localidad: { type: String, default: '' },
  ubicacionManual: { type: String, default: '' },
  calificacion: {
    type: String,
    enum: ['1- Muy bueno', '2- Bueno', '3- Regular'],
    required: true,
  },
  nivelEstudios: { type: String, default: '' },
  experiencia: { type: String, default: '' },
  idiomas: { type: [String], default: [] },
  imagen: { type: String, required: true },
  comentarios: { type: String, default: '' },
  listas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lista" }],
  rubro: { type: String, required: true },
  subrubro: {
    type: String,
    default: '',
    validate: {
      validator: function (value) {
        return this.rubro !== 'Gastronomía' || (value && value.trim().length > 0);
      },
      message: 'El subrubro es obligatorio para el rubro Gastronomía.',
    },
  },
  puesto: { type: String, required: true },
}, { timestamps: true, versionKey: false });

// Crear un índice compuesto para nombre y apellido (combinado, no único)
CurriculumSchema.index({ nombre: 1, apellido: 1 });

module.exports = mongoose.model("Curriculum", CurriculumSchema);
