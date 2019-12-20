const AMQP = require('amqplib/callback_api');

// const CONN_URL = "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh";
const CONN_URL = "amqp://admin:xmmA2dYyfZUBZdm8dpD7xubt@harpia.sattrakt.net:30005"


var CH = null;
var exchange = "f1-listener"

//connect to remote rabbitmq
AMQP.connect(CONN_URL, function(err, connection){
    console.log('Connected to: ' + connection.connection.stream._host);
    //create streaming channel
    connection.createChannel(function(err, channel){
        CH = channel;
        
        //create exchange
        CH.assertExchange(exchange, 'fanout', {
            durable: false
        });

    });
});

process.on('exit', function () {
    CH.close();
    console.log("Closing...");
})

process.on("error", function(err){
    console.log(err);
})

const SEND_TO_EXCHANGE = async function (data){
    //publish message to exchange
    await CH.publish(exchange, '', new Buffer.from(data));
}


module.exports = SEND_TO_EXCHANGE;
