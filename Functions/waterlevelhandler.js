const amqp = require('amqplib')


const log = "iot/logs"
const monitor = "iot/monitor"

function sendFeedbackAmqp(queue,msg){
    amqp.connect('amqp://guest:guest@192.168.1.4:5672').then(function(conn) {
        return conn.createChannel().then(function(ch) {
            const ok = ch.assertQueue(queue, {durable: false});
            return ok.then(function(_qok) {
            ch.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent '%s'", msg);
            return ch.close();
            });
        }).finally(function() { 
                conn.close();
            });
    }).catch(console.warn);
}

function bin2string(array){
    var result = "";
    for(var i = 0; i < array.length; ++i){
        result += (String.fromCharCode(array[i]));
    }
    return result;
}
exports.handler = function(context, event) {
    var _event = JSON.parse(JSON.stringify(event));
    var _data = bin2string(_event.body.data);

    context.callback("feedback "+_data);

    console.log("TRIGGER "+_data);
    sendFeedbackAmqp(log,"Waterlevel : "+_data)
    sendFeedbackAmqp(monitor,"Waterlevel : "+_data)
};