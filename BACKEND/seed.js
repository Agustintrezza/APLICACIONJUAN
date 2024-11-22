// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedUser = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
  });

  const hashedPassword = await bcrypt.hash('1234', 10); // encripta la contraseña para almacenarla

  const user = new User({
    name: 'Usuario de prueba',
    email: 'user@user.com',
    password: hashedPassword,
  });

  await user.save();
  console.log('Usuario mock creado');
  mongoose.connection.close();
};

seedUser().catch((err) => console.error(err));
