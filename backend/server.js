const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, removeUser, getUser } = require("./utils/users");
const io = new Server(server);
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send({
    message: "backend is working",
    code: 0,
  });
});

let mainRoomId, mainImageUrl;
io.on("connection", (socket) => {
  socket.on("user-join", (data) => {
    const { userName, roomId, userId, isHost, isPresenter } = data;
    mainRoomId = roomId;
    socket.join(roomId);
    const users = addUser({ ...data, socketId: socket.id });
    socket.emit("user-joined", { success: true, users });
    socket.broadcast.to(mainRoomId).emit("all-users", users);
    socket.broadcast
      .to(mainRoomId)
      .emit("user-joined-message-broadcasted", userName);
    socket.broadcast.to(mainRoomId).emit("whiteboard-data-response", {
      imageUrl: mainImageUrl,
    });
  });

  socket.on("whiteboard-data", (data) => {
    mainImageUrl = data;
    socket.broadcast.to(mainRoomId).emit("whiteboard-data-response", {
      imageUrl: mainImageUrl,
    });
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    console.log(user);
    
    if (user) {
      const removedUser = removeUser(socket.id);
      socket.broadcast
        .to(mainRoomId)
        .emit("user-left-message-broadcast", user);
    }
  });
});
server.listen(PORT, () => console.log(`server is running at PORT:${PORT}`));
