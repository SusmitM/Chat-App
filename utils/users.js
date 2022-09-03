//The original users array
const users =[];

//To add  a new User
function userJoin(id,username,room){
    const user={id,username,room};
    users.push(user);
    

    return user;
}

//To get a user by id
function getCurrentUser(id){
    return users.find(user => user.id===id);
}
// To remove a user from array using id
function userLeave(id){
    const index = users.findIndex(user => user.id ===id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }

}

//To get the room in which a user is logged
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}


module.exports={
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}