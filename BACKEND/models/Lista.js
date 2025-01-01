const mongoose = require('mongoose')

const ListaSchema = new mongoose.Schema(
  {
    cliente: { type: String, required: true },
    comentario: { type: String },
    fechaLimite: { type: Date },
    fechaDeCreacion: { type: Date, default: Date.now },
    curriculums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Curriculum" }],
    color: { type: String, default: "#FFFFFF" },
    rubro: { type: String },
    puesto: { type: String },
    subrubro: { type: String },
  },
  { versionKey: false }
)

module.exports = mongoose.model("Lista", ListaSchema)
