const AMQP = require('amqplib/callback_api');

// const CONN_URL = "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh";
const CONN_URL = "amqp://admin:xmmA2dYyfZUBZdm8dpD7xubt@harpia.sattrakt.net:30005"


var CH = null;

AMQP.connect(CONN_URL, function(err, connection){
    connection.createChannel(function(err, channel){
        // console.log(channel);
        CH = channel;
    });
});

process.on('exit', function () {
    CH.close();
    console.log("Closing RMQ channel");
})

process.on("error", function(err){
    console.log(err);
})

const sendToQueue = async function (queueName, data){
    CH.sendToQueue(queueName, new Buffer.from(data));
}


module.exports = sendToQueue;
