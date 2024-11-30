import { Route, Routes } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CreateRoomForm from "./components/Forms/CreateRoomForm";
import JoinRoomForm from "./components/Forms/JoinRoomForm";

const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnentionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("user-joined", (data) => {
      if (data.success) {
        console.log("user joined successfully");
        setUsers(data.users);
      } else {
        console.log("error");
      }
    });

    socket.on("all-users", (data) => {
      setUsers(data);
    });

    socket.on("user-joined-message-broadcasted", (name) => {
      toast.info(`${name} has joined room.`);
    });

    socket.on("user-left-message-broadcast", (user) => {
      // setUser(() => [...users.filter((u) => u.socketId !== user.socketId)]);
      toast.info(`${user.userName} has left the room.`);
    });
  }, []);

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<JoinRoomForm socket={socket} setUser={setUser} />}
        />
        <Route
          path="/create-room"
          element={<CreateRoomForm socket={socket} setUser={setUser} />}
        />
        <Route
          path="/:roomId"
          element={<RoomPage user={user} socket={socket} users={users} />}
        />
      </Routes>
    </div>
  );
};

export default App;
