const http = require('http');
const express = require('express');
let socketio = require('socket.io');
const Room = require('./models/room');
const Player = require('./models/player');
const Timer = require('./models/timer');

const User = require('./models/user');
const mongoose = require('mongoose');

const port = 3000;

const app = require('./app');

const { path } = require('./app');
const { disconnect } = require('process');
//pokretanje servera 

const server = http.createServer(app);

server.listen(port);

const io = socketio(server);
//globalne promenljive koriscene u kodu 
let id = 0;
let rooms = [];
for(var k=0;k<50;k++){
    rooms.push(null);
}
let room = new Room(0);
rooms[0] = room;
id++;
// indeks trenutne sobe
cur_room = 0;
var brPoslatih = 0;
var brZavrsenih = 0;
let liveplayers = [];


//ubacivanje json fajla za ispitivanje tacnosti odgovora
const fs = require('fs');
const { RSA_PKCS1_PADDING } = require('constants');
const { parse } = require('path');
let data = fs.readFileSync('./Pojmovi.json');
let geos = JSON.parse(data);

var randomChar;

//socket-promenljive koje regulisu slusanje odredjenih "namespace"-ova 
var SocLogins = io.of("/login");
var SocGames = io.of("/game");
var SocRooms = io.of("/room");
var SocSignup = io.of("/signup");
var SocLobby=io.of("/lobby");




server.once('listening', function() {
    console.log(`Server started on http://localhost:${port}/login`);
});