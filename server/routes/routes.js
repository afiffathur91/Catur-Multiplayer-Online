module.exports = app => {

// Definisikan endpoint untuk halaman utama
    app.get('/', (req, res) => {
        if (req.session.user) {
          res.render('index');
        } else {
          res.redirect('/register');
        }
      });
      // Definisikan endpoint untuk halaman Register
      app.get('/register', (req, res) => {
        res.render('register'); // Ganti dengan nama file view registrasi yang sesuai
      });

// Definisikan endpoint untuk halaman login
      app.get('/login', (req, res) => {
        res.render('login');
      });
// Definisikan endpoint untuk halaman game
    app.get('/white', (req, res) => {
        res.render('game', {
            color: 'white'
        });
    });
    app.get('/black', (req, res) => {
        if (!games[req.query.code]) {
            return res.redirect('/?error=invalidCode');
        }

        res.render('game', {
            color: 'black'
        });
    });
};