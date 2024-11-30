import { useRef, useState } from "react";
import Whiteboard from "../components/Whiteboard";

const RoomPage = ({ user, socket, users }) => {
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isShowUsers, setIsShowUsers] = useState(false);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillRect = "white";
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    setElements([]);
  };

  const handleUndo = () => {
    setHistory((previousList) => [
      ...previousList,
      elements[elements.length - 1],
    ]);
    setElements((previousList) => [
      ...previousList.slice(0, previousList.length - 1),
    ]);
  };

  const handleRedo = () => {
    setElements((previousList) => [
      ...previousList,
      history[history.length - 1],
    ]);
    setHistory((previousList) => [
      ...previousList.slice(0, previousList.length - 1),
    ]);
  };

  return (
    <div className="flex-col margin">
      <div className="flex-col">
        <h3 className="text-center">
          PRATIPADANA{" "}
          <span className="blue">[User Online: {users.length}]</span>
        </h3>
        {user?.isPresenter && (
          <div className="flex-row gap-1vw margin justify-content-space-between">
            <div className="flex-row">
              <label className="flex-row gap-0vw" htmlFor="toolPencil">
                <div className="margin-auto-y">Pencil</div>
                <input
                  type="radio"
                  value="pencil"
                  className="input"
                  name="tool"
                  id="toolPencil"
                  checked={tool === "pencil"}
                  onChange={(e) => setTool(e.target.value)}
                />
              </label>
              <label className="flex-row gap-0vw" htmlFor="toolLine">
                <div className="margin-auto-y">Line</div>
                <input
                  type="radio"
                  value="line"
                  className="input"
                  name="tool"
                  id="toolLine"
                  checked={tool === "line"}
                  onChange={(e) => setTool(e.target.value)}
                />
              </label>
              <label className="flex-row gap-0vw" htmlFor="toolRectangle">
                <div className="margin-auto-y">Rectangle</div>
                <input
                  type="radio"
                  value="rect"
                  className="input"
                  name="tool"
                  id="toolRectangle"
                  checked={tool === "rect"}
                  onChange={(e) => setTool(e.target.value)}
                />
              </label>
            </div>

            <div className="flex-row gap-0vw width-fit-content">
              <label htmlFor="color">
                Select Color:
                <input
                  type="color"
                  // className="input"
                  id="color"
                  name="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
            </div>

            <div className="flex-row gap-3vw">
              <div>
                <button
                  className="small-button"
                  // disabled={elements.length === 0}
                  disabled={true}
                  onClick={handleUndo}
                >
                  Undo
                </button>
              </div>

              <div>
                <button
                  className="small-button"
                  // disabled={history.length === 0}
                  disabled={true}
                  onClick={handleRedo}
                >
                  Redo
                </button>
              </div>
            </div>

            <div className="flex-row gap-3vw">
              <div>
                <button
                  className="small-button bg-red clear-canvas-btn"
                  onClick={handleClearCanvas}
                >
                  Clear Canvas
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="whiteBoard margin-x">
          <Whiteboard
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            elements={elements}
            setElements={setElements}
            tool={tool}
            color={color}
            user={user}
            socket={socket}
          />
        </div>
      </div>

      <div className="flex-col margin">
        <div className="flex-row gap-1vw">
          <div>
            <button
              className="button margin-top-1vh"
              onClick={() => setIsShowUsers(() => !isShowUsers)}
            >
              {isShowUsers ? "Hide Users" : "Show Users"}
            </button>
          </div>
        </div>
        <div className="flex-col gap-1vh">
          {isShowUsers &&
            users.map((u, index) => (
              <div key={index}>
                {u.userName} {u.userId === user.userId && "(You)"}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
