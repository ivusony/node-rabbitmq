const NET_MODULE = require('net');
const SERVER = NET_MODULE.createServer();



// SERVER.on('connection', function(SOCKET) {
//     // SOCKET.on('data', function() {
//     //     SOCKET.pipe(SOCKET);
//     //     SOCKET.end();
//     // })
// })


// SERVER.on(
//     'error',
//     err => {
//         throw err;
//     }
// );

SERVER.listen(
    9000,
    () => {
        console.log("Test server listening on port " + 9000);
    }
);
