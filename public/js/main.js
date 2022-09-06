const chatForm = document.getElementById('chat-form');
const chatMessage =document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const currentUser = document.getElementById('currentUser');

// Getting the username and room-name from the search query
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const socket=io();

//When user joins the room
socket.emit('joinRoom',{username,room});

socket.on('roomUsers',({room,users}) =>{

    //Show room name
    outputRoomName(room);

    //Show users in the room
    outputUsers(users);
})

//Display the logged User
currentUser.innerHTML= `  ${username}`;
 
// Display the welcome message
socket.on('message', message =>{

    //Output the message
    outputMessage(message);

    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Event after send btn is clicked
chatForm.addEventListener('submit',(e) =>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    //The msg content is emited
    socket.emit('chatMessage',msg);

    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

});

//Output the message
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =`
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Show room name
function outputRoomName(room){
    roomName.innerText=room;
}

//Show users in the room
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user =>`<li>${user.username}</li>`).join('')
}`;


}