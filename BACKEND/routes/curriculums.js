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

// Validar duplicados
router.post('/validate', async (req, res) => {
  const { apellido, celular } = req.body

  try {
    if (apellido) {
      const duplicateByLastName = await Curriculum.findOne({ apellido })
      if (duplicateByLastName) {
        return res.status(400).json({ error: 'Duplicado', duplicadoEn: 'apellido' })
      }
    }

    if (celular) {
      const duplicateByPhone = await Curriculum.findOne({ celular })
      if (duplicateByPhone) {
        return res.status(400).json({ error: 'Duplicado', duplicadoEn: 'celular' })
      }
    }

    res.status(200).json({ message: 'No hay duplicados.' })
  } catch (error) {
    console.error('Error al validar duplicados:', error)
    res.status(500).json({ error: 'Error al validar duplicados.' })
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
    const { apellido, celular, pais, provincia, calificacion, lista, ...otrosDatos } = req.body

    // Validación: Duplicados por apellido o celular
    const existingCv = await Curriculum.findOne({
      $or: [{ apellido }, { celular }],
    })

    if (existingCv) {
      if (existingCv.apellido === apellido) {
        return res.status(400).json({ error: 'Ya existe un candidato con el mismo apellido.' })
      }
      if (existingCv.celular === celular) {
        return res.status(400).json({ error: 'Ya existe un candidato con el mismo número de teléfono celular.' })
      }
    }

    // Validación de lógica: Provincia requerida para Argentina
    if (pais === 'Argentina' && (!provincia || provincia.trim() === '')) {
      return res.status(400).json({ error: 'La provincia es obligatoria para Argentina.' })
    }

    // Validación del archivo
    if (!file) {
      return res.status(400).json({ error: 'La imagen o archivo es obligatorio.' })
    }

    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedFormats.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Formato de archivo no permitido.' })
    }

    // Subir el archivo a Cloudinary
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

    // Validar y sanitizar los datos
    const sanitizedData = sanitize({ apellido, celular, ...otrosDatos, pais, provincia, calificacion })

    // Validar que el ID de la lista sea válido si está presente
    if (lista && !mongoose.Types.ObjectId.isValid(lista)) {
      return res.status(400).json({ error: 'El ID de la lista no es válido.' })
    }

    // Crear el nuevo curriculum
    const newCurriculum = new Curriculum({
      ...sanitizedData,
      imagen: uploadedFile.secure_url,
    })

    // Si se especifica una lista, asociar el curriculum a esa lista
    if (lista) {
      const listaExistente = await Lista.findById(lista)
      if (!listaExistente) {
        return res.status(404).json({ error: 'La lista seleccionada no existe.' })
      }

      // Agregar el ID del curriculum a la lista
      listaExistente.curriculums.push(newCurriculum._id)
      await listaExistente.save()

      // Agregar el ID de la lista al curriculum
      newCurriculum.listas.push(listaExistente._id)
    }

    // Guardar el curriculum con la información de las listas
    const savedCurriculum = await newCurriculum.save()

    res.status(201).json({ message: 'Curriculum creado exitosamente', curriculum: savedCurriculum })
  } catch (error) {
    console.error('Error al crear el currículum:', error)
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' })
  }
})

// Actualizar un curriculum
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params
  const updates = sanitize(req.body)

  try {
    if (updates.listas) {
      if (!Array.isArray(updates.listas)) {
        updates.listas = updates.listas.split(',').map((id) => id.trim())
      }

      // Validar que todos los IDs son válidos
      updates.listas = updates.listas.filter((listId) => mongoose.Types.ObjectId.isValid(listId))

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

    if (!Array.isArray(listIds)) {
      return res.status(400).json({ error: 'listIds debe ser un arreglo.' })
    }

    const validIds = listIds.filter((listId) => mongoose.Types.ObjectId.isValid(listId))
    if (validIds.length !== listIds.length) {
      return res.status(400).json({ error: 'Uno o más IDs no son válidos.' })
    }

    const objectIds = validIds.map((id) => new mongoose.Types.ObjectId(id))

    const validLists = await Lista.find({ _id: { $in: objectIds } })
    if (validLists.length !== objectIds.length) {
      return res.status(404).json({ error: 'Una o más listas no existen' })
    }

    curriculum.listas = objectIds
    await curriculum.save()

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
