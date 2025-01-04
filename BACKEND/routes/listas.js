const express = require('express')
const Lista = require('../models/Lista')
const Curriculum = require('../models/Curriculum')

const router = express.Router()

// Ruta para obtener todas las listas
router.get('/', async (req, res) => {
  try {
    const listas = await Lista.find().populate('curriculums')
    res.status(200).json(listas)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las listas' })
  }
})

// Ruta para crear una nueva lista
router.post('/', async (req, res) => {
  try {
    const { cliente, comentario } = req.body

    console.log("Nueva solicitud de creación:", req.body)

    const listaExistente = await Lista.findOne({ cliente, comentario })
    if (listaExistente) {
      console.log("Error: La lista ya existe")
      return res.status(400).json({ success: false, error: "La lista ya existe" })
    }

    const nuevaLista = new Lista(req.body)
    const listaGuardada = await nuevaLista.save()

    console.log("Lista guardada exitosamente:", listaGuardada)
    res.status(201).json({ success: true, data: listaGuardada })
  } catch (error) {
    console.error("Error al guardar la lista:", error)
    res.status(500).json({ success: false, error: "Error interno del servidor" })
  }
})

// Ruta para actualizar una lista
router.put("/:id", async (req, res) => {
  console.log("Backend: Datos recibidos para actualizar:", req.body)
  try {
    const updatedLista = await Lista.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("curriculums")
    if (!updatedLista) {
      console.log("Backend: Lista no encontrada.")
      return res.status(404).json({ error: "Lista no encontrada" })
    }
    console.log("Backend: Lista actualizada correctamente:", updatedLista)
    res.status(200).json(updatedLista)
  } catch (error) {
    console.error("Backend: Error al actualizar la lista:", error)
    res.status(500).json({ error: "Error al actualizar la lista" })
  }
})


// Ruta para eliminar una lista
router.delete('/:id', async (req, res) => {
  try {
    const listaEliminada = await Lista.findByIdAndDelete(req.params.id)
    if (!listaEliminada) {
      return res.status(404).json({ error: 'Lista no encontrada' })
    }

    // Quitar la lista eliminada de los curriculums asociados
    await Curriculum.updateMany(
      { listas: listaEliminada._id },
      { $pull: { listas: listaEliminada._id } }
    )

    res.status(200).json({ message: 'Lista eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la lista' })
  }
})

// Ruta para obtener una lista específica por ID
router.get('/:id', async (req, res) => {
  try {
    const lista = await Lista.findById(req.params.id).populate('curriculums')
    if (!lista) {
      return res.status(404).json({ error: 'Lista no encontrada' })
    }
    res.status(200).json(lista)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista' })
  }
})

module.exports = router
