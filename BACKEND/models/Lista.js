const mongoose = require('mongoose')

const ListaSchema = new mongoose.Schema({
  cliente: { 
    type: String, 
    required: [true, "El campo 'cliente' es obligatorio"], 
    unique: true // Evita duplicados
  },
  comentario: { type: String, default: "" },
  fechaDeCreacion: { type: Date, default: Date.now },
  curriculums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Curriculum" }],
  color: { 
    type: String, 
    default: "#FFFFFF",
    validate: {
      validator: function (v) {
        return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(v)
      },
      message: props => `${props.value} no es un color válido en formato hexadecimal`
    }
  },
  rubro: { type: String, default: "" },
  puesto: { type: String, default: "" },
  subrubro: { type: String, default: "" },
})

module.exports = mongoose.model("Lista", ListaSchema)
