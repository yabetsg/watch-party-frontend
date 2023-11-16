import { useRef, useState } from "react";
import { socket } from "../socket";
import testVideo from "../assets/sample.mp4";
const TestSocket = () => {
  const [chatValue, setChatValue] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const playVideo = () => {
    socket.emit("play", "play video");
  };
  socket.on("play", (data) => {
    setChatValue(data);
    videoRef.current?.play();
  });

  return (
    <div>
      <video ref={videoRef} width="420" height="240" src={testVideo}></video>
      <button className="p-2 border" onClick={playVideo}>
        Play
      </button>
      <div>{chatValue}</div>
    </div>
  );
};

export default TestSocket;
