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

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log(`New connection from ${NEW_CLIENT.ADDRESS}:${NEW_CLIENT.PORT}`);
    // console.log('Connected clients: ' + CONNECTED_CLIENTS.length); 
    
    CLIENT.on(
        "data", 
        function(data){
            //(the name of the exhange and the actual data to be sent)
            SEND_TO_EXCHANGE("f1-listener", data.toString(), function(){
                console.log('Message sent. Closing connection.......');
            });
        }
    );

    CLIENT.on(
        "close", 
        function(){
            console.log(`Connection from ${NEW_CLIENT.ADDRESS}:${NEW_CLIENT.PORT} CLOSED`);
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        }
    )

    CLIENT.on(
        "error", 
        function(err){
            throw err;
        }
    )
  
});

SERVER.on('error', function(err){
    throw err;
});

SERVER.listen(PORT, () => {
    console.log("F1 listener listening for incoming messages on port " + PORT);
});
