const   NET_MODULE              = require('net');
const   PORT                    = 9000;

const   CONNECTED_CLIENTS       = [];

const   TCP_DECODER = require('../services/tcpdecoder');

// creating server / listener
const   SERVER                  = NET_MODULE.createServer();
const   SENDER                  = require('../services/sender');

var decimalToBinary = require("decimal-to-binary");

// stingray RMQ servise url for testing purposes
// "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh"

// importing sender function 
// returns an async function
const   SEND_TO_EXCHANGE = SENDER(
            {
                // cloud test rmq
                // RMQ_URL: "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh"
                // harpia.sattrakt.net RMQ
                RMQ_URL: "amqp://admin:xmmA2dYyfZUBZdm8dpD7xubt@harpia.sattrakt.net:30005"
            }
        );

// on client connection event
SERVER.on(
    'connection', 
    CLIENT => {
        var NEW_CLIENT = 
        {
            ADDRESS : CLIENT.remoteAddress,
            PORT    : CLIENT.remotePort,
        }
        // CONNECTED_CLIENTS.push(NEW_CLIENT);

        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log(`New connection from ${NEW_CLIENT.ADDRESS}:${NEW_CLIENT.PORT}`);

    

        CLIENT.on(
            "data", 
            data => {

              
                var decoded = new TCP_DECODER(data);

                 var decoded_data = decoded.decode_AVL();

                console.log(decoded_data.number_of_data2)
                var length = new Buffer.from([0x00, 0x00, 0x00, decoded_data.number_of_data2]);
                console.log(length);
                

                // check if device is trying to authenticate
                if(decoded.isDeviceAuthenticating())
                {
                    var IMEI_raw = data.toString();
                    var device_IMEI = IMEI_raw.substring(2);

                    //send 1 if allowed
                    CLIENT.write(new Buffer.from([0x01]));

                }else{                    

                    SEND_TO_EXCHANGE(
                        "f1-listener",
                        //buffer to string
                        data,
                        (data_sent) => {
                            console.log(`Message sent is below:`);
                            // console.log(decoded_data);
                            // console.log('To string:' + data_sent);
                            console.log('Closing connection.......');
                        }
                    );


                    CLIENT.write(length);
                   

                }


            }
        );

        CLIENT.on('end', ()=>{
          CLIENT.end();
        })

        CLIENT.on(
            "close", 
            () => {
                console.log(`Connection from ${NEW_CLIENT.ADDRESS}:${NEW_CLIENT.PORT} CLOSED`);
                console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            }
        )

        CLIENT.on(
            "error", 
            err => {
                throw err;
            }
        )
    }
);

SERVER.on(
    'error', 
    err => {
        throw err;
    }
);

SERVER.listen(
    PORT, 
    () => {
        console.log("F1 listener listening for incoming messages on port " + PORT);
    }
);
