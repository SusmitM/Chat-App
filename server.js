const path= require('path');
const http =require('http');
const express =require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const {userJoin,getCurrentUser,getRoomUsers,userLeave} = require('./utils/users');

const app =express();
const server= http.createServer(app);
const io =socketio(server);

app.use(express.static(path.join(__dirname,'public')));

//New Connection is Created
io.on('connection', socket =>{

    socket.on('joinRoom',({username,room}) =>{

       const user = userJoin(socket.id,username,room);
       socket.join(user.room);
    //When a new User joins
        socket.emit('message', formatMessage('Admin','Welcome to the chat-app'));
    //When a new User joins the room
        socket.broadcast.to(user.room).emit('message', formatMessage('Admin',`${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

  

    });

   
   
    // The received msg content is wrapped with formatMessage function and emited to 'message'
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id);
       io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    //When a user leaves
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        // Disconnecting message
        if(user){
            io.to(user.room).emit('message',formatMessage('Admin',`${user.username} has left the chat`));

        };
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });


       
    });

})

server.listen(2000,()=>{
    console.log("Server started on http://localhost:2000");
}) 