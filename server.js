var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser')
    exphbs = require('express-handlebars');

//mongoose 
var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/mongonews');

mongoose.Promise = Promise;


//handlebars to handle our views
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//serve up static files
app.use(express.static(__dirname + '/public'));

//set home route
app.get('/', function (req, res) {
    res.redirect('/articles')
    // res.render('home');
});

app.get('/saved', function(req, res){
    res.render('savedArticles')
})

//require in contoller
require('./controllers/articlesController.js')(app)
//

//spool server
app.listen(port, function () {
    console.log(`app is running on port ${port}`)
});