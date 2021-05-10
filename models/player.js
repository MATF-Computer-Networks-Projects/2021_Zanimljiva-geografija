let id = require('../playerId');
class Player {
    constructor(socketId, username, score, id) {
        this.socketId = socketId;
        this.username = username;
        this.id = id;
        this.drzava = "";
        this.grad = "";
        this.reka = "";
        this.planina = "";
        this.drzavaChecked = false;
        this.gradChecked = false;
        this.rekaChecked = false;
        this.planinaChecked = false;
        this.drzavaScore = 0;
        this.gradScore = 0;
        this.rekaScore = 0;
        this.planinaScore = 0;
        this.totalScore = 0;
        this.full = false;
        this.current_room = -1;
    }
    getSocketId() {
        return this.socketId;
    }
    getPlayerUsername() {
        return this.username;
    }
    getPlayerID() {
        return this.id;
    }
    getTotalScore() {
        let totalScore = this.drzavaScore + this.gradScore + this.rekaScore + this.planinaScore;
        return totalScore;
    }

    setPlayercurrRoom(idroom) {
        this.current_room = idroom;
    }

}

module.exports = Player;