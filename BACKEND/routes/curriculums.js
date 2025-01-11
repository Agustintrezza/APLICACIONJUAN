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
    const {
      pais,
      provincia,
      localidad,
      calificacion,
      nivelEstudios,
      experiencia,
      genero,
      edad,
      idiomas,
      lista,
    } = req.query;

    // Construir la consulta dinámica
    const query = {};

    if (pais) query.pais = pais;
    if (provincia) query.provincia = provincia;
    if (localidad) query.localidad = localidad;
    if (calificacion) query.calificacion = calificacion;
    if (nivelEstudios) query.nivelEstudios = nivelEstudios;
    if (experiencia) query.experiencia = experiencia;
    if (genero) query.genero = genero;
    if (edad) query.edad = { $gte: parseInt(edad, 10) }; // Edad mínima
    if (idiomas) {
      const idiomasArray = Array.isArray(idiomas) ? idiomas : idiomas.split(',');
      query.idiomas = { $in: idiomasArray }; // Filtro por coincidencia en el array
    }

    // Filtro por lista
    if (lista) {
      const listasArray = lista.split(',').filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (listasArray.length > 0) {
        query.listas = { $in: listasArray };
      }
    }

    if (idiomas) {
      const idiomasArray = Array.isArray(idiomas) ? idiomas : [idiomas];
      query.idiomas = { $in: idiomasArray }; // Buscar currículums que contengan cualquiera de los idiomas
    }

    // Ejecutar la consulta
    const curriculums = await Curriculum.find(query).populate('listas');
    res.status(200).json(curriculums);
  } catch (error) {
    console.error('Error al obtener currículums:', error);
    res.status(500).json({ error: 'Error al obtener currículums.' });
  }
});

// Crear un nuevo curriculum
router.post('/', upload.single('imagen'), async (req, res) => {
  console.log('Body recibido:', req.body);
console.log('Archivo recibido:', req.file);

  try {
    const file = req.file;
    const { idiomas, apellido, celular, pais, provincia, calificacion, lista, ...otrosDatos } = req.body;

    // Validación de idiomas: Convertir siempre a un array
    const parsedIdiomas = Array.isArray(idiomas)
      ? idiomas
      : (idiomas ? idiomas.split(',').map((idioma) => idioma.trim()) : []);

    // Validación: Duplicados por apellido o celular
    const existingCv = await Curriculum.findOne({
      $or: [{ celular }],
    });

    if (existingCv) {
      if (existingCv.celular === celular) {
        return res.status(400).json({ error: 'Ya existe un candidato con el mismo número de teléfono celular.' });
      }
    }

    // Validación de lógica: Provincia requerida para Argentina
    if (pais === 'Argentina' && (!provincia || provincia.trim() === '')) {
      return res.status(400).json({ error: 'La provincia es obligatoria para Argentina.' });
    }

    // Validación del archivo
    if (!file) {
      return res.status(400).json({ error: 'La imagen o archivo es obligatorio.' });
    }

    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedFormats.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Formato de archivo no permitido.' });
    }

    // Subir el archivo a Cloudinary
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

    // Validar y sanitizar los datos
    const sanitizedData = sanitize({ apellido, celular, ...otrosDatos, pais, provincia, calificacion });
    console.log('Datos sanitizados:', sanitizedData);

    // Crear el nuevo curriculum
    const newCurriculum = new Curriculum({
      ...sanitizedData,
      idiomas: parsedIdiomas, // Asegurarse de que idiomas sea un array
      imagen: uploadedFile.secure_url,
    });

    // Si se especifica una lista, asociar el curriculum a esa lista
    if (lista) {
      const listaExistente = await Lista.findById(lista);
      if (!listaExistente) {
        return res.status(404).json({ error: 'La lista seleccionada no existe.' });
      }

      listaExistente.curriculums.push(newCurriculum._id);
      await listaExistente.save();
      newCurriculum.listas.push(listaExistente._id);
    }

    // Guardar el curriculum con la información de las listas
    const savedCurriculum = await newCurriculum.save();
    if (!savedCurriculum) {
      throw new Error('Error al guardar el currículum.');
    }

    res.status(201).json({ message: 'Curriculum creado exitosamente', curriculum: savedCurriculum });
  } catch (error) {
    console.error('Error al crear el currículum:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
  }
});

// Validar duplicados (con exclusión de ID actual en edición)
router.post('/validate', async (req, res) => {
  const { apellido, celular, excludeId } = req.body;

  try {
    const query = {};
    if (apellido) {
      query.apellido = apellido;
    }
    if (celular) {
      query.celular = celular;
    }

    if (excludeId) {
      query._id = { $ne: excludeId }; // Excluir el ID actual
    }

    const duplicate = await Curriculum.findOne(query);

    if (duplicate) {
      const duplicadoEn = duplicate.apellido === apellido ? 'apellido' : 'celular';
      return res.status(400).json({ error: 'Duplicado', duplicadoEn });
    }

    res.status(200).json({ message: 'No hay duplicados.' });
  } catch (error) {
    console.error('Error al validar duplicados:', error);
    res.status(500).json({ error: 'Error al validar duplicados.' });
  }
});


