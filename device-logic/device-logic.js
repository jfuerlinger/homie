'use strict';

const { exec } = require('child_process');

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var connectionString = 'HostName=FuJo-IoT-01.azure-devices.net;DeviceId=fujo-iot-01;SharedAccessKey=xYPHuz//vijC6Ooat/PVWxuIBPLBHvro5L82xN9BZaA=';

var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}


var connectCallback = function (err) {
    if (err) {
        console.log('Could not connect: ' + err);
    } else {
        console.log('Client connected');
        client.on('message', function (msg) {
            //console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
            commandCallback(msg.data+'');
            client.complete(msg, printResultFor('completed'));
        });
        // Create a message and send it to the IoT Hub every second
        // setInterval(function () {
        //     var temperature = 20 + (Math.random() * 15);
        //     var humidity = 60 + (Math.random() * 20);
        //     var data = JSON.stringify({ deviceId: 'myFirstNodeDevice', temperature: temperature, humidity: humidity });
        //     var message = new Message(data);
        //     message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');
        //     console.log("Sending message: " + message.getData());
        //     client.sendEvent(message, printResultFor('send'));
        // }, 5000);
    }
};

client.open(connectCallback);

var commandCallback = function(command) {
    console.log('Command received: ' + command);
    switch (command) {
        case "LIGHT_ON":
            console.log("enabling the light ...");
            var on = exec('/home/pi/433Utils/RPi_utils/steuerung 1', (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
            });
            console.log("Light: ON");
            break;

        case "LIGHT_OFF":
            exec('/home/pi/433Utils/RPi_utils/steuerung 0', (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
            });
            console.log("Light: OFF");
            break;
    }
}