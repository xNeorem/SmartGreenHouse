const amqp = require('amqplib')
const mqtt = require('mqtt')

const log = "iot/logs"
const cooling = "iot/devices/cooling"
const monitor = "iot/monitor"
var currCoolingState = false

const url = 'mqtt://192.168.1.4'

const options = {
    port: 1883,
    host: url,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'guest',
    password: 'guest',
};


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

function sendFeedbackMqtt(q,msg){

    const client = mqtt.connect(url, options);

    client.on('connect', function() {
        client.publish(q, msg,{qos:2},function(){
            client.end();
        });             
    });        
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

    var temp = parseInt(_data)
    if(temp >= 35){
        if(!currCoolingState){
            currCoolingState = true
            sendFeedbackMqtt(cooling,"true")
        }
    }
    else if(temp <= 25){
        if(currCoolingState){
            currCoolingState = false
            sendFeedbackMqtt(cooling,"false")
        }
    }

    console.log("TRIGGER "+_data)
    sendFeedbackAmqp(log,"Temperature : "+_data)
    sendFeedbackAmqp(monitor,"Temperature : "+_data)
};