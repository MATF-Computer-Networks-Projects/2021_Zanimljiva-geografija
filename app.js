const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login');
const gameRoutes = require('./routes/game');
const roomRoutes = require('./routes/room');
const signupRoutes = require('./routes/signup');
const lobbyRoutes = require('./routes/lobby');
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

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
app.use('/signup', signupRoutes);
app.use('/lobby', lobbyRoutes);


app.use(bodyParser.json());
app.use(function(error, req, res, next) {
    console.error(error.stack);


    res.status(error.status || 500).json({
        errorMessage: error.message
    });
});
app.post('/api/register', async(req, res) => {
    const { username, password: plainTextPassword } = req.body

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Neispravno korisnicko ime' })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Neispravna lozinka' })
    }

    if (plainTextPassword.length < 5) {
        return res.json({
            status: 'error',
            error: 'Sifra nedovoljno dugacka. Mora se sastojati od bar 6 karaktera.'
        })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        const response = await User.create({
            username,
            password
        })
        console.log('Korisnik je uspresno ubacen u bazu: ', response)
    } catch (error) {
        if (error.code === 11000) {
            
            return res.json({ status: 'error', error: 'Postoji korisnik sa takvim korisnickim imenom.' })
        }
        throw error
    }

    res.json({ status: 'ok' })
})
app.post('/api/login', async(req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).lean()

    if (!user) {
        return res.json({ status: 'error', error: 'Neispravno korisnicko ime/lozinka' })
    }

    if (await bcrypt.compare(password, user.password)) {
        
        const token = jwt.sign({
                id: user._id,
                username: user.username
            },
            JWT_SECRET
        )

        return res.json({ status: 'ok', data: token })
    }

    res.json({ status: 'error', error: 'Neispravno korisnicko ime/lozinka' })
})


module.exports = app