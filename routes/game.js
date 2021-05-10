const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', function(req, res, next) {
    const username = req.query.username;
    res.render('game.ejs', {
        korisnickoIme: username
    })
})


module.exports = router;