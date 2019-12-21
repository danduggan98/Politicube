// Server to host the Politicube site

//Set up express app
const express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

//Default page - redirects to home
app.get('/', (req, res) => {
    res.redirect('/home');
});

//Home page
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/html/' + 'home.html');
});

//Quiz page
app.get('/quiz', (req, res) => {
    res.sendFile(__dirname + '/html/' + 'quiz.html');
});

//User results page
app.get('/results', (req, res) => {
    res.sendFile(__dirname + '/html/' + 'results.html');
});

//Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Error 404 - Page Not Found');
    //Create a 404 page later
});

//Handle 500 errors
app.use((err, req, res, next) => {
    console.error(err.stack); //Log error details
    res.status(500).send('Error 500 - Internal Server Error');
    //Create 500 page later
});

//Server listens on port 3000
var port = 3000;
var server = app.listen(port, () => {
    console.log('Server listening on port', port);
});
