import { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

const Whiteboard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  user,
  socket,
}) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    socket.on("whiteboard-data-response", (data) => {
      setImageUrl(data.imageUrl);
    });
  }, []);

  if (!user?.isPresenter) {
    return (
      <div className="h-100 w-100 canvas">
        <img src={imageUrl} alt="Whiteboard shared by presenter...." />
      </div>
    );
  }

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;

    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  useLayoutEffect(() => {
    if (!canvasRef) return;

    const roughCanvas = rough.canvas(canvasRef.current);

    if (elements.length > 0) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: 5,
          roughness: 0,
        });
      } else if (element.type === "line") {
        roughCanvas.draw(
          roughGenerator.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.stroke,
              strokeWidth: 5,
              roughness: 0,
            }
          )
        );
      } else if (element.type === "rect") {
        roughCanvas.draw(
          roughGenerator.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              stroke: element.stroke,
              strokeWidth: 5,
              roughness: 0,
            }
          )
        );
      }
    });

    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("whiteboard-data", canvasImage);
  }, [elements]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    // setIsDrawing((isDrawing) => !isDrawing);
    setIsDrawing(true);

    if (tool === "pencil") {
      setElements((prevoiuselements) => [
        ...prevoiuselements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool === "line") {
      setElements((prevoiuselements) => [
        ...prevoiuselements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    } else if (tool === "rect") {
      setElements((prevoiuselements) => [
        ...prevoiuselements,
        {
          type: "rect",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }
    // TODO: combine both rect and line
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];
        setElements((prevoiusElements) => {
          return prevoiusElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                path: newPath,
              };
            }
            return ele;
          });
        });
      } else if (tool == "line") {
        setElements((prevoiusElements) => {
          return prevoiusElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX,
                height: offsetY,
              };
            }
            return ele;
          });
        });
      } else if (tool == "rect") {
        setElements((prevoiusElements) => {
          return prevoiusElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              };
            }
            return ele;
          });
        });
      }

      console.log("-------------------");
      console.log(elements);
      console.log(history);
      console.log("-------------------");
    }
  };

  const handleMouseUp = (e) => {
    setIsDrawing(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="h-100 w-100 canvas"
    >
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Whiteboard;
