import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const JoinRoomForm = ({ socket, setUser }) => {
  const [roomId, setRoomId] = useState("");
  // const [roomPassword, setRoomPassword] = useState("");
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = (e) => {
    e.preventDefault();

    const user = {
      userName,
      roomId,
      userId: Math.floor(
        Math.random() * new Date().valueOf().toString().substring(5)
      ),
      isHost: false,
      isPresenter: false,
    };
    setUser(() => user);
    socket.emit("user-join", user);
    navigate(`/${roomId}`);
  };

  return (
    <div>
      <div className="form padding-y margin-auto-x margin-top">
        <h1 className="form-header text-center blue margin-bottom">
          Join Room
        </h1>
        <form>
          <div className="flex-col gap-3vh">
            <div className="input-div">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="input"
                placeholder="Enter Room Id:"
              />
            </div>
            {/* <div className="input-div">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="input"
            placeholder="Enter Room Password Name:"
          />
        </div> */}
            <div className="input-div">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input"
                placeholder="Enter User Name:"
              />
            </div>
            {/* <div className="input-div">
        <input type="text" className="input" placeholder="Enter Room Password:" />
      </div> */}
            <div className="button-div">
              <button className="button margin-bottom" onClick={handleJoinRoom}>
                Join Room
              </button>
              <Link to="/create-room" className="margin-top">
                Want to Create Room?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomForm;
