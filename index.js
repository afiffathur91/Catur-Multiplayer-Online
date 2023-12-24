require('dotenv').config();//menyimpan konfigurasi atau variabel lingkungan sensitif di luar kode
//untuk memulai server Anda dan menjalankan aplikasi Anda
const path = require('path');
require(path.join(__dirname, 'server', 'server.js'));