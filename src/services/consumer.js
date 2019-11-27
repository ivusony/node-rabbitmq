const AMQP = require('amqplib/callback_api');

// const CONN_URL = "amqp://mnresdlh:GLyLJTCLkbe8tDiAvsuZZs-_paQ6LeMj@stingray.rmq.cloudamqp.com/mnresdlh";

const CONN_URL = "amqp://admin:xmmA2dYyfZUBZdm8dpD7xubt@harpia.sattrakt.net:30005"

AMQP.connect(CONN_URL, function (err, CONNECTION) {
    CONNECTION.createChannel(function (err, CH) {
        CH.consume('f1-listener', function (msg) 
            {
                console.log("Message:", msg.content.toString());
            },
            { noAck: true }
        );
    });
});

