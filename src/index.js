const express = require('express')
const path = require('path')
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const { socket } = require('server/router');
const { default: mongoose } = require('mongoose');
const server = http.createServer(app);
const io = new Server(server)

mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://tkdwls237:yDB9IRFFwFLY2hQp@cluster0.rcpcfst.mongodb.net/?retryWrites=true&w=majority').then(()=> {
    console.log('DB연결 성공')
}).catch(err => { console.error(err)})

let users = [];
io.on('connection', async socket => {
    let userData = {};
    users.push(userData);
    io.emit('users-data', {users})

    socket.on('message-to-server',()=> {

    })

    socket.on('fetch-messages', ()=> {

    })
    socket.on('disconnect', () => {

    })
})

const port = 4000;

const publicDirectory = path.join(__dirname, "../public")

app.use(express.static(publicDirectory));
app.use(express.json())


server.listen(port, () => {
    console.log('Server is up on port' + port)  
})