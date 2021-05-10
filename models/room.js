let numOfRooms = require('../numOfRooms');
const Player = require('./player');


class Room {

    constructor(id) {
        this.players = [new Player(-1, 'none', 0, 0), new Player(-1, 'none', 0, 1), new Player(-1, 'none', 0, 2), new Player(-1, 'none', 0, 3)];
        this.indik = [false, false, false, false];
        this.id = id;
        this.roomName = "Game" + this.id;
        this.full = this.isFull();
        this.igraca = 0;
    }
    getRoomId() {
        return this.id;
    }
    getPlayers() {
        return this.players;
    }
    getIndik() {
        return this.indik;
    }
    firstEmptyPlace() {
        var i;
        for (i = 0; i < 4; i++) {
            if (this.indik[i] === false) {
                return i;
            }

        }
        return -1;
    }
    findLeaver(socketId) {
        var player;
        for (var i = 0; i < 4; i++) {
            player = this.players[i];
            if (player.getSocketId() === socketId) {
                return player.getPlayerID();
            }

        }
        return -1;
    }
    sitDown(player) {
        this.igraca++;
        this.players[player.id] = player;
        this.setIndikTrue(player.id);
    }
    standUp(id) {
        this.igraca--;
        if (this.igraca < 0) {
            this.igraca = 0;
        }
        this.players[id] = new Player(-1, 'none', id);
        this.setIndikFalse(id);
    }

    isFull() {
        var i;
        if (this.igraca === 4) {
            return true;
        }
        return false;
    }
    setIndikTrue(i) {
        this.indik[i] = true;
    }
    setIndikFalse(i) {
        this.indik[i] = false;
    }
}

module.exports = Room;