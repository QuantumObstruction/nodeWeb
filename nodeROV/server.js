"use strict";

var path = require('path');
var Repeat = require('repeat');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var peopleData = require('./peopleData');
var app = express();
var port = process.env.PORT || 3000;
var i2c = require('i2c-bus');
var gpio = require('linux-gpio');

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

////////////////////////////////////////////GPIO????????????
//pinNum = 57;
//pinVal = false;



//var Gpio = require('onoff').Gpio,
  //button = new Gpio(57, 'in', 'both');





var arduinoThruster_ADDR = 0x08,
    arduinoThruster_REG = 0x00,
    arduinoThruster_DATA_LENGTH = 0x05;
var buf0 = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

var arduinoServo_ADDR = 0x09,
    arduinoServo_REG = 0x00,
    arduinoServo_DATA_LENGTH = 0x05;
var buf1 = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

var arduinoSensor_ADDR = 0x07,
    arduinoSensor_REG = 0x00,
    arduinoSensor_DATA_LENGTH = 0x05;
var buf2 = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);




function arduinoThrusters() {
var i2c0 = i2c.openSync(1);
i2c0.i2cWrite(arduinoThruster_ADDR, arduinoThruster_DATA_LENGTH, buf0, function(err) {

    if (err) {
        console.log("THRUSTERS DOWN on i2cWrite");
    }

    i2c0.i2cRead(arduinoThruster_ADDR, arduinoThruster_DATA_LENGTH, buf0, function(err) {
        if (err) {
            console.log("THRUSTERS DOWN on i2cRead");
        }
        console.log("Thrusters", buf0.toString());
    });
});
}

function arduinoServos() {
var i2c1 = i2c.openSync(1);
i2c1.i2cWrite(arduinoServo_ADDR, arduinoServo_DATA_LENGTH, buf1, function(err) {
    if (err) {
        console.log("SERVOS DOWN on i2cWrite");
    }

    i2c1.i2cRead(arduinoServo_ADDR, arduinoServo_DATA_LENGTH, buf1, function(err) {
        if (err) {
            console.log("SERVOS DOWN on i2cRead");
        }
   
        console.log("Servos: ", buf1.toString());
    });

});
}

function arduinoSensors() {
var i2c2 = i2c.openSync(1);

i2c2.i2cWrite(arduinoSensor_ADDR, arduinoSensor_DATA_LENGTH, buf2, function(err) {    
        if (err) {
            console.log("SENSORS DOWN on i2cWrite");
        }
        i2c2.i2cRead(arduinoSensor_ADDR, arduinoSensor_DATA_LENGTH, buf2, function(err) {
            if (err) {
                console.log("SENSORS DOWN on i2cRead");
            }
            console.log("Distance: ", buf2[0], "cm");

            if (buf2[1] === 0) {
                console.log("Moisture Condition Dry");
            } else {
                console.log("DANGER Moisture Condition WET");
            }
        });    
});
}



//function linetake() {
//////Make Line BUSY for Arduino
//  pin.direction(gpio.DIR_OUT, function(err) {
//    console.log("Pin %d configured as output", pin.pin);
//});
//	console.log("Line Taken");
///////////MLBfA

//}

//function lineRelease(){
//	   ////Make Line READY for Arduino
// pin.direction(gpio.DIR_IN, function(err) {
//      //console.log("Pin %d configured as input", pin.pin);
//	console.log("Line released");
//    });

//	////////MLRfA
//}

function callShit(){
	arduinoSensors();
	//arduinoServos();
	//arduinoThrusters();
}





//function getBus() {
//	gpio.export(57, {}, function(err, pin) {
//  if (err) {
//    while(err)
//			break;
//  	} else {
//    pin.value(function(err,state) {
//      if (err) {
//        while(err)
//		break;
//      } else {
//		console.log("STATE: ", state);
//	while(!state) { 
//		console.log("WAIT");
//		break;
//		}
//	if(state){
//		console.log("TAKING Bus");
// 		pin.direction(gpio.DIR_OUT, function(err) {
//	if(err) { 
//		while(err)
//		break;
//		} else {
//    		console.log("Pin %d configured as output", pin.pin);
//    		//callShit();
//		 	pin.direction(gpio.DIR_IN, function(err) {
//		if(err) {
//			while(err)
//				break;
//				} else {
//      				console.log("Pin %d configured as input", pin.pin);
//      			}
//    			});
//				}
//  				});
//				}
//				}
//    			});
//  				}
//				});
//}//getBus()




	//var totalRun = 0;
	//var count = 0;
//Repeat(function() {
//totalRun++;
//	console.log(totalRun);	
//callShit();
//}).every(1000, 'ms').start.now();

var myPythonScriptPath = 'script.py';

// Use python shell
var PythonShell = require('python-shell');
var pyshell = new PythonShell(myPythonScriptPath);

pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
    if (err){
        throw err;
    };

    console.log('finished');
});





app.get('/', function(req, res) {
    res.status(200).render('homePage');
});

app.get('/people', function(req, res) {
    res.status(200).render('peoplePage', {
        people: peopleData
    });
});

app.get('/people/:personId', function(req, res, next) {
    var personId = req.params.personId;
    if (peopleData[personId]) {
        var person = peopleData[personId];
        res.status(200).render('personPage', person);
    } else {
        next();
    }
});

app.use(express.static('public'));

app.get('*', function(req, res) {
    res.status(404).render('404');
});

app.post('/people/:personId/addPhoto', function(req, res, next) {
    var personId = req.params.personId;
    if (peopleData[personId]) {
        console.log("== request body:", req.body);
        peopleData[personId].photos.push({
            photoURL: req.body.photoURL,
            caption: req.body.caption
        });
        console.log("== new person data:", peopleData[personId]);
        res.status(200).send("Success");
    } else {
        next();
    }
});

app.post('*', function(req, res) {
    res.status(404).send("POST not allowed");
});

app.listen(port, function() {
    console.log("== Server listening on port:", port);
});

