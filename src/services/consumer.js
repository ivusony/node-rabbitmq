const AMQP = require('amqplib/callback_api');

const TCP_DECODER = require('../services/tcpdecoder');

const fs = require('fs');

// const CONN_URL = "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh";
const CONN_URL = "amqp://admin:xmmA2dYyfZUBZdm8dpD7xubt@harpia.sattrakt.net:30005"

AMQP.connect(CONN_URL, (err, CONNECTION) => {

    console.log('F1 test consumer connected to: ' + CONNECTION.connection.stream._host);;
    CONNECTION.createChannel((err, channel) => {

        var exchange = 'f1-listener';

        //#assertQueue([queue, [options, [function(err, ok) {...}]]])
        channel.assertQueue(
            // queue is a string; if you supply an empty string or other falsey value (including null and undefined), the server will create a random name for you.
            null, 
            {
                // exclusive: if true, scopes the queue to the connection (defaults to false)
                exclusive   : true,
                // autoDelete: if true, the queue will be deleted when the number of consumers drops to zero (defaults to false)
                autoDelete  : false,
                // durable: if true, the queue will survive broker restarts, modulo the effects of exclusive and autoDelete
                durable     : true
            }, 
            (err, ASSERTED_TEMP_QUEUE) => {
                if (err) 
                {
                    throw err;
                }
                // Assert a routing path from an exchange to a queue: 
                // the exchange named by source will relay messages to the queue named, according to the type of the exchange and the pattern given. 
                console.log(`Binding temp queue: ${ASSERTED_TEMP_QUEUE.queue} to exhange: ${exchange}`);
                channel.bindQueue(ASSERTED_TEMP_QUEUE.queue, exchange, '');

                // pull messages from the temp queue which is binded to exchange
                channel.consume(ASSERTED_TEMP_QUEUE.queue, (msg) => {
                    if (msg) {
                        // console.log(`Message received below:`);
                        // console.log(msg.content);
                       

                        var decoder = new TCP_DECODER(msg.content);

                        fs.appendFile('../test/data.json', JSON.stringify(decoder.decode_AVL()) + ',' , function(err) {
                            if(err)
                            {
                                return console.log(err);
                            }
                            console.log('Data received. Data.json appended');
                        })
                        // console.log(decoder.decode_AVL());
            
                    }
                }, {
                    noAck: true
                });
            }
        );
    });
});

// Documentation: https://www.squaremobius.net/amqp.node/channel_api.html#channel_assertQueue



