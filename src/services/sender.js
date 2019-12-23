const AMQP = require('amqplib/callback_api');

// const CONN_URL = "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh";
const CONN_URL = "amqp://admin:xmmA2dYyfZUBZdm8dpD7xubt@harpia.sattrakt.net:30005"
//declaring channel in global and setting it to null
var CH  = null;

try{
    //connect to remote rabbitmq server
    AMQP.connect(CONN_URL, function (err, connection) {
        if(err)
        {
            throw err;
        }
        console.log('F1 listener successfully connected to: ' + connection.connection.stream._host);
        try {
            //create streaming channel
            connection.createChannel(function (err, channel) {
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
catch(err)
{
    console.log(err);
}


const SEND_TO_EXCHANGE = async function (exhange_name, data, cb){
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
        new Buffer.from(data)
    );

    cb();
}


process.on('exit', function () {
    CH.close();
    console.log("Closing...");
})

process.on("error", function (err) {
    console.log(err);
})


module.exports = SEND_TO_EXCHANGE;
