var express = require("express");
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = 8000;

// Integrate body-parser with our App
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, '/static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, '/views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/Pet_mongoose');
mongoose.Promise = global.Promise;
var PetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    color: {
        type: String,
        required: true,
        minlength: 1
    },
    age: {
        type: Number,
        min: 1,
        max: 30
    }

}, {
    timestamps: true
});
mongoose.model('Pet', PetSchema); // We are setting this Schema in our Models as 'Pet'
var Pet = mongoose.model('Pet'); // We are retrieving this Schema from our Models, named 'Pet'

app.get('/', function (req, res) {
    Pet.find({}, function (err, results) {
        if (err)
            console.log("Eroor matching DB");
        else
            res.render('index', {
                pet: results
            });
    });
});

app.get('/new', function (req, res) {
    res.render('new');
});
// Add Pet Request 
app.post('/', function (req, res) {
    var pet = new Pet(req.body);
    pet.save(function (err) {
        if (err) {
            res.render('new', {
                title: 'you have errors!',
                errors: pet.errors
            });
        } else {
            res.redirect('/');
        }
    });
});

app.get('/show/:id', function (req, res) {
    Pet.find({
        _id: req.params.id
    }, function (err, pet) {
        if (err) {
            console.log(err);
        } else {
            res.render('show', {
                pet: pet[0]
            });
        }
    });
});

app.post('/:id/edit/', function (req, res) {
    Pet.find({
        _id: req.params.id
    }, function (err, pet) {
        if (err) {
            console.log(err);
        } else {
            res.render('edit', {
                pet: pet[0]
            });
        }
    });
});
app.post('/pets/:id', function (req, res) {
    Pet.update({
        _id: req.params.id
    }, req.body, function (err, pet) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.post('/:id/destroy', function (req, res) {
    Pet.remove({
        _id: req.params.id
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});
app.listen(port, function () {
    console.log("listening on port 8000");
});