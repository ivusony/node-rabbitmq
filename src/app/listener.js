const   NET_MODULE  = require('net');
const   PORT        = 9000;
const   CRC         = require('crc');
const   SEND_TO_QUEUE      = require('../services/sender');


const LISTENER =  NET_MODULE.createServer();

LISTENER.on('connection', function(socket){
    var CLIENT_ADDRESS  = socket.remoteAddress,
        CLIENT_PORT     = socket.remotePort;
    
    console.log(`New connection from ${CLIENT_ADDRESS}:${CLIENT_PORT}`);
    
    
    socket.on(
        "data", 
        function(data){
            //converting received bytes to stringcd ..
            // console.log(data.toString());
            // console.log(data);
            SEND_TO_QUEUE('f1-listener', data.toString())
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
