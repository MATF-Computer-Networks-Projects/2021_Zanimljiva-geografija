const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login');
const gameRoutes = require('./routes/game');
const roomRoutes = require('./routes/room');
const signupRoutes = require('./routes/signup');
const lobbyRoutes= require('./routes/lobby');

const User = require('./models/user');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/login-app-db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname + '/public')));
app.use('/login', loginRoutes);
app.use('/game', gameRoutes); 
app.use('/room', roomRoutes);
app.use('/signup',signupRoutes);
app.use('/lobby',lobbyRoutes);



app.use(function(error, req, res, next) {
    console.error(error.stack);


    res.status(error.status || 500).json({
        errorMessage: error.message
    });
});



module.exports = app

