import React, { useRef, useState } from 'react'
// import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import testVideo from "../assets/sample.mp4";
import { useParams } from 'react-router-dom';


const Party = () => {
  const { partyID } = useParams();

  const [chatValue, setChatValue] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const playVideo = () => {
    socket.emit("play", partyID);
  };
  socket.on("play", (data) => {
    setChatValue(data);
    videoRef.current?.play();
  });

  
  return (
    <div>
      <video ref={videoRef} width="200" height="140" src={testVideo}>
      
      </video>
      <button className="p-2 border" onClick={playVideo}>
        Play
      </button>
      <div>{chatValue}</div>
    </div>
  );
}

export default Party