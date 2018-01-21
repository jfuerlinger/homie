'use strict';

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

var connectionString = 'HostName=FuJo-IoT-01.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=2ctE1IbHDKO+jr1M/W0jAcXnCzbsOyOpJmyfGaNs7aE=';
var targetDevice = 'fujo-iot-01';

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

function receiveFeedback(err, receiver) {
    receiver.on('message', function (msg) {
        console.log('Feedback message:')
        console.log(msg.getData().toString('utf-8'));
    });
}

serviceClient.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('Service client connected');
        serviceClient.getFeedbackReceiver(receiveFeedback);

        setTimeout(function () {

            var message = new Message('LIGHT_ON');
            message.ack = 'full';
            message.messageId = "My Message ID";
            console.log('Sending message: ' + message.getData());
            serviceClient.send(targetDevice, message, printResultFor('send'));

        }, 1);

        setTimeout(function () {

            var message = new Message('LIGHT_OFF');
            message.ack = 'full';
            message.messageId = "My Message ID";
            console.log('Sending message: ' + message.getData());
            serviceClient.send(targetDevice, message, printResultFor('send'));

            
        }, 3000);

    }
});