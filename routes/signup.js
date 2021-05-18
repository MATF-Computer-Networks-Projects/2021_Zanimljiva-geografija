const express = require('express');
const path = require('path');
const User = require('../models/user');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();



mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
router.get('/', function(req, res, next) {
    res.render('signup.ejs', {});

});


module.exports = router;