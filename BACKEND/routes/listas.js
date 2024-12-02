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
    const nuevaLista = new Lista(req.body)
    const listaGuardada = await nuevaLista.save()
    res.status(201).json(listaGuardada)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la lista' })
  }
})

// Ruta para actualizar una lista
router.put('/:id', async (req, res) => {
  try {
    const listaActualizada = await Lista.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('curriculums')
    res.status(200).json(listaActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la lista' })
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

module.exports = router
