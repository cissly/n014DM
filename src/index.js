const express = require('express')
const path = require('path')

const app = express();

const port = 4000;

const publicDirectory = path.join(__dirname, "../public")

app.use(express.static(publicDirectory));
app.use(express.json())


app.listen(port, () => {
    console.log('Server is up on port' + port)  
})