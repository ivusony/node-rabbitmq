const   NET_MODULE          = require('net');
const   PORT                = 9000;
const   CRC                 = require('crc');

// importing sender function
const   SEND_TO_EXCHANGE    = require('../services/sender');
const   CONNECTED_CLIENTS   = [];

// creating server / listener
const   SERVER              =  NET_MODULE.createServer();

// on client connection event
SERVER.on('connection', function(CLIENT){
    // console.log(CLIENT);
    var NEW_CLIENT = 
    {
        ADDRESS : CLIENT.remoteAddress,
        PORT    : CLIENT.remotePort,
    }
    // CONNECTED_CLIENTS.push(NEW_CLIENT);

    console.log(`New connection from ${NEW_CLIENT.ADDRESS}:${NEW_CLIENT.PORT}`);
    console.log('Connected clients: ' + CONNECTED_CLIENTS.length); 
    
    CLIENT.on(
        "data", 
        function(data){
            //(the name of the exhange and the actual data to be sent)
            SEND_TO_EXCHANGE("f1-listener", data.toString());
        }
    );

    CLIENT.on(
        "close", 
        function(){
            console.log("Connection closed")
        }
    )

    CLIENT.on(
        "error", 
        function(err){
            console.log(err);
        }
    )
  
});

SERVER.on('error', function(err){
    throw err;
});

SERVER.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
