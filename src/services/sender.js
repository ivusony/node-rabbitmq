const AMQP = require('amqplib/callback_api');

// const CONN_URL = "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh";
const CONN_URL = "amqp://admin:xmmA2dYyfZUBZdm8dpD7xubt@harpia.sattrakt.net:30005"


var CH  = null;

//connect to remote rabbitmq server
AMQP.connect(CONN_URL, function(err, connection){
    console.log('Sender connected to: ' + connection.connection.stream._host);
    //create streaming channel
    connection.createChannel(function(err, channel){
        CH = channel;
    });
});

const SEND_TO_EXCHANGE = async function (exhange_name, data){
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
}


process.on('exit', function () {
    CH.close();
    console.log("Closing...");
})

process.on("error", function (err) {
    console.log(err);
})


module.exports = SEND_TO_EXCHANGE;
