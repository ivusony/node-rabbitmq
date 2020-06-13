const   NET_MODULE              = require('net');
const   PORT                    = 9000;

const   CONNECTED_CLIENTS       = [];

const   TCP_DECODER = require('../services/tcpdecoder');

// creating server / listener
const   SERVER                  = NET_MODULE.createServer();
const   SENDER                  = require('../services/sender');

// stingray RMQ servise url for testing purposes
// "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh"

// importing sender function 
// returns an async function
const   SEND_TO_EXCHANGE = SENDER(
            {
                // cloud test rmq
                RMQ_URL: "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh"
                
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

        // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        // console.log(`New connection from ${NEW_CLIENT.ADDRESS}:${NEW_CLIENT.PORT}`);

        // SOCKET sending data
        var IMEI = undefined, AVL = undefined;

        CLIENT.on(
            "data", 
            data => {
                
                var decoded         = new TCP_DECODER(data),
                    decoded_data    = decoded.decode_AVL();
                // the data record array length preceded by 3 bytes of zero
                var length = new Buffer.from([0x00, 0x00, 0x00, decoded_data.number_of_data2]);
                // when module connects to server, module sends its IMEI. First comes short identifying number of bytes written and then goes IMEI as text (bytes). 
                // First two bytes denote IMEI length.
                if(decoded.isDeviceAuthenticating())
                {
                    IMEI = data;
                    console.log(IMEI);
                    var IMEI_raw = data.toString();
                    var device_IMEI = IMEI_raw.substring(2);
                    
                    //send 1 if allowed. Future DB lookup
                    CLIENT.write(new Buffer.from([0x01]));

                }else{               
                    var totalBufferLength = IMEI.length + data.length;
                    //the actual DATA stream. Sending to RMQ exhange

                    SEND_TO_EXCHANGE(
                        "f1-listener",
                        //buffer to string
                        new Buffer.concat([IMEI, data], totalBufferLength),
                        //  data,
                        (data_sent) => {
                            // console.log(`Message sent is below:`);
                            // console.log(decoded_data);
                            // console.log('To string:' + data_sent);
                            // console.log('Closing connection.......');
                        }
                    );

                    console.log('Device ime is: ' + IMEI);
                    // returning the length of received records preceded by 3 zeroes to the client (device)
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
