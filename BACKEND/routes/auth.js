// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca al usuario por su email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Genera un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

module.exports = router;
