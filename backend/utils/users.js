const users = [];

const addUser = ({ userName, roomId, userId, isHost, isPresenter, socketId}) => {
    const user = { userName, roomId, userId, isHost, isPresenter, socketId};
    users.push(user);
    return users.filter(user => user.roomId === roomId);
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.socketId === id);
    if(index !== -1) return users.splice(index, 1)[0];
    
}

const getUser = (id) => {
    return users.find(user => user.socketId === id);
}

const getAllUsersInRoom = (roomId) => {
    return users.filter(user => user.roomId === roomId);
}

module.exports ={
    addUser,
    removeUser,
    getAllUsersInRoom,
    getUser
}