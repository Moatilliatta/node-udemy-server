const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// Middleware. 
// IMPORTANT NOTE: It appears as the code is being read.
app.use((req, res, next) => {
	res.render('maintenance.hbs');
});


app.use(express.static(__dirname + '/public'));

// IMPORTANT NOTE: when using hbs templates, it is necessary
// to use on nodemon
// nodemon server.js -e js,hbs
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.set('view engine', 'hbs');
app.engine('hbs', require('hbs').__express);

// Middleware.
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;

	console.log(log);
	fs.appendFile('server.log', log + '\n', (errorMessage) => {
		console.log(`errorMessage: ${errorMessage}`);
	});
	next();
});

app.get('/', (req, res) => {
	res.render('home.hbs',{
		pageTitle: 'My HOME Page Title',
		name: 'Edgar'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'My Page Title'
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'This will EVER be wrong!'
	});
});

app.listen(3000);