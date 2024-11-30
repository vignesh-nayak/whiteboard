import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CreateRoomForm = ({ socket, setUser }) => {
  const [roomId, setRoomId] = useState("");
  // const [roomPassword, setRoomPassword] = useState("");
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    handleGenerateRoom();
  }, []);

  const handleGenerateRoom = (e) => {
    if (e) e.preventDefault();
    const num = new Date().valueOf().toString().substring(5);
    const randomString = `00000${Math.floor(Math.random() * num)}${num}`.slice(
      -10
    );

    setRoomId(() => `R${roomName}-${randomString}`);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();

    const user = {
      userName,
      roomId,
      userId: Math.floor(
        Math.random() * new Date().valueOf().toString().substring(5)
      ),
      isHost: true,
      isPresenter: true,
    };
    setUser(() => user);
    socket.emit("user-join", user);
    navigate(`/${roomId}`);
    // socket(`room-created by ${userName}`, roomData);
  };

  return (
    <div className="form padding-y margin-auto-x margin-top">
      <h1 className="form-header text-center blue margin-bottom">
        Create Room
      </h1>
      <form>
        <div className="flex-col gap-3vh">
          <div className="input-div">
            <input
              type="text"
              value={roomId}
              disabled={true}
              className="input"
              placeholder="Enter Room Id:"
            />
          </div>
          {/* {roomId && (
          <div className="input-div">
            <input
              type="text"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="input"
              placeholder="Enter Room Password:"
            />
          </div>
        )} */}
          <div className="input-div">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="input"
              placeholder="Enter Your Name:"
            />
          </div>
          <div className="input-div">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="input"
              placeholder="Enter Room Name:"
            />
          </div>
          <div className="button-div">
            <button
              className="button margin-top-1vh"
              onClick={handleGenerateRoom}
            >
              Generate Room
            </button>
            <button
              className="button margin-top-1vh margin-bottom"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>

            <Link to="/">
              Want to Join Room?
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateRoomForm;
