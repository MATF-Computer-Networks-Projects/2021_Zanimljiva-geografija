const {
    username
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true

});
const ime = document.getElementById("here");


const socket = io("http://localhost:3000/lobby");

socket.on('welcomeTolobby', (cur_room) => {

    console.log(`${cur_room} je trenutna soba `);

    const but1 = document.getElementById("rand");
    but1.addEventListener('click', login);

    async function login() {

        location.href = "http://localhost:3000/game/" + cur_room + "?username=" + `${username}`;
        console.log('Nasumicna soba');

    }

    const but2 = document.getElementById("search");
    but2.addEventListener('click', () => {
        location.href = "http://localhost:3000/room?username=" + `${username}`;
        console.log('Pretrazi sobe');
    })
    socket.on('check', live => {
        live = live.replace(/\\/g, "");
        live = live.replace(/"/g, "");
        console.log('Primih check ' + `${username}` + ` live ${live}`);
        if (username == live) {
            alert("Vec ste u sobi");
            location.href = "http://localhost:3000/login"
        }
    });
});