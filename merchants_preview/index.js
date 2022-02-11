/**
 * Module dependencies.
 */
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

let mockMerchants = [
    {
      "name": "Mama of Africa",
      "address": {
        "street": "Hauptstraße",
        "number": 10,
        "postalCode": "35390",
        "city": "Gießen"
      },
      "category": 1,
      "id": "d3bc94e8-16ca-4d2e-a711-0ee3e1e42856",
      "headerImage": "",
      "icon": "https://mama-africa.net/wp/wp-content/uploads/2017/07/mama-africa-logo-face.jpg",
      "description": "",
      "rating": 4.82
    },
    {
      "name": "Pizzeria Stern",
      "address": {
        "street": "Hauptstraße",
        "number": 10,
        "postalCode": "35390",
        "city": "Gießen"
      },
      "category": 1,
      "id": "b8082774-ebe2-4aa6-8572-53aa9550b5c2",
      "headerImage": "",
      "icon": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/logo-pizza-design-template-8329a51d86709c07def8a222d93138ea_screen.jpg",
      "description": "",
      "rating": 3.08
    },
    {
      "name": "Zahnarzt Franke",
      "address": {
        "street": "Hauptstraße",
        "number": 10,
        "postalCode": "35390",
        "city": "Gießen"
      },
      "category": 2,
      "id": "2ad7dab6-aef6-4a99-9047-8f29182306c1",
      "headerImage": "",
      "icon": "https://t4.ftcdn.net/jpg/03/02/68/11/360_F_302681154_9HOWdvGLtCKpfwO5B85yESszG7MfmlUl.jpg",
      "description": "",
      "rating": 2.45
    },
    {
      "name": "LaserTagShack",
      "address": {
        "street": "Hauptstraße",
        "number": 10,
        "postalCode": "35390",
        "city": "Gießen"
      },
      "category": 3,
      "id": "b2fe27a3-377b-46f8-89d1-8f0a9be2b011",
      "headerImage": "",
      "icon": "https://previews.123rf.com/images/vasilyrosca/vasilyrosca1612/vasilyrosca161200091/68591072-laser-tag-zielspielplakat-flyer-vector-lasertag-banner-f%C3%BCr-spa%C3%9F-party-ziel-geschossen-plakat-.jpg",
      "description": "",
      "rating": 4.1
    },
    {
      "name": "The Barber Shop",
      "address": {
        "street": "Hauptstraße",
        "number": 10,
        "postalCode": "35390",
        "city": "Gießen"
      },
      "category": 4,
      "id": "bdbf77cf-839d-4ddf-a773-97b69496dbb2",
      "headerImage": "",
      "icon": "https://i.pinimg.com/originals/04/0e/d9/040ed98defb52539c6ef68703fbde157.png",
      "description": "",
      "rating": 1.9
    },
    {
      "name": "Bowling Valley",
      "address": {
        "street": "Hauptstraße",
        "number": 10,
        "postalCode": "35390",
        "city": "Gießen"
      },
      "category": 3,
      "id": "a9c470e7-ca39-4fe8-b56c-00c344ec6865",
      "headerImage": "",
      "icon": "https://img.freepik.com/vektoren-kostenlos/bowling-logo-etiketten-abzeichen_266639-32.jpg?size=338&ext=jpg",
      "description": "",
      "rating": 3.7
    },
  ]

/**
 * GET index.
 */

app.get('/', function(req, res){
  res.send('Visit /merchants or /merchants/<merchant_id>');
});

/**
 * GET :user.
 */
app.get('/merchants', cors(), function(req,res) {
  res.json(mockMerchants)
})

app.get('/merchants/:merchant_id', function(req, res, next){
  merchant = mockMerchants.find((merchant) => merchant.id == req.params.merchant_id)
  if(merchant) {
    res.json(merchant);
  } else {
    res.status(404).end();
  }
});

app.post('/merchants', function(req,res) {
    console.log(req.body);
    mockMerchants = [...mockMerchants, req.body];
    res.end();
})



if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}