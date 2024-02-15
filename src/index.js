const express = require('express')
const path = require('path')
const app = express();
const crypto = require('crypto');

const http = require('http');
const {Server} = require('socket.io');
const { default: mongoose } = require('mongoose');
const {saveMessages} = require('./utils/messages')
const server = http.createServer(app);
const io = new Server(server)

const publicDirectory = path.join(__dirname, "../public")
app.use(express.static(publicDirectory));
app.use(express.json())

mongoose.connect('mongodb+srv://tkdwls237:yDB9IRFFwFLY2hQp@cluster0.rcpcfst.mongodb.net/?retryWrites=true&w=majority').then(()=> {
    console.log('DB연결 성공')
}).catch(err => { console.error(err)})


const randomId = () => crypto.randomBytes(8).toString('hex');


app.post('/session', (req, res) => {
    const data = {
        username: req.body.username,
        userID: randomId()
    }
    res.send(data);
})
io.use((socket, next) => {
    const username = socket.handshake.auth.username
    const userID = socket.handshake.auth.userID
    if(!username){
        return next(new Error('Invalid username'))
    }
    socket.username = username;
    socket.id = userID

    next();
})


let users = [];
io.on('connection', async socket => {
    let userData = {
        username: socket.username,
        userID: socket.id
    };
    users.push(userData);
    io.emit('users-data', {users})

    socket.on('message-to-server',(payload)=> {
        io.to(payload.to).emit('message-to-client', payload);
        saveMessages(payload);
    })

    socket.on('fetch-messages', ()=> {

    })
    socket.on('disconnect', () => {
        users = users.filter(user => user.userID !== socket.id)

        io.emit('users-data', {users})
        io.emit('user-away', socket.id)
    })
})

const port = 4000;
server.listen(port, () => {
    console.log('Server is up on port' + port)  
})