const mongoose = require('mongoose'); // Agregar esta línea

const ListaSchema = new mongoose.Schema({
  posicion: { type: String, required: true },
  cliente: { type: String, required: true },
  comentario: { type: String },
  fechaLimite: { type: Date },
  fechaDeCreacion: { type: Date, default: Date.now },
  curriculums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Curriculum" }],
  color: { type: String, default: "#FFFFFF" },
}, { versionKey: false });

module.exports = mongoose.model("Lista", ListaSchema);
