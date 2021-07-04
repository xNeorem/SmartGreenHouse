const {Dht11Faker} = require("./Sensors/Dht11")
const {HygrometerFaker} = require("./Sensors/Hygrometer")
const {PhotoresistorFaker} = require("./Sensors/Photoresistor")
const {WaterLevelSensorFaker} = require("./Sensors/WaterLevelSensor")

const {CoolingFaker} = require("./Devices/cooling")
const {LightsFaker} = require("./Devices/lights")
const {SprinklerFaker} = require("./Devices/sprinkler")
const {HeaterFaker} = require("./Devices/heater")

const cooling = new CoolingFaker()
const lights = new LightsFaker()
const sprinkler = new SprinklerFaker()
const heater = new HeaterFaker()

const dht11 = new Dht11Faker()
const hygrometer = new HygrometerFaker()
const photoresistor = new PhotoresistorFaker()
const waterLevelSensor = new WaterLevelSensorFaker()

dht11.loop(5 * 60 * 60) // 1sec
hygrometer.loop(5 * 60 * 60) // 1sec
photoresistor.loop(5 * 60 * 60) // 1sec
waterLevelSensor.loop(5 * 60 * 60) // 1sec