// Obtener un curriculum por ID
router.get('/:id', async (req, res) => {
  // console.log("Solicitud recibida para ID:", req.params.id);
  try {
    const curriculum = await Curriculum.findById(req.params.id).populate('listas');
    if (!curriculum) {
      return res.status(404).json({ error: 'Curriculum no encontrado' });
    }
    res.status(200).json(curriculum);
  } catch (error) {
    console.error("Error al obtener el curriculum:", error);
    res.status(500).json({ error: 'Error al obtener el currículum.' });
  }
});

// Crear un nuevo curriculum
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const file = req.file;
    const { idiomas, apellido, celular, pais, provincia, calificacion, lista, ...otrosDatos } = req.body;

    // Validar y limpiar el campo idiomas
    const parsedIdiomas = Array.isArray(idiomas)
      ? idiomas.filter((idioma) => typeof idioma === "string").map((idioma) => idioma.trim())
      : idiomas
      ? idiomas.split(',').map((idioma) => idioma.trim())
      : [];

    // Validación de duplicados
    const existingCv = await Curriculum.findOne({
      $or: [{ apellido }, { celular }],
    });

    if (existingCv) {
      if (existingCv.apellido === apellido) {
        return res.status(400).json({ error: 'Ya existe un candidato con el mismo apellido.' });
      }
      if (existingCv.celular === celular) {
        return res.status(400).json({ error: 'Ya existe un candidato con el mismo número de teléfono celular.' });
      }
    }

    // Validación de provincia
    if (pais === 'Argentina' && (!provincia || provincia.trim() === '')) {
      return res.status(400).json({ error: 'La provincia es obligatoria para Argentina.' });
    }

    // Validación del archivo
    if (!file) {
      return res.status(400).json({ error: 'La imagen o archivo es obligatorio.' });
    }

    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedFormats.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Formato de archivo no permitido.' });
    }

    // Subir el archivo a Cloudinary
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

    // Crear el nuevo currículum
    const newCurriculum = new Curriculum({
      ...sanitize({ apellido, celular, ...otrosDatos, pais, provincia, calificacion }),
      idiomas: parsedIdiomas,
      imagen: uploadedFile.secure_url,
    });

    // Manejar listas asociadas
    if (lista) {
      const listaExistente = await Lista.findById(lista);
      if (!listaExistente) {
        return res.status(404).json({ error: 'La lista seleccionada no existe.' });
      }
      listaExistente.curriculums.push(newCurriculum._id);
      await listaExistente.save();
      newCurriculum.listas.push(listaExistente._id);
    }

    const savedCurriculum = await newCurriculum.save();
    res.status(201).json({ message: 'Currículum creado exitosamente', curriculum: savedCurriculum });
  } catch (error) {
    console.error('Error al crear el currículum:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
  }
});


// Actualizar un curriculum
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  let updates = sanitize(req.body);

  try {
    console.log("Actualizando currículum con ID:", id);
    console.log("Datos de actualización recibidos:", updates);

    // Manejar campo `idiomas`
    if (updates.idiomas) {
      updates.idiomas = Array.isArray(updates.idiomas)
        ? updates.idiomas.filter((idioma) => typeof idioma === "string").map((idioma) => idioma.trim())
        : updates.idiomas
        ? updates.idiomas.split(',').map((idioma) => idioma.trim())
        : [];
    }

    // Manejar campo `listas`
    if (updates.listas) {
      updates.listas = Array.isArray(updates.listas)
        ? updates.listas.filter((listId) => mongoose.Types.ObjectId.isValid(listId))
        : updates.listas.split(',').filter((listId) => mongoose.Types.ObjectId.isValid(listId));

      if (updates.listas.length === 0) {
        delete updates.listas;
      }
    }

    // Subir imagen si está presente, de lo contrario, conservar la existente
    if (req.file) {
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
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      updates.imagen = uploadedFile.secure_url;
      console.log("Nueva imagen cargada:", updates.imagen);
    } else if (!updates.imagen) {
      // Si no se envió un nuevo archivo ni una referencia a la imagen actual, conservar la existente
      const existingCv = await Curriculum.findById(id);
      if (existingCv) {
        updates.imagen = existingCv.imagen;
        console.log("Conservando imagen existente:", updates.imagen);
      } else {
        return res.status(404).json({ error: 'Currículum no encontrado' });
      }
    }

    const updatedCv = await Curriculum.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCv) {
      return res.status(404).json({ error: 'Currículum no encontrado' });
    }

    res.status(200).json(updatedCv);
  } catch (error) {
    console.error('Error al actualizar el currículum:', error);
    res.status(500).json({ error: 'Error al actualizar el currículum.' });
  }
});





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
router.put('/:id/no-llamar', async (req, res) => {
  try {
    const { id } = req.params
    let { noLlamar } = req.body

    // Convertir el valor a booleano si es válido
    if (noLlamar === "") {
      noLlamar = undefined // Remover el campo si está vacío
    } else {
      noLlamar = noLlamar === "true" || noLlamar === true // Asegurar que sea un booleano
    }

    const updatedCv = await Curriculum.findByIdAndUpdate(
      id,
      { noLlamar },
      { new: true, runValidators: true }
    )

    if (!updatedCv) {
      return res.status(404).json({ error: 'Curriculum no encontrado' })
    }

    res.status(200).json(updatedCv)
  } catch (error) {
    console.error('Error al actualizar el estado de No Llamar:', error)
    res.status(500).json({ error: 'Error al actualizar el estado de No Llamar' })
  }
})

module.exports = router
