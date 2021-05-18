const {
    username
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true

});

const ime = document.getElementById("here");
ime.innerHTML = `Korisnik : ${username}`;
socket = io('http://localhost:3000/room');
myDiv = document.getElementById("33");
dugmici = [];


const dugmeNazad = document.getElementById("nazad");
dugmeNazad.addEventListener('click', () => {
    window.history.back();
});

/*  const privatna = document.getElementById("private");
    privatna.addEventListener('click', () => {
        var kod = prompt('Kreiraj 4-cifreni kod ');
        console.log(`${kod}`);
        socket.emit('createPrivate',kod);
        socket.on('createdPrivate',()=>{
            alert('kreirana soba');
            location.href = "http://localhost:3000/game/" + `${kod}`+  "/?username=" + `${username}`;

        })
    });*/

socket.on('room', (rooms, cur_room) => {
    var butonci = [];
    var i = rooms.length;
    //console.log(`soba ima ${i} trenurna soba je ${cur_room} i igraca ima ${rooms[cur_room].igraca}`)




    rooms.forEach(el => {
        var soba = el;
        console.log(`${soba}`)
        if (soba !== null) {

            var ostalo = soba.igraca;
            j = el.id;
            var boxj = document.getElementById("box" + j)
            console.log(`${soba.igraca}`);
            var inner = 'Soba ' + j + ' ' + soba.igraca + '/4';
            if (soba.igraca !== 4) {
                inner += '<button type="button" id="buton' + j + '" >Pridruzi se</button>';
            }

            if (boxj === null) {
                myDiv.innerHTML += '<div id="box' + j + '">' + inner + '</div>';
                //myDiv.innerHTML +='<div id="box'+j+'">Soba ' +j + '  '+  rooms[j].igraca+ '/4' +
                //'<button id="j">Pridruzi se</button>'+'</div>';
            } else {
                boxj.innerHTML = inner;
            }
        }
    });
    socket.on("updateRoom", (rooms, del_room) => {

        rooms.forEach(el => {
            var soba = el;
            console.log(`${soba}`)
            if (soba !== null) {

                var ostalo = soba.igraca;
                j = el.id;
                var boxj = document.getElementById("box" + j)
                console.log(`${soba.igraca}`);
                var inner = 'Soba ' + j + ' ' + soba.igraca + '/4';
                if (soba.igraca !== 4) {
                    inner += '<button type="button" id="buton' + j + '" >Pridruzi se</button>';
                }

                if (boxj === null) {
                    myDiv.innerHTML += '<div id="box' + j + '">' + inner + '</div>';
                    //myDiv.innerHTML +='<div id="box'+j+'">Soba ' +j + '  '+  rooms[j].igraca+ '/4' +
                    //'<button id="j">Pridruzi se</button>'+'</div>';
                } else {
                    boxj.innerHTML = inner;
                }
            } else {
                if (del_room !== -1) {
                    var boxNull = document.getElementById("box" + del_room);
                    if (boxNull !== null) {
                        boxNull.innerHTML = "";
                    }
                }
            }
        });


    });






    //Slusaj svaki klik na sajtu   
    var kod;
    document.addEventListener('click', function(event) {
        //ako neko zeli da se pridruzi sobi od postojecih
        /*for(let i =0;i<j;i++){
            if(event.target.id === 'buton'+i){
                console.log(`kliknuto je dugme ${i}`);
                location.href = "http://localhost:3000/game/"+ i +"/?username="+`${username}`;
            }
        }*/
        rooms.forEach(el => {
            if (el !== null) {
                if (event.target.id === 'buton' + el.id) {
                    console.log(`kliknuto je dugme ${i}`);
                    location.href = "http://localhost:3000/game/" + el.id + "/?username=" + `${username}`;
                }
            }
        });

        //ako zeli da napravi sobu
        if (event.target.id === "nova") {
            console.log('Pravim novu sobu');
            socket.emit('createRoom');
        }
        //ako zeli da napravi private sobu
        if (event.target.id === "private") {
            var kod = prompt('Kreiraj 4-cifreni kod ');
            console.log(`${kod}`);

            while (kod.length !== 4) {
                kod = prompt('Molim vas unesite 4-cifren broj sobe');
            }


            socket.emit('createPrivate', kod);

            socket.on('fobidCreatPrivat', () => {
                alert('Soba vec postoji');
            });

        }
        //ako zelimo da pristupimo private room-u
        if (event.target.id === "joinPrivat") {
            var kod = prompt('Unesite 4-cifrenu sifru za sobu');
            console.log(`${kod}`);
            socket.emit('JoinPrivate', kod);
            console.log('Emitovano je  join cekam private')

            socket.on('privateJoin', (yes, kod) => {
                console.log(`${yes} ${kod}`);
                if (yes === 0) {
                    alert('Soba ne postoji');
                } else {
                    location.href = "http://localhost:3000/game/p" + kod + "/?username=" + username;

                }
            });

        }

    });
});
socket.on('createdPrivate', (kod) => {
    alert('kreirana soba');
    kod = kod.replace(/"/g, '');
    kod = kod.replace(/"/g, '');
    kod1 = parseInt(kod, 10);
    console.log(`${kod1}   a ovo je ${kod}`)
    location.href = "http://localhost:3000/game/" + 'p' + `${kod1}` + "/?username=" + `${username}`;

})
socket.on('createdRoom', (roomid) => {
    alert('Soba je uspesno kreirana ' + `${roomid}`);
    location.href = "http://localhost:3000/game/" + roomid + "/?username=" + `${username}`;
});


socket.on('check', live => {
    live = live.replace(/\\/g, "");
    live = live.replace(/"/g, "");
    console.log('Primih check ' + `${username}` + ` live ${live}`);
    if (username == live) {
        alert("Vec ste u sobi");
        location.href = "http://localhost:3000/login"
    }
});