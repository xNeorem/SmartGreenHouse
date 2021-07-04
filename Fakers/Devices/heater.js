const amqp = require('amqplib')
const mqtt = require('mqtt')

require('dotenv').config({ path: '../.env' })

const topic = 'iot/devices/heater'
const log = 'iot/logs'
const monitor = "iot/monitor"
const url = 'mqtt://'+process.env.MQTT_BROKER_IP

function bin2string(array){
  var result = "";
  for(var i = 0; i < array.length; ++i){
      result += (String.fromCharCode(array[i]));
  }
  return result;
}

class HeaterFaker{
    constructor(){
        this.power=false
        
        const options = {
          port: 1883,
          host: url,
          clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
          username: process.env.MQTT_USERNAME,
          password: process.env.MQTT_PASSWORD,
      }


      this.connected = false
      this.client = mqtt.connect(url, options)

      this.client.on("connect",function(){
          console.log(' *** HeaterFaker ready! ***')
          this.connected = true
      }.bind(this))

      this.client.subscribe(topic,{qos:2});

      this.client.on('message',function(topic, message, packet){        
        this.doWork(bin2string(message));
      }.bind(this));
    }


    sendMessageAmqp(queue,msg) {
        amqp
          .connect(`amqp://guest:guest@${process.env.AMQP_BROKER_IP}:5672`)
          .then(function (conn) {
            return conn
              .createChannel()
              .then(function (channel) {
                var ok = channel.assertQueue(queue, { durable: false })
                return ok.then(function (_qok) {
                  channel.sendToQueue(queue, Buffer.from(msg))
                //   console.log('HeaterFaker ' + msg)
                  return channel.close()
                })
              })
              .finally(function () {
                conn.close()
              })
          })
          .catch(console.warn)
      }

    doWork(msg){

        const isTrueSet = (msg === 'true')
        
        if(isTrueSet === this.power)
          return 

        if(isTrueSet)
            this.power = true
        else
            this.power = false

        const message = `Heater : ${this.power}`

        this.sendMessageAmqp(log,message)
        this.sendMessageAmqp(monitor,message)
        console.log(message)

    }


}

module.exports.HeaterFaker = HeaterFaker



