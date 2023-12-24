
// Menghasilkan fungsi socket.io untuk menangani koneksi dan event
module.exports = io => {
    io.on('connection', socket => {
        console.log('New socket connection'); // Menambahkan log saat koneksi socket baru

        let currentCode = null;// Variabel untuk menyimpan kode saat game

        socket.on('move', function(move) {// Fungsi yang menangani perintah 'move' dari socket
            console.log('move detected')// Menambahkan log saat perintah 'move' diima

            io.to(currentCode).emit('newMove', move);
        });
        // Fungsi yang menangani perintah 'joinGame' dari socket
        socket.on('joinGame', function(data) {
            // Menyimpan kode ke variabel currentCode
            currentCode = data.code;
            socket.join(currentCode);
            if (!games[currentCode]) {
                games[currentCode] = true;
                return;
            }
            
            io.to(currentCode).emit('startGame');// Mengirimkan perintah 'startGame' ke socket yang terhubung
        });
        
        socket.on('disconnect', function() {
            console.log('socket disconnected');// Fungsi yang menangani perintah 'disconnect' dari socket

            if (currentCode) {
                io.to(currentCode).emit('gameOverDisconnect');
                delete games[currentCode];
            }
        });

    });
};