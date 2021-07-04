var amqp = require('amqplib');
require('dotenv').config()

amqp.connect(`amqp://guest:guest@${process.env.AMQP_BROKER_IP}:5672`).then(function(conn) {
    process.once('SIGINT', function() {
        conn.close();
    });
    return conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue('iot/logs', {
            durable: false
        });
        ok = ok.then(function(_qok) {
            return ch.consume('iot/logs', function(msg) {
                console.log(" [x] Received '%s'", msg.content.toString());
            }, {
                noAck: true
            });
        });
        return ok.then(function(_consumeOk) {
            console.log(' [*] Waiting for messages. To exit press CTRL+C');
        });
    });
}).catch(console.warn);