const express = require('express');
const path = require('path');

const router = express.Router();

/*router.get('/', function(req, res, next) {
    const username = req.query.username;
    res.render('game.ejs', {
        korisnickoIme: username}
    );

});
*/
//localhost:3000/game/:gameid/?username=username
router
    .route("/:gameid/")
    .get((req, res, next) => {
        const username = req.query.username;
        res.render('game.ejs', {});
    });

module.exports = router;