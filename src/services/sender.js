const AMQP = require('amqplib/callback_api');

//declaring channel in global and setting it to null
var CH  = null;

module.exports = options => {
    try {
        //connect to remote rabbitmq server
        AMQP.connect(options.RMQ_URL, (err, connection) => {
            if (err) {
                throw err;
            }
            console.log('F1 listener AMQP service successfully connected to: ' + connection.connection.stream._host);
            try {
                //create streaming channel
                connection.createChannel((err, channel) => {
                    if (err) {
                        throw err
                    }
                    console.log('Streaming channel established. Waiting for messages.');

                    CH = channel;
                });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }

    process.on(
        'exit', 
        () => {
            CH.close();
            console.log("Closing...");
        }
    );

    process.on(
        "error", 
        err => {
            console.log(err);
        }
    );

    return async (exhange_name, data, cb) => {
        //create exchange
        await CH.assertExchange(
            exhange_name,
            'fanout',
            {
                durable: false
            }
        );
        //publish message to exchange
        await CH.publish(
            exhange_name,
            '',
            new Buffer.from(data, "binary")
        );
        //run callback
        cb(data);
    }
}
