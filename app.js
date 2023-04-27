const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const fs = require('fs');

let people_connect = [];
let user;

const logStream = fs.createWriteStream('chat.log', { flags: 'a'});

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


function log(message) {
    const now = new Date().toISOString();
    logStream.write(`${now}: ${message}`);
}

io.on('connection', (socket) => {
    
    if (!people_connect.includes(user) && user !== undefined) {
        console.log('New User Connected');
        log('New User Connected');
        socket.broadcast.emit('user connected', 'A new user has connected.');
        people_connect.push(user);
    }
    io.emit('update user count', people_connect.length);

    socket.on('chat message', ({msg, sender, color}) => {

        log(`${sender} - ${msg}`);

        socket.broadcast.emit('chat message', {
            username: sender,
            message: msg,
        });

        io.emit('chat message', {
            msg,
            sender,
            color
        });
    });

    socket.on('disconnect', () => {
        people_connect.splice(people_connect.indexOf(user), 1)
        // user = undefined;
        io.emit('update user count', people_connect.length);
        log(`${user} Disconnected`);
        socket.broadcast.emit('user connected', 'A user has left');
    });
});


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/chat', (req, res) => {
    const { username } = req.body;
    user = username;
    const user_color = "#" + Math.floor(Math.random() * 16777215).toString(16);

    res.render('chat', {user: username, color: user_color});
});

app.post('/logout', (req, res) => {
    res.redirect("/");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, console.log(`Server running on port ${PORT}`));