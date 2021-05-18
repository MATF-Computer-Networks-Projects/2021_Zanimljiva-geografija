const express = require('express');
const path = require('path');

const router = express.Router();

router
    .route("/:gameid/")
    .get((req, res, next) => {
        const username = req.query.username;
        res.render('game.ejs', {});
    });

module.exports = router;