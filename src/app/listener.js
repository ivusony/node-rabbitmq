const   NET_MODULE          = require('net');
const   PORT                = 9000;
const   CRC                 = require('crc');
const   Parser              = require('teltonika-parser');
const   binutils            = require('binutils64');
const   CONNECTED_CLIENTS   = [];

// creating server / listener
const   SERVER              = NET_MODULE.createServer();
const   SENDER              = require('../services/sender');

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
                console.log(data);
                console.log(data.byteLength);
                //(the name of the exhange, data to be sent, cb)


                //check if IMEI

                if(data.byteLength <= 17)
                {
                    //check if device is auth
                    // lets assume it is

                    CLIENT.write(`{"imei":"${data}"}`)


                }
                else{
                    // if byte length is more than 17
                    // device is sending data
                    console.log(data);
                }

                //PARSER
                // let buffer = data;
                // let parser = new Parser(buffer);
                
                // if(parser.isImei){
                //     CLIENT.write(Buffer.alloc(1,1));
                // }
                // else{
                //     let avl = parser.getAvl();

                //     let writer = new binutils.BinaryWriter();
                //     writer.WriteInt32(avl.number_of_data);

                //     let response = writer.ByteBuffer; 
                //     CLIENT.write(response);
                // }
                

                // SEND_TO_EXCHANGE(
                //     "f1-listener", 
                //     //buffer to string
                //     data, 
                //     (data_sent) => {
                //         console.log(`Message sent is below:`);
                //         console.log(data_sent);
                //         console.log('To string:' + data_sent);
                //         console.log('Closing connection.......');
                //     }
                // );
            }
        );

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
