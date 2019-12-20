const   NET_MODULE  = require('net');
const   PORT        = 9000;
const   CRC         = require('crc');
const   SEND_TO_EXCHANGE      = require('../services/sender');


//creating server
const LISTENER =  NET_MODULE.createServer();

LISTENER.on('connection', function(socket){
    var CLIENT = 
    {
        ADDRESS : socket.remoteAddress,
        PORT    : socket.remotePort
    }
    
    console.log(`New connection from ${CLIENT.ADDRESS}:${CLIENT.PORT}`);
    
    
    socket.on(
        "data", 
        function(data){
          SEND_TO_EXCHANGE(data.toString())
        }
    );

    socket.once(
        "close", 
        function(){
            console.log("Connection closed")
        }
    )

    socket.on(
        "error", 
        function(err){
            console.log(err);
        }
    )

   
});

LISTENER.on('error', function(err){
    throw err;
});

LISTENER.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
