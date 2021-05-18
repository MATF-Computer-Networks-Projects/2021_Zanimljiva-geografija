$(document).ready(function() {
    $('#usermsg').keypress(function(e) {
        if (e.keyCode == 13) {
            $('#submitmsg').click();
            e.preventDefault();
        }
    });
});

function format(gam) {
    var time = gam;
    seconds = Math.floor((time / 1000) % 60),
        minutes = Math.floor((time / (1000 * 60)) % 60),
        hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    var formattedTime = "";
    if (hours > 0 && hours < 10) {
        formattedTime += "0" + hours + ":";
    } else if (hours >= 10) {
        formattedTime += hours + ":";
    }

    if (minutes < 10) {
        formattedTime += "0" + minutes + ":";
    } else {
        formattedTime += minutes + ":";
    }

    if (seconds < 10) {
        formattedTime += "0" + seconds;
    } else {
        formattedTime += seconds;
    }

    return formattedTime;
}







const {
    username
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true

});

var mq = window.matchMedia("(max-width: 570px)");


duzina = location.pathname.length;
str = location.pathname.substring(6, duzina);
const regex2 = /^p/;
var rumNum;
var private;

//provera privatnosti sobe po linku
if (regex2.exec(str) === null) {
    console.log('nije privatna')
    private = 0;
    console.log(`Obican string: ${str}`)
    str1 = str.replace(/\//g, "");
    console.log(` Pazi ovaj sad ${str1}`)
    rumNum = parseInt(str1, 10);
    console.log(`broj neprivate ${rumNum}`)

} else {
    console.log('privatna')
    private = 1;
    str1 = str.substring(1, str.length);
    rumNum = parseInt(str1, 10);
    console.log(`rumnum ${str} a drugi string ${str1}`);
}

//tek krece slusanje
const socket = io("http://localhost:3000/game");
var roomG;
console.log(`broj sobe  je ${rumNum}`)
socket.emit('joinGame', JSON.stringify(username), JSON.stringify(rumNum), JSON.stringify(private));
socket.on('privateFull', () => {
    alert('Soba je puna');
    location.href = "http://localhost:3000/room?username=" + username;
})
var sumPl = 0;

var idpl;
var idroom;
var players;
var n;
socket.on('setPlayer', (players, idroom, idpl, room, n) => {
    var i;
    roomG = room;
    var mq = window.matchMedia("(max-width: 570px)");
    if (mq.matches) {

        console.log("Usao sam");

        for (i = 0; i < 4; i++) {
            if (i != idpl) {
                console.log(i);
                console.log("Id igraca kojeg trebam promeniti je " + i);
                plhid = "player" + i;
                var hidpl = (document.getElementsByClassName(plhid))[0];
                hidpl.style.display = "none";
                hidpl.style.marginLeft = '0';
                hidpl.style.marginRight = '0';
                //hidpl.style.margin = '0';
                hidpl.style.padding = '0';


            } else {
                plhid = "player" + i;
                var table0 = (document.getElementsByClassName("table0"))[0];
                table0.style.width = "250px";
                var hidpl = (document.getElementsByClassName(plhid))[0];
                hidpl.style.width = 'fit-content';
                hidpl.style.marginLeft = '0';
                hidpl.style.marginRight = '0';
                //hidpl.style.margin = '0';
                hidpl.style.padding = '0';
                //send = "send" + i;
                //document.getElementById(send).style.marginRight = "250px";
                document.getElementById("posalji").style.marginLeft = "427px";
                document.getElementById("posalji").style.marginRight = "0px";
                document.getElementById("slovo").marginLeft = '0';
                document.getElementById("slovo").padding = '0';
                //tbl = document.getElementsByName("table")
                //tbl.style.width = "100%";
                //document.body.style.width = 'auto';
                var plejer = (document.getElementsByClassName("main1"))[0];
                plejer.style.backgroundColor = "darkslategray";
                //plejer.classList.remove("main1");


            }
        }
        var column2 = (document.getElementsByClassName("column2"))[0];
        column2.classList.add("column2new");
        column2.classList.remove("column2");

        var wrapper = document.getElementById("wrapper");
        wrapper.style.width = '100%';


    } else {
        console.log('Zeznuo si se brate');
    }
    for (var j = 0; j < 4; j++) {
        if (j !== idpl) {
            var dug = document.getElementById("send" + j);
            dug.style.visibility = "hidden";
        }
    }
    console.log(`${idpl}`)
    let roomH1 = document.getElementById('soba');
    roomH1.innerHTML += `:${idroom}`;
    for (pl of players) {
        console.log(`${pl}`)
        let atr = document.getElementById(`${pl.id}`);
        atr.innerHTML = "" + pl.username + " " + pl.id;
    }
    socket.on('update', (playerId, playerUsername, room) => {
        roomG = room;
        console.log(`primio sam update za ${playerUsername} i igraca imam ${roomG.igraca}`);

        if (playerUsername === 'none') {
            console.log('Jedan manje');
            sumPl--;
        } else {
            sumPl++;
            console.log('Jedan vise');
        }
        console.log(`${playerId}`);
        atr = document.getElementById(`${playerId}`);
        //atr.innerHTML = "" + playerUsername + `${idroom}` + "";
        atr.innerHTML = "" + playerUsername + playerId;
    });
    socket.on('WelcomeMessage', (playerUsername, message) => {
        const chatBox = document.getElementById("chatbox");
        console.log(playerUsername);
        console.log(message);
        const p = document.createElement('p');
        p.innerHTML = "<div class='msgln' style='color:black'> <b class='user-name'>" + "ChatBot" + "</b> " + playerUsername + " " + message + "<br></div>";
        chatBox.appendChild(p);

    });

    socket.on('DisconnectMessage', (playerUsername, message) => {
        const chatBox = document.getElementById("chatbox");
        console.log(playerUsername);
        console.log(message);
        const p = document.createElement('p');
        p.innerHTML = "<div class='msgln' style='color:black'> <b class='user-name'>" + "ChatBot" + "</b> " + playerUsername + " " + message + "<br></div>";
        chatBox.appendChild(p);

    });
    const r_button = document.getElementById("return");


    r_button.addEventListener('click', function() {
        console.log(`${idroom}`);

        window.history.back();

    });



    console.log(`${idpl}`);
    var brRundi;
    if (idpl === 0) {
        let send = document.getElementById("posalji");
        send.innerHTML = `<button type="button" id="start" style="margin-left: auto;margin-right: auto;">Zapocni igru</button> `
        brRundi = 3;
    }



    /* if (idpl == 0) {
            let send = document.getElementById("posalji");
            send.innerHTML = `<button type="button" id="start" style="margin-left: auto;margin-right: auto;">Zapocni igru</button>`;
        }*/


    const dugme = document.getElementById("start");


    if (dugme !== null) {


        dugme.addEventListener('click', function() {
            //ako nije puna soba alert ako jeste emituj

            if (roomG.igraca === 4) {
                socket.emit('startGame', brRundi, roomG);
            } else {
                alert('Soba nije puna ! ima' + `${roomG.igraca}`);
            }

        });
    } else {
        console.log("Nema dugmeta")
    }

    socket.on('endGame', () => {
        if (idpl === 0) {
            document.getElementById("start").style.visibility = "visible";

        }
    })
    socket.on('starting', (pl, RandChar, timer, geos, brZavrsenih, brRundi) => {
        if (brZavrsenih === 0) {
            if (idpl === 0) {
                dug = document.getElementById("start");
                start.style.visibility = "hidden";

            }
        }
        socket.on('NumOfPoints', (plejz) => {
            for (p of plejz) {
                const usr = document.getElementById(`${p.id}`);
                usr.innerHTML = `${p.username} ${p.id} ${p.totalScore}`;

            }
        });
        const runda = document.getElementById("runde");
        brZavrsenih = brZavrsenih + 1;
        runda.innerHTML = `Runda/Ukupno: ${brZavrsenih}/${brRundi}`;
        const potvrdi = document.getElementById(`send${pl.id}`);
        var timeClock = document.getElementById("vreme");
        timeClock.innerHTML = ``;
        //setInterval 8 min- kasnije
        potvrdi.disabled = false;
        console.log(`${timer.endTime}`);
        let slovo = document.getElementById(`slovo`);
        slovo.innerHTML = RandChar;
        let drzava = document.getElementById(`drzavaInput${pl.id}`);
        drzava.value = "";
        drzava.removeAttribute("readonly");
        let grad = document.getElementById(`gradInput${pl.id}`);
        grad.value = "";
        grad.removeAttribute("readonly");
        let reka = document.getElementById(`rekaInput${pl.id}`);
        reka.value = "";
        reka.removeAttribute("readonly");
        let planina = document.getElementById(`planinaInput${pl.id}`);
        planina.value = "";
        planina.removeAttribute("readonly");

        plId = pl.id;

        var isSend = false;
        var br_poslatih;

        drzava.addEventListener("keyup", function() {
            var x = drzava.value;
            if (!geos[RandChar].Drzava.includes(x)) {
                drzava.addEventListener("focus", function() {
                    drzava.style.border = "1px solid red";
                });
            } else {
                drzava.addEventListener("focus", function() {
                    drzava.style.border = "1px solid green";
                });
            }
        });
        grad.addEventListener("keyup", function() {
            var x = grad.value;
            if (!geos[RandChar].Grad.includes(x)) {
                grad.addEventListener("focus", function() {
                    grad.style.border = "1px solid red";
                });
            } else {
                grad.addEventListener("focus", function() {
                    grad.style.border = "1px solid green";
                });
            }
        });
        reka.addEventListener("keyup", function() {
            var x = reka.value;
            if (!geos[RandChar].Reka.includes(x)) {
                reka.addEventListener("focus", function() {
                    reka.style.border = "1px solid red";
                });
            } else {
                reka.addEventListener("focus", function() {
                    reka.style.border = "1px solid green";
                });
            }
        });
        planina.addEventListener("keyup", function() {
            var x = planina.value;
            if (!geos[RandChar].Planina.includes(x)) {
                planina.addEventListener("focus", function() {
                    planina.style.border = "1px solid red";
                });
            } else {
                planina.addEventListener("focus", function() {
                    planina.style.border = "1px solid green";
                });
            }
        });


        socket.on('hurryUp', (timer1, brIgraca) => {
            var t = timer1.timeLeft;
            setInterval(function() {
                if (t > 0) {
                    timeClock.innerHTML = `` + format(t) + ``;
                    timer1.timeLeft = timer1.endTime - new Date().getTime();
                    t = timer1.timeLeft;
                    socket.on('stopTime', (brPoslatih) => {
                        br_poslatih = brPoslatih;

                        if (brPoslatih === brIgraca) {
                            t = 0;
                            timeClock.innerHTML = `` + 0 + ``;
                        }

                    });
                } else {
                    console.log(`Vrednost mog klika je ${isSend}`);
                    if (isSend === false) {

                        potvrdi.style.visibility = "hidden";
                        var dataVal = [];

                        drzava.readOnly = true;
                        var drzavaVal = drzava.value;
                        grad.readOnly = true;
                        var gradVal = grad.value;
                        reka.readOnly = true;
                        var rekaVal = reka.value;
                        planina.readOnly = true;
                        var planinaVal = planina.value;
                        console.log(`${plId}`);
                        dataVal.push(drzavaVal);
                        dataVal.push(gradVal);
                        dataVal.push(rekaVal);
                        dataVal.push(planinaVal);
                        isSend = true;
                        socket.volatile.emit('calculatePoints', {
                            dataVal,
                            plId,
                            RandChar,
                            idroom

                        });

                    }
                }

            }, 1)
        })

        if (potvrdi !== null && isSend === false) {
            potvrdi.addEventListener('click', function() {

                //sakriva se dugme 

                potvrdi.disabled = true;
                var dataVal = [];

                drzava.readOnly = true;
                var drzavaVal = drzava.value;
                grad.readOnly = true;
                var gradVal = grad.value;
                reka.readOnly = true;
                var rekaVal = reka.value;
                planina.readOnly = true;
                var planinaVal = planina.value;
                console.log(`${plId}`);
                dataVal.push(drzavaVal);
                dataVal.push(gradVal);
                dataVal.push(rekaVal);
                dataVal.push(planinaVal);
                isSend = true;
                socket.volatile.emit('calculatePoints', {
                    dataVal,
                    plId,
                    RandChar,
                    idroom
                })


            });
        }



    });
    const sendMessageButton = document.getElementById("submitmsg");
    sendMessageButton.addEventListener('click', function() {

        const userMessage = document.getElementById("usermsg");

        console.log(userMessage.value);

        if (userMessage.value !== "") {
            const msg = userMessage.value;
            console.log(msg)
            userMessage.value = "";
            socket.emit("sendMessage", username, msg);
        }



    });

    socket.on("getMessage", (usr, msg) => {
        const chatBox = document.getElementById("chatbox");
        console.log(usr);
        console.log(msg);
        console.log(typeof msg);
        const p = document.createElement('p');
        p.innerHTML = "<div class='msgln' style='color:black'> <b class='user-name'>" + usr + "</b> " + msg + "<br></div>";
        chatBox.appendChild(p);

    });

});