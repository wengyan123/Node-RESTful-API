// ===================================================
// Base Setup
// ===================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// configure app to user bodyParser()
// this wil let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//ser server port
var port = process.env.PORT || 8080

// connect to mongo db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/RestfulAPI')
var Bear = require('./app/models/bear');

// ===================================================
// Routes For Our API
// ===================================================
// get an instance of the express Router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    // make sure we go to the next routes and don't stop here
    next();
});

// routes
router.get('/', function (req, res) {
    res.json({message: 'Hello! Welcome to our api!'});
});

router.route('/bears')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function (req, res) {
        // create a new instance of the Bear model
        var bear = new Bear();
        // set the bears name ( comes from the request)
        bear.bear_id = req.body.id;
        bear.bear_name = req.body.name;
        // save the bear and check for errors
        bear.save(function (err) {
            if (err)
                res.send(err);
            res.json({message: 'Bear created'});
        });
    })
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function (req, res) {
        Bear.find(function(err, bears){
            if (err)
                res.send(err);
            res.json(bears)
        });
    });

router.route('/bears/:bear_id')
    // get the bear with bear_name (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function (req, res) {
        Bear.findOne({
            bear_id : req.params.bear_id
        }, function (err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })
    // update the bear with bear_name (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function (req, res) {
        // use our bear model to find the bear we want
        Bear.findOne({
            bear_id: req.params.bear_id
        }, function (err, bear) {
            if (err)
                res.send(err);
            // update the bears info
            bear.bear_name = req.body.name
            // save the bear
            bear.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'Bear updated!'});

            });
        });
    })
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function (req, res) {
        Bear.remove({
            bear_id: req.params.bear_id
        }, function (err, bear) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted!'});
        });
    });

// register our routes
// all of our routes will be prefixed with /api
app.use('/api', router);

// ===================================================
// Start the server
// ===================================================
app.listen(port)
console.log(' Server listening on port ' + port);
