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

//prijem konekcija prilikom konektovanja u /lobby
SocLobby.on('connection',socket=>{
    //proveravanje da li je soba trenutna puna, zbog funkcionalsti pridruzi se nasumicnoj sobi
    cur_tmp = cur_room;
    if(rooms[cur_room].isFull()){
            cur_tmp++;
    }
    socket.emit('welcomeTolobby',cur_tmp);
})


//prijem konekcija na /signup koja ce emitovati da registracija zapocne
SocSignup.on('connection' , socket => {
    socket.emit('register');
});
//prijem konekcije na /login poruka u konzoli i provera da li je korisnik vec u listi liveplayers ondosno da li je vec seo u sobu
SocLogins.on('connection', socket => {
    socket.emit('login');
    console.log('Logovanje');
    found=0;
    allow = 1;
    socket.on('logTry',(username) => {
        var username1 = JSON.stringify(username);
        liveplayers.forEach(el => {
            if(el == username1){
                console.log(`Postoji covek`)
                allow =0;  
            }

        })
        
        socket.emit("allowance",allow);
        

    })
    
});





server.once('listening', function() {
    console.log(`Server started on http://localhost:${port}/login`);
});