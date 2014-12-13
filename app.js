//var Cylon = require('cylon');
var config = require('./config.js');
var sendgrid = require('sendgrid')(config.sgUsername, config.sgPassword);
var _ = require('lodash');

Cylon.robot({
    connections: {
        edison: { adaptor: 'intel-iot' }
    },
    
    devices: {
        zapalert: { driver: 'direct-pin', pin: 4 }
    },
    
    work: function (my) {
        var tripped = false;
        every((1).second(), function () {
            my.zapalert.digitalRead(function (value) {
                if (!tripped && value == 1) {
                    tripped = true;
                    sendEmail();
                }
                else if (tripped && value == 0) {
                    tripped = false; //reset trip detection
                }
            });
        });
    }
}).start();

function sendEmail() {
    sendgrid.send({
        to: config.email,
        from: config.email,
        subject: getRandomSubject(),
        text: 'Your rat extermination detection contraption has detected a successful event and is notifying you. You may want to act before the pungent aroma sets in.'
    }, function (err, message) {
        if (err) console.error(message);
        else console.info('Zap detection. Email successfully sent.');
    });
}

function getRandomSubject() {
    return _.sample([
        'It\'s rat for dinner!',
        'Zzzzzzt!',
        'Rat toast!',
        'One less rat in the world!',
        'You 1, Rat 0'
    ]);
}