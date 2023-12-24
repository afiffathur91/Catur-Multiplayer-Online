const mongoose = require('mongoose');
// Model User untuk menyimpan informasi pengguna
// Sesuaikan dengan schema yang diinginkan
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true
    },
    password: String,
    // tambahkan field lain jika diperlukan
  });
  
  // Menghasilkan model User dengan schema yang ada
  module.exports = mongoose.model('User', userSchema);
  