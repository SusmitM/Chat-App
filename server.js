const path= require('path');
const http =require('http');
const express =require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');

const app =express();
const server= http.createServer(app);
const io =socketio(server);

app.use(express.static(path.join(__dirname,'public')));

io.on('connection', socket =>{
    console.log("New conection established");
    
    socket.emit('message', formatMessage('Admin','Welcome to the chat-app'));

    socket.broadcast.emit('message', formatMessage('Admin','A user has joined the chat'));

    socket.on('disconnect', ()=>{
        io.emit('message',formatMessage('Admin','A user has left the chat'));
    });

    socket.on('chatMessage', (msg)=>{
       io.emit('message', formatMessage('User',msg));
    })


})

server.listen(2000,()=>{
    console.log("Server started on http://localhost:2000");
}) 