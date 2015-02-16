var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://test:tester@novus.modulusmongo.net:27017/ivadi9Ry');
var Bear = require('./app/models/bear');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; 
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Request is being made');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/bears')
	.post(function(req, res){
		var bear = new Bear();
		bear.name = req.body.name;
		bear.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Bear created!' });
        	})
		})
	.get(function(req, res){
		Bear.find(function(err, bears) {
            if (err)
                res.send(err);
            res.json(bears);
        });
    });


router.route('/bears/:bear_id')
 .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

.put(function(req, res) {
        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })

.delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

router.get('/', function(req, res){
	res.json({ message: 'hooray! welcome to our api!' });
});


app.use('/api', router);

app.get('/', function(req, res){
	res.send('welcome to the api server');
});

app.listen(port);
console.log('Magic happens on port ' + port);