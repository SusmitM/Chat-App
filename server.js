const path= require('path');
const http =require('http');
const express =require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const {userJoin,getCurrentUser,getRoomUsers,userLeave} = require('./utils/users');

const app =express();
const server= http.createServer(app);
const io =socketio(server);
const port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname,'public')));

//New Connection is Created
io.on('connection', socket =>{

//When user joins the room
    socket.on('joinRoom',({username,room}) =>{
    //Storing the user info
       const user = userJoin(socket.id,username,room);
       //logged user joins the selected room
       socket.join(user.room);

    //Welcome msg to the user
        socket.emit('message', formatMessage('Admin','Welcome to the chat-app'));
   
        //When a new User joins the room
        socket.broadcast.to(user.room).emit('message', formatMessage('Admin',`${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

  

    });
   //When msg is send
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id);
    // The received msg content is wrapped with formatMessage function and emited to 'message'
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
//starting the server
server.listen(port,()=>{
    console.log(`running on port ${port}`);
}) 