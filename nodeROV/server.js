

var path = require('path');
var Repeat = require('repeat');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var peopleData = require('./peopleData');
var app = express();
var port = process.env.PORT || 3000;
var i2c = require('i2c-bus');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

var arduinoThruster_ADDR = 0x08,
    arduinoThruster_REG   = 0x00,
    arduinoThruster_DATA_LENGTH = 0x05;
    const buf0 = new Buffer([0x00, 0x00,0x00,0x00,0x00,0x00]);

var arduinoServo_ADDR = 0x09,
    arduinoServo_REG   = 0x00,
    arduinoServo_DATA_LENGTH = 0x05;
    const buf1 = new Buffer([0x00, 0x00,0x00,0x00,0x00,0x00]);

var arduinoSensor_ADDR = 0x07,
    arduinoSensor_REG   = 0x02,
    arduinoSensor_DATA_LENGTH = 0x05;
    const buf2 = new Buffer([0x00, 0x00,0x00,0x00,0x00,0x00]);


i2c2 = i2c.openSync(1);

i2c2.i2cWrite(arduinoSensor_ADDR, arduinoSensor_DATA_LENGTH, buf2, function (err) {

Repeat( function () {
    if (err) {
        console.log("SENSORS DOWN on i2cWrite");
    }


    i2c2.i2cRead(arduinoSensor_ADDR, arduinoSensor_DATA_LENGTH, buf2, function (err) {
        if (err) {
            console.log("SENSORS DOWN on i2cRead");
        }
	console.log("arduinoSensor_ADDR==== ", arduinoSensor_ADDR);
	console.log("arduinoSensor_DATA_LENGTH====", arduinoSensor_DATA_LENGTH);
        console.log("Distance: ",buf2[0],"cm");

if(buf2[1] === 0){    
console.log("Moisture Condition Dry");
} else {
console.log("DANGER Moisture Condition WET");
}
});
    }) .every(200, 'ms').start.now();
});











i2c0 = i2c.openSync(1);

i2c0.i2cWrite(arduinoThruster_ADDR, arduinoThruster_DATA_LENGTH, buf0, function (err) {

    if (err) {
        console.log("THRUSTERS DOWN on i2cWrite");
    }

    i2c0.i2cRead(arduinoThruster_ADDR, arduinoThruster_DATA_LENGTH, buf0, function (err) {
        if (err) {
            console.log("THRUSTERS DOWN on i2cRead");
        }
		console.log(buf0);
	console.log("arduinoThruster_ADDR==== ", arduinoThruster_ADDR);
	console.log("arduinoThruster_DATA_LENGTH====", arduinoThruster_DATA_LENGTH);
        console.log(buf0.toString());
    });
});


i2c1 = i2c.openSync(1);

i2c1.i2cWrite(arduinoServo_ADDR, arduinoServo_DATA_LENGTH, buf1, function (err) {

    if (err) {
        console.log("SERVOS DOWN on i2cWrite");
    }

    i2c1.i2cRead(arduinoServo_ADDR, arduinoServo_DATA_LENGTH, buf1, function (err) {
        if (err) {
            console.log("SERVOS DOWN on i2cRead");
        }
	console.log("arduinoServo_ADDR==== ", arduinoServo_ADDR);
	console.log("arduinoServo_DATA_LENGTH====", arduinoServo_DATA_LENGTH);
        console.log(buf1.toString());
    });

});





















app.get('/', function (req, res) {
  res.status(200).render('homePage');
});

app.get('/people', function (req, res) {
  res.status(200).render('peoplePage', {
    people: peopleData
  });
});

app.get('/people/:personId', function(req, res, next) {
  var personId = req.params.personId;
  if (peopleData[personId]) {
    var person = peopleData[personId];
    res.status(200).render('personPage', person);
  }
  else {
    next();
  }
});

app.use(express.static('public'));

app.get('*', function (req, res) {
  res.status(404).render('404');
});

app.post('/people/:personId/addPhoto', function (req, res, next) {
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

app.post('*', function (req, res) {
  res.status(404).send("POST not allowed");
});

app.listen(port, function () {
  console.log("== Server listening on port:", port);
});
