const express = require('express');
const path = require('path');

const router = express.Router();



router.get('/', (req, res, next) => {
    const username = req.query.username;
    res.render('room.ejs', {
        korisnickoIme: username
    });
});






module.exports = router;