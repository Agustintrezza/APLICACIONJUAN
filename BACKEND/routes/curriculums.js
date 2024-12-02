const express = require('express')
const Curriculum = require('../models/Curriculum')
const Lista = require('../models/Lista')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const sanitize = require('mongo-sanitize')
const mongoose = require('mongoose')

const router = express.Router()

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configuración de Multer
const storage = multer.memoryStorage()
const upload = multer({ storage })

// ====================
// Rutas de Curriculums
// ====================

// Obtener todos los curriculums
router.get('/', async (req, res) => {
  try {
    const curriculums = await Curriculum.find().populate('listas').sort({ createdAt: -1 })
    res.status(200).json(curriculums)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los currículums.' })
  }
})

// Obtener un curriculum por ID
router.get('/:id', async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id).populate('listas')
    if (!curriculum) {
      return res.status(404).json({ error: 'Curriculum no encontrado' })
    }
    res.status(200).json(curriculum)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el currículum.' })
  }
})

// Crear un nuevo curriculum
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const file = req.file
    const { calificacion, ...otrosDatos } = req.body

    if (!file) {
      return res.status(400).json({ error: 'La imagen o archivo es obligatorio.' })
    }

    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedFormats.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Formato de archivo no permitido.' })
    }

    let uploadedFile
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'curriculums' },
        (error, result) => {
          if (error) return reject(error)
          uploadedFile = result
          resolve()
        }
      )
      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })

    const sanitizedData = sanitize({ ...otrosDatos, calificacion })
    const newCurriculum = new Curriculum({
      ...sanitizedData,
      imagen: uploadedFile.secure_url,
    })

    const savedCurriculum = await newCurriculum.save()
    res.status(201).json({ message: 'Curriculum creado exitosamente', curriculum: savedCurriculum })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' })
  }
})

// Actualizar un curriculum
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params
  const updates = sanitize(req.body)

  console.log('Datos recibidos para actualización:', updates) // Log para depuración

  try {
    if (updates.listas) {
      console.log('Tipo de listas antes de procesar:', typeof updates.listas, updates.listas)
    
      if (!Array.isArray(updates.listas)) {
        // Convertir a un arreglo si es una cadena
        updates.listas = Array.isArray(updates.listas)
          ? updates.listas
          : updates.listas.split(',').map((id) => id.trim())
      }
    
      // Validar que todos los IDs son válidos
      updates.listas = updates.listas.filter((listId) =>
        mongoose.Types.ObjectId.isValid(listId)
      )
    
      if (updates.listas.length === 0) {
        return res.status(400).json({ error: 'El campo listas contiene elementos inválidos.' })
      }
    }

    if (req.file) {
      let uploadedFile
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'curriculums' },
          (error, result) => {
            if (error) return reject(error)
            uploadedFile = result
            resolve()
          }
        )
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream)
      })
      updates.imagen = uploadedFile.secure_url
    }

    const updatedCv = await Curriculum.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!updatedCv) {
      return res.status(404).json({ error: 'Curriculum no encontrado' })
    }

    res.status(200).json(updatedCv)
  } catch (error) {
    console.error('Error al actualizar el currículum:', error)
    res.status(500).json({ error: 'Error al actualizar el currículum.' })
  }
})

// Asignar listas a un curriculum
router.post('/:id/assign', async (req, res) => {
  const { id } = req.params
  const { listIds } = req.body

  try {
    const curriculum = await Curriculum.findById(id)
    if (!curriculum) {
      return res.status(404).json({ error: 'Curriculum no encontrado' })
    }

    // Validar y limpiar los IDs
    if (!Array.isArray(listIds)) {
      return res.status(400).json({ error: 'listIds debe ser un arreglo.' })
    }

    const validIds = listIds.filter(
      (listId) => mongoose.Types.ObjectId.isValid(listId)
    )
    if (validIds.length !== listIds.length) {
      return res.status(400).json({ error: 'Uno o más IDs no son válidos.' })
    }

    const objectIds = validIds.map((id) => new mongoose.Types.ObjectId(id))

    // Validar que todas las listas existen
    const validLists = await Lista.find({ _id: { $in: objectIds } })
    if (validLists.length !== objectIds.length) {
      return res.status(404).json({ error: 'Una o más listas no existen' })
    }

    // Actualizar el curriculum
    curriculum.listas = objectIds
    await curriculum.save()

    // Asegurarse de que el curriculum esté presente en las listas
    await Promise.all(
      validLists.map(async (lista) => {
        if (!lista.curriculums.includes(curriculum._id)) {
          lista.curriculums.push(curriculum._id)
          await lista.save()
        }
      })
    )

    res.status(200).json({ message: 'Curriculum actualizado correctamente' })
  } catch (error) {
    console.error('Error al asignar el curriculum a las listas:', error)
    res.status(500).json({ error: 'Error al asignar el curriculum a las listas' })
  }
})

// Eliminar un curriculum
router.delete('/:id', async (req, res) => {
  try {
    const deletedCv = await Curriculum.findByIdAndDelete(req.params.id)
    if (!deletedCv) {
      return res.status(404).json({ error: 'Curriculum no encontrado' })
    }
    await Lista.updateMany(
      { curriculums: deletedCv._id },
      { $pull: { curriculums: deletedCv._id } }
    )
    res.json({ message: 'Curriculum eliminado correctamente.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar el currículum.' })
  }
})

module.exports = router
