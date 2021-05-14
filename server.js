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
//konekcija socketa na /game
SocGames.on('connection', socket => {
    console.log('Konekcija uspesna ');


    //kada nas klijent obavesti o pridruzivanju u igru sa argumentima
    socket.on('joinGame', (username,rumNum,private) => {
        //provera vrednosti private
        console.log(`soba privatna ${private} `);
        //parsiranje zbog JSON.strignfy
        private = parseInt(private,10);
        rumNum = parseInt(rumNum,10);
        
        //deo za pravljenje sobe
        //proveravanje da li se pravi privatna soba ili regularna naravno ukoliko takva ne postoji
        //pri postojanju sobe ovi delovi ce biti preskoceni
    
        if(private === 0){
            room = rooms[rumNum];
            if (room === null || room.isFull()) {
                //console.log(`${room.id} je puna , pravim novu sobu.`);
                    room = new Room(rumNum);
                    rooms[rumNum] = room;
                    cur_room = rumNum;
                    //visak
                    //socket.emit('login', cur_room);
                    id++;
                    console.log(`Nova soba je ${room.id}`);
        }

    }
        else{
            console.log('Ovde sam');
            room = privateRooms[rumNum];
            if(room === undefined){
                room = new Room(rumNum);
                privateRooms[rumNum] = room;
                console.log('Napravljena privatna soba');
        }
            if(room.isFull()){
                socket.emit('privateFull');
            }
        }
        
        console.log(`${room.roomName} ${room.igraca}`)
        

        //funckionalnost dodavanja igraca konkretnoj sobi i ispisivanje u konzoli potrebnih informacija
        playerid = room.firstEmptyPlace();
        const player = new Player(socket.id, username, 0, playerid);
        console.log(`Prvo slobodno mesto u sobi je ${room.firstEmptyPlace()}`);
        player.setPlayercurrRoom(room.getRoomId());
        room.sitDown(player);
        console.log(`soba ima ${room.igraca} igraca`);
        console.log(`dodat je igrac ${player.username} sa id treda ${player.socketId} i povecan mu je id ${player.id} a id sobe mu je ${player.current_room}`);
        
        //deo koji dodaje trenutne live igrace koji sede
        //funkcionalnost koja je potrebna da ne bi dozvolili da jedan isti igrac udje u 2 sobe 
        br = room.id*10+playerid;
        liveplayers[br] = username;
        console.log(`${liveplayers[br]}`);
        console.log('Saljem check');


        //emitovanje check radi provere za ovo iznad
        SocLobby.emit('check',JSON.stringify(username));
        SocRooms.emit('check',JSON.stringify(username));


        console.log(`${socket.id} se pridruzuje sobi soketa ${room.roomName}`);
        socket.join(room.roomName);
        const players = room.getPlayers();
        socket.emit('setPlayer', players, room.id, playerid, room, players.length);
        console.log('Saljem za apdejt');

        //update koji se mora odraditi u svim klijentima u sobi gde je igrac seo
        io.of('/game')
            .to(room.roomName).emit('update', playerid, player.getPlayerUsername());
        console.log(`Trenutna soba koju saljem ima ${room.igraca} a to je soba${cur_room}`)
        //update za broj igraca koji su u odredjenim sobama
        io.of('/room')
            .emit('room',rooms,cur_room);


        //pocetak igre za igrace
        socket.on('startGame', (brRundi) => {
            brojRundi = brRundi;
            console.log(`Treba da bude odigrano ${brRundi}`);

            karakteri = ['A', 'B', 'V', 'G', 'D', 'E', 'Z', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'C', 'Č', 'Š']
            randomChar = karakteri[Math.floor(Math.random() * karakteri.length)];
            timer = new Timer(480000);
            console.log(`${timer.format()}`);

            for (p of players) {
                console.log(`${room.id}`);
                io.of('/game')
                    .to(p.socketId).emit('starting', p, randomChar, timer, geos);
                console.log('Igra pocinje  za igraca ' + `${p.username}`);
            }

        });

        //brojanje poena igraca
        socket.on('calculatePoints', ({ dataVal, plId, randChar1 }) => {
            console.log(`ja sam igrac ${plId}`);

            brPoslatih++;
            io.of('/game')
                .to(room.roomName).emit('stopTime', brPoslatih);
            console.log(`Br poslatih je ${brPoslatih}\n`);
            for (p of players) {
                if (p.id === plId) {
                    p.drzava = dataVal[0];
                    p.grad = dataVal[1];
                    p.reka = dataVal[2];
                    p.planina = dataVal[3];
                }
            }
            if (brPoslatih === 1) {
                timer1 = new Timer(60000)
                console.log(`${timer1.format()}`);
                io.of('/game')
                    .to(room.roomName).emit('hurryUp', timer1);

            }
            if (brPoslatih === 4) {
                brZavrsenih++;
                for (i = 0; i < 4; i++) {
                    console.log(`${i+1}.igrac ${players[i].username}`);
                    var randChar = randomChar;
                    for (j = 0; j < 4; j++) {
                        if (j != i) {
                            if (players[i].drzava === players[j].drzava && (players[i].drzava !== "" || players[j].drzava !== "") && geos[randChar].Drzava.includes(players[i].drzava) && geos[randChar].Drzava.includes(players[j].drzava)) {
                                players[i].drzavaScore = 10;
                                players[j].drzavaScore = 10;
                                players[i].drzavaChecked = true;
                                players[j].drzavaChecked = true;
                            }
                            if (players[i].grad === players[j].grad && players[i].grad !== "" && players[j].grad !== "" && geos[randChar].Grad.includes(players[i].grad) && geos[randChar].Grad.includes(players[j].grad)) {
                                players[i].gradScore = 10;
                                players[j].gradScore = 10;
                                players[i].gradChecked = true;
                                players[j].gradChecked = true;
                            }
                            if (players[i].reka === players[j].reka && players[i].reka !== "" && players[j].reka !== "" && geos[randChar].Reka.includes(players[j].reka) && geos[randChar].Reka.includes(players[i].reka)) {
                                players[i].rekaScore = 10;
                                players[j].rekaScore = 10;
                                players[i].rekaChecked = true;
                                players[j].rekaChecked = true;
                            }
                            if (players[i].planina === players[j].planina && players[i].planina !== "" && players[j].planina !== "" && geos[randChar].Planina.includes(players[j].planina) && geos[randChar].Planina.includes(players[i].planina)) {
                                players[i].planinaScore = 10;
                                players[j].planinaScore = 10;
                                players[i].planinaChecked = true;
                                players[j].planinaChecked = true;
                            }

                        }
                    }

                }
                for (i = 0; i < 4; i++) {
                    if (!players[i].drzavaChecked && players[i].drzava !== "" && geos[randChar].Drzava.includes(players[i].drzava)) {
                        players[i].drzavaScore = 15;
                    }
                    if (!players[i].gradChecked && players[i].grad !== "" && geos[randChar].Grad.includes(players[i].grad)) {
                        players[i].gradScore = 15;
                    }
                    if (!players[i].rekaChecked && players[i].reka !== "" && geos[randChar].Reka.includes(players[i].reka)) {
                        players[i].rekaScore = 15;
                    }
                    if (!players[i].planinaChecked && players[i].planina !== "" && geos[randChar].Planina.includes(players[i].planina)) {
                        players[i].planinaScore = 15;
                    }


                }
                for (i = 0; i < 4; i++) {
                    if (players[i].drzava === "" || !geos[randChar].Drzava.includes(players[i].drzava)) {
                        players[i].drzavaScore = 0;
                    }
                    if (players[i].grad === "" || !geos[randChar].Grad.includes(players[i].grad)) {
                        players[i].gradScore = 0;
                    }
                    if (players[i].reka === "" || !geos[randChar].Reka.includes(players[i].reka)) {
                        players[i].rekaScore = 0;
                    }
                    if (players[i].planina === "" || !geos[randChar].Planina.includes(players[i].planina)) {
                        players[i].planinaScore = 0;
                    }


                }


                for (i = 0; i < 4; i++) {
                    console.log(`Ukupan skor igraca ${i+1} je ${players[i].getTotalScore()}`);
                    console.log("" + players[i].drzava + " " + players[i].drzavaScore);
                    console.log(players[i].grad + " " + players[i].gradScore);
                    console.log(players[i].reka + " " + players[i].rekaScore);
                    console.log(players[i].planina + " " + players[i].planinaScore);

                }
                if (brZavrsenih < brojRundi) {
                    randomChar = karakteri[Math.floor(Math.random() * karakteri.length)].toUpperCase();
                    for (p of players) {
                        p.drzavaChecked = false;
                        p.gradChecked = false;
                        p.rekaChecked = false;
                        p.planinaChecked = false;
                        console.log(`${room.id}`);
                        io.of('/game')
                            .to(p.socketId).emit('starting', p, randomChar, timer);
                        console.log('Nova runda pocinje za igraca ' + `${p.username}`);
                    }

                }

            }



        });

    });
    //handler za izlazak iz sobe 
    socket.on('disconnect', () => {

        //console.log(`${socket.id} is leaving room ${room.roomName}`);
        console.log(`leaving  ${room.id} `);
        console.log(`${room.roomName}`);
        var leaverid = room.findLeaver(socket.id);
        
        room.standUp(leaverid);
        
        br = room.id*10+leaverid;
        liveplayers[br] = "none";
        del_room = -1;
        //brisanje igraca
        //if(room.igraca === 0){
          //  console.log(`Brisem sobu ${room.id}`);
            //rooms[room.id] = undefined;
            //del_room = room.id;
            //
        //}
        
        socket.leave();
        console.log(`${leaverid}`);
        io.of('/game')
            .to(room.roomName).emit('update', leaverid, 'none');
        io.of('/room')
            .emit('updateRoom',rooms,del_room);
        
    });


});








server.once('listening', function() {
    console.log(`Server started on http://localhost:${port}/login`);
});