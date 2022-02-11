var cors = require('cors');
var express = require('express');
var app = module.exports = express();
const bodyParser = require('body-parser');

// Create HTTP error

function createError(status, message) {
  var err = new Error(message);
  err.status = status;
  return err;
}

const mockAppointments = [
    {
          "id": "2bd88e12-8586-4f77-aee6-356c60d4b420",
          "merchantId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
          "customerFirstname": "Joshua",
          "customerLastname": "Fett",
          "amountOfReservations": 2,
          "startTime": "2022-01-16 19:00:00Z",
          "endTime": "2022-01-16 21:00:00Z",
          "status": 0
    },
    {
          "id": "c6662a27-ce52-4995-8b2e-f400b93aec11",
          "merchantId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
          "customerFirstname": "Joshua",
          "customerLastname": "Fett",
          "amountOfReservations": 2,
          "startTime": "2022-01-17 11:00:00Z",
          "endTime": "2022-01-17 13:00:00Z",
          "status": 1
    },
    {
          "id": "2481ec30-863b-41b2-bf8e-a89cf69ecc9b",
          "merchantId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
          "customerFirstname": "Elena",
          "customerLastname": "Schmidt",
          "amountOfReservations": 2,
          "startTime": "2022-01-17 11:00:00Z",
          "endTime": "2022-01-17 13:00:00Z",
          "status": -1
    },
    {
          "id": "640aec7e-49e2-440b-a6fa-e45022eb1d6a",
          "merchantId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
          "customerFirstname": "Elena",
          "customerLastname": "Schmidt",
          "amountOfReservations": 2,
          "startTime": "2022-01-17 13:00:00Z",
          "endTime": "2022-01-17 15:00:00Z",
          "status": 0
        },
    {
          "id": "1948c52f-be2e-4a01-9022-867824a952f8",
          "merchantId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
          "customerFirstname": "Joshua",
          "customerLastname": "Fett",
          "amountOfReservations": 2,
          "startTime": "2022-01-18 15:00:00Z",
          "endTime": "2022-01-18 16:00:00Z",
          "status": 0
    },
    {
          "id": "23765903-8a6e-49ab-a693-31f2c8d3d683",
          "merchantId": "jdosj89rh3adilnr",
          "customerFirstname": "Joshua",
          "customerLastname": "Fett",
          "amountOfReservations": 2,
          "startTime": "2022-01-18 15:00:00Z",
          "endTime": "2022-01-18 16:00:00Z",
          "status": 0
    },
];

const displayedAppointments = [...mockAppointments];

app.use(bodyParser.json());

app.get('/bookings', cors(), (req, res) => {
    res.json(displayedAppointments)
})

app.get('/bookings/:merchantId', cors(), (req, res) => {
    res.json(displayedAppointments.filter((booking) => booking.merchantId == req.params.merchantId));
})

app.post('/bookings', cors(), (req, res) => {
    console.log("Ich werde gecallt");
    console.log(req.body);
    var appmt = req.body;
    displayedAppointments.push(appmt)
    res.status(200).send({ message: 'Appmt created!' });
})

app.patch('/bookings/:bookingId', cors(), (req, res) => {
    console.log(req.body);
    const index = displayedAppointments.findIndex((appointment) => appointment.id == req.params.bookingId);
    if(index == -1) {
        res.status(404).json(displayedAppointments);
    } else {
        let appointment = displayedAppointments[index];
        appointment.status = req.body.status;
        displayedAppointments[index] = appointment;
        res.json(displayedAppointments);
    }
});

if (!module.parent) {
  app.listen(4500);
  console.log('Express started on port 4500');
}