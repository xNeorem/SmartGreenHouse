const amqp = require('amqplib');
require('dotenv').config()

const queue="iot/monitor"
const status = {
    "Temperature" : NaN,
    "Hygro": NaN,
    "Lightness": NaN,
    "Waterlevel": NaN,
    "Cooling": false,
    "Heater": false,
    "Lights": false,
    "Sprinkler": false
}

amqp.connect('amqp://guest:guest@:5672').then(function(conn) {
    process.once('SIGINT', function() {
        conn.close();
    });
    return conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue(queue, {
            durable: false
        });
        ok = ok.then(function(_qok) {
            return ch.consume(queue, function(msg) {
                const [key, value] = msg.content.toString().split(' : ')
                status[key]=value
                console.log(status);
            }, {
                noAck: true
            });
        });
        return ok.then(function(_consumeOk) {
            console.log(' Monitor started. To exit press CTRL+C');
        });
    });
}).catch(console.warn);
