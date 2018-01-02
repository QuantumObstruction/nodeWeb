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
var i2c2 = i2c.openSync(1);

var arduinoThrusters_ADDR = 0x08,
    arduinoThrusters_REG = 0x00,
    arduinoThrusters_DATA_LENGTH = 0x05;
var buf0 = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

var arduinoServo_ADDR = 0x09,
    arduinoServo_REG = 0x00,
    arduinoServo_DATA_LENGTH = 0x05;
var buf1 = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

var arduinoSensor_ADDR = 0x07,
    arduinoSensor_REG = 0x00,
    arduinoSensor_DATA_LENGTH = 0x05;
var buf2 = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

// Use python shell
var PythonShell = require('python-shell');

var options1 = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: './Adafruit_Python_LSM303/examples',
  args: []
};

var options = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '.',
  args: []
};
///////////////////////////////////////////////////////////////////////////

function lsm303PY(){
PythonShell.run('./simpletest.py', options1, function (err, results) {
		// received a message sent from the Python script (a simple "print" statement)			
		console.log('Accel: ');
		console.log("X: ", results[0]);
		console.log("Y: ", results[1]);
		console.log("Z: ", results[2]);
				console.log('Mag: ');
		console.log("X: ", results[0]);
		console.log("Y: ", results[1]);
		console.log("Z: ", results[2]);
});
}


function l3d20PY(){	PythonShell.run('./L3GD20.py', options, function (err, results) {
		// received a message sent from the Python script (a simple "print" statement)
	var gyro = results.slice(0, 3);
			
		console.log('Gyro: ');
		console.log(gyro[0]);
		console.log(gyro[1]);
		console.log(gyro[2]);
	});
}


	var totalRun = 0;
var interval = setInterval(function() {
totalRun++;
	console.log("Total Run: ",totalRun);	
		lsm303PY();
		l3d20PY();
		arduinoSensors();
		arduinoServos();
		arduinoThrusters();
}, 1000);//ms


//	var totalRun = 0;
//	//var count = 0;
//Repeat(function() {
//totalRun++;
//console.log(totalRun);	
//arduinoSensors();
//arduinoServos();
//arduinoThrusters();

//}).every(1000, 'ms').start.now();



function arduinoThrusters() {

i2c2.i2cWriteSync(arduinoThrusters_ADDR, arduinoThrusters_DATA_LENGTH, buf0);

      while(  i2c2.i2cReadSync(arduinoThrusters_ADDR, arduinoThrusters_DATA_LENGTH, buf0) === 0){}
	console.log("Thrusters: ",buf0.toString());
}

function arduinoServos() {

i2c2.i2cWriteSync(arduinoServo_ADDR, arduinoServo_DATA_LENGTH, buf1);

      while(  i2c2.i2cReadSync(arduinoServo_ADDR, arduinoServo_DATA_LENGTH, buf1) === 0){}
	console.log("Servos: ",buf1.toString());
}

function arduinoSensors() {

i2c2.i2cWriteSync(arduinoSensor_ADDR, arduinoSensor_DATA_LENGTH, buf2);

      while(  i2c2.i2cReadSync(arduinoSensor_ADDR, arduinoSensor_DATA_LENGTH, buf2) === 0){}
         parseShit(buf2);
}

function parseShit(buf2){
  if(buf2[0]> 0)
            console.log("Distance: ", buf2[0], "cm");

            if (buf2[1] === 0) {
                console.log("Moisture Condition Dry");
            } else {
                console.log("DANGER Moisture Condition WET");
            }
}

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());



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
