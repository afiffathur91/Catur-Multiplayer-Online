// Import library yang diperlukan
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('../user');
const bodyParser = require('body-parser');

const http = require('http'),// Membuat server berbasis http dari aplikasi Express
      path = require('path'),
      express = require('express'),
      handlebars = require('express-handlebars'),
      socket = require('socket.io');// Mengimpor konfigurasi socket IO

const config = require('../config');

const myIo = require('./sockets/io'),
      routes = require('./routes/routes');// Mengimpor konfigurasi routes

const app = express(),
      server = http.Server(app),
      io = socket(server);

server.listen(config.port);

games = {};// Objek untuk menyimpan informasi game

myIo(io);
// Log bahwa server telah berhasil terhubung
console.log(`Server listening on port ${config.port}`);
// Konfigurasi handlebars sebagai view engine
const Handlebars = handlebars.create({
  extname: '.html', 
  partialsDir: path.join(__dirname, '..', 'front', 'views', 'partials'), 
  defaultLayout: false,
  helpers: {}
});
// Mengatur handlebars sebagai view engine untuk Express
app.engine('html', Handlebars.engine);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '..', 'front', 'views'));
app.use('/public', express.static(path.join(__dirname, '..', 'front', 'public')));

// Hubungkan ke database MongoDB
mongoose.connect('mongodb://localhost:27017/catur')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err))

// Tambahkan konfigurasi session
app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
// Tambahkan endpoint untuk handle registrasi
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login'); // Ganti dengan halaman login yang sesuai
  } catch (err) {
    res.send('Gagal melakukan registrasi. Username mungkin sudah digunakan.');
  }
});

// Tambahkan endpoint untuk login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.user = user; // Set session user
    res.redirect('/'); // Ganti dengan halaman utama yang sesuai
  } else {
    res.send('Username atau password salah');
  }
});

routes(app);