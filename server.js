const path= require('path');
const http =require('http');
const express =require('express');
const socketio = require('socket.io');

const app =express();
const server= http.createServer(app);
const io =socketio(server);

app.use(express.static(path.join(__dirname,'public')));

io.on('connection', socket =>{
    console.log("New conection established");
    
    socket.emit('message', 'Welcome to the chat-app');


})

server.listen(2000,()=>{
    console.log("Server started on http://localhost:2000");
}) 