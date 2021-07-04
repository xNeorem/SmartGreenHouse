const mqtt = require('mqtt');
require('dotenv').config({ path: '../.env' })

const url = 'mqtt://'+process.env.MQTT_BROKER_IP
const topic="iot/sensors/waterlevel"


class  WaterLevelSensorFaker{
    
    constructor(){

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
            console.log("WaterLevelSensorFaker connected : "+ this.client.connected);
            this.connected = true
        }.bind(this))

    }

    sendRandomData(){
        if(!this.connected)
            return

        const data = Math.floor(Math.random() * 100).toString()
        console.log("WaterLevelSensorFaker sendData: "+data)
        this.client.publish(topic, data) //default QoS 0
    }


    loop(time){
        this.sendRandomData()
        setTimeout( this.loop.bind(this,time) , time )
    }

}

module.exports.WaterLevelSensorFaker = WaterLevelSensorFaker;