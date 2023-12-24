// Inisialisasi variabel untuk memantau apakah permainan sudah dimulai, papan catur, dan objek permainan catur
let gameHasStarted = false;
var board = null
var game = new Chess()

// Inisialisasi variabel untuk memantau status permainan dan riwayat permainan
var $status = $('#status')
var $pgn = $('#pgn')

// Inisialisasi variabel untuk memantau apakah permainan sudah berakhir
let gameOver = false;

// Fungsi yang dipanggil saat pemain memulai menarik bidak
function onDragStart (source, piece, position, orientation) {
    // Tidak memungkinkan pemain menarik bidak jika permainan sudah berakhir
    if (game.game_over()) return false
    if (!gameHasStarted) return false;
    if (gameOver) return false;

    // Memastikan pemain hanya dapat menarik bidak sesuai gilirannya
    if ((playerColor === 'black' && piece.search(/^w/) !== -1) || (playerColor === 'white' && piece.search(/^b/) !== -1)) {
        return false;
    }

    // Hanya memungkinkan pemain menarik bidak sesuai gilirannya
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

// Fungsi yang dipanggil saat pemain meletakkan bidak
function onDrop (source, target) {
    let theMove = {
        from: source,
        to: target,
        promotion: 'q' // Selalu promosi ke ratu untuk kesederhanaan
    };
    // Memeriksa apakah langkah yang diinginkan sah
    var move = game.move(theMove);

    // Jika langkah tidak sah, kembalikan bidak ke posisi semula
    if (move === null) return 'snapback'

    // Mengirimkan langkah ke lawan melalui socket
    socket.emit('move', theMove);

    // Memperbarui status permainan
    updateStatus()
}

// Fungsi yang dipanggil saat lawan melakukan langkah baru
socket.on('newMove', function(move) {
    game.move(move);
    board.position(game.fen());
    updateStatus();
});

// Fungsi yang dipanggil saat pemain menyelesaikan menarik bidak
function onSnapEnd () {
    board.position(game.fen())
}

// Fungsi untuk memperbarui status permainan
function updateStatus () {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // Memeriksa apakah permainan sudah berakhir
    if (game.in_checkmate()) {
        status = 'Permainan berakhir, ' + moveColor + ' dalam skakmat.'
    }

    // Memeriksa apakah permainan berakhir seri
    else if (game.in_draw()) {
        status = 'Permainan berakhir seri'
    }

    // Memeriksa apakah lawan sudah keluar dari permainan
    else if (gameOver) {
        status = 'Lawan keluar dari permainan, Anda menang!'
    }

    // Memeriksa apakah permainan belum dimulai
    else if (!gameHasStarted) {
        status = 'Menunggu lawan untuk bergabung'
    }

    // Jika permainan masih berlangsung
    else {
        status = moveColor + ' untuk bergerak'

        // Memeriksa apakah ada skak
        if (game.in_check()) {
            status += ', ' + moveColor + ' dalam skak'
        }
        
    }

    $status.html(status)
    $pgn.html(game.pgn())
}

// Konfigurasi papan catur
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: '/public/img/chesspieces/wikipedia/{piece}.png'
}
board = Chessboard('myBoard', config)

// Jika pemain berwarna hitam, membalikkan papan catur
if (playerColor == 'black') {
    board.flip();
}

// Memperbarui status permainan
updateStatus()

// Memeriksa apakah terdapat parameter kode pada URL, jika ada maka pemain akan bergabung ke permainan
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('code')) {
    socket.emit('joinGame', {
        code: urlParams.get('code')
    });
}

// Fungsi yang dipanggil saat lawan sudah siap untuk memulai permainan
socket.on('startGame', function() {
    gameHasStarted = true;
    updateStatus()
});

// Fungsi yang dipanggil saat lawan keluar dari permainan
socket.on('gameOverDisconnect', function() {
    gameOver = true;
    updateStatus()
});