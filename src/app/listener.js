const   NET_MODULE          = require('net');
const   PORT                = 9000;
const   CRC                 = require('crc');
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
                // harpia.sattrakt.net RMQ
                // RMQ_URL: "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh"
                // RMQ_URL: 'amqp://rabbit-mq-rabbitmq-ha.rabbitmq-system.svc.svc.cluster.local:5672'
                RMQ_URL: "amqp://admin:xmmA2dYyfZUBZdm8dpD7xubt@rabbit-mq-rabbitmq-ha.rabbitmq-system.svc.svc.cluster.local:5672"
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
                //(the name of the exhange, data to be sent, cb)
                SEND_TO_EXCHANGE(
                    "f1-listener", 
                    //buffer to string
                    data.toString(), 
                    (data_sent) => {
                        console.log(`Message sent: ${data_sent}`);
                        console.log('Closing connection.......');
                    }
                );
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
