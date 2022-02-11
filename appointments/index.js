var cors = require('cors');
var express = require('express');
var app = module.exports = express();

app.use(express.json());
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
        'userId': "andor",
        "serviceId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
        "merchantName": "Mamma of Africa",
        "amountOfReservations": 2,
        "startAsTimestamp": 1642359600,
        "startTime": "2022-01-16 19:00:00Z",
        "endAsTimestamp": 1642366800,
        "timeSlots": [12,13],
        "endTime": "2022-01-16 21:00:00Z",
        "category": 1
    },
    {
        "id": "b8e70693-8fa6-4644-9b9d-60b63826d6b6",
        "merchantId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
        'userId': "andor",
        "serviceId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
        "merchantName": "Praxis Münchner",
        "amountOfReservations": 1,
        "startAsTimestamp": 1642499100,
        "startTime": "2022-01-18 09:45:00Z",
        "endAsTimestamp": 1642502700,
        "timeSlots": [12,13],
        "endTime": "2022-01-18 10:45:00Z",
        "category": 4
    },
    {
        "id": "0fde00a1-ec2e-427d-a24c-2c0495cb5476",
        "merchantId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
        'userId': "andor",
        "serviceId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
        "merchantName": "Test Test",
        "amountOfReservations": 1,
        "startAsTimestamp": 1642497300,
        "startTime": "2022-01-18 09:15:00Z",
        "endAsTimestamp": 1642498200,
        "endTime": "2022-01-18 09:30:00Z",
        "timeSlots": [11,12],
        "category": 3
    },
    {
        "id": "34527dc4-cf30-4851-ace1-b066d944f7e5",
        "merchantId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
        "serviceId": "34527dc4-cf30-4851-ace1-b066d944f7e5",
        'userId': "joshua",
        "merchantName": "Pastaholic",
        "amountOfReservations": 1,
        "startAsTimestamp": 1642603500,
        "startTime": "2022-01-19 14:45:00Z",
        "endAsTimestamp": 1642611600,
        "endTime": "2022-01-19 17:00:00Z",
        "timeSlots": [11,12,13],
        "category": 1
    }
]

const displayedAppointments = [...mockAppointments];

app.get('/appointments', cors(), (req, res) => {
    res.json(displayedAppointments)
})

app.get('/appointments/:user_id', cors(), (req, res) => {
    console.log(req.params.user_id);
    res.json(displayedAppointments.filter(appointment => appointment.userId == req.params.user_id));
})

app.post('/appointments', cors(), (req, res) => {
    console.log(req.body);
    var appmt = req.body;
    displayedAppointments.push(appmt)
    res.status(200).send({ message: 'Appmt created!' });
})

app.get('/appointments/service', (req, res) => {
    res.json(mockAppointments)
})

app.get('/appointments/service/:id/:date_str', (req, res) => {
    var id = req.params.id;
    var date_from = new Date(req.params.date_str);
    var date_to = new Date(req.params.date_str)
    date_to.setDate(date_from.getDate() + 1);
    var secs_from = date_from.getTime()/1000;
    var secs_to = date_to.getTime()/1000;
    var appmts = displayedAppointments.filter(apt => apt["serviceId"]==id).filter(apt => (secs_from < apt["startAsTimestamp"] && apt["startAsTimestamp"] < secs_to));
    console.log("[APPMTS][get appmts for date] interval = ["+secs_from+" to "+secs_to+"] => "+appmts.length+" appointments found");
    res.json(appmts);
})

app.get('/appointments/service/:id', (req, res) => {
    id = req.params.id;
    res.json(displayedAppointments.filter(apt => apt["serviceId"]==id))
})


app.delete('/appointments/:id', (req, res) => {
    const appointmentIndex = displayedAppointments.findIndex(appointment => appointment.id == req.params.id);
    if(appointmentIndex != -1) {
        displayedAppointments.splice(appointmentIndex, 1);
        res.json(displayedAppointments);
    } else {
        res.status(404)
           .json(displayedAppointments);
    }
})

if (!module.parent) {
    app.listen(4000);
    console.log('Express started on port 4000');
}