import React, { useRef, useState } from "react";
// import { useParams } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import { socket } from "../socket";
import testVideo from "../assets/sample.mp4";
import { useParams } from "react-router-dom";

const Party = () => {
  const { partyID } = useParams();

  const [chatValue, setChatValue] = useState("");
  const [sendClass,setSendClass] = useState("opacity-100")
  const videoRef = useRef<HTMLVideoElement>(null);
  const playVideo = () => {
    socket.emit("play", partyID);
  };

  socket.on("play", (data) => {
    setChatValue(data);
    videoRef.current?.play();
  });

  return (
    <main className="bg-[#272526] text-white h-screen flex flex-col">
      <div>
        <nav className="flex justify-end gap-6 p-6 text-2xl border-b">
          <div>John Doe</div>
          <button>Log out</button>
        </nav>
      </div>
      <div className="flex">
        <section className="m-2 border rounded-lg w-fit">
          <video
            ref={videoRef}
            width="854"
            height="480"
            src={testVideo}
          ></video>
          <div>
            <button className="p-2 border" onClick={playVideo}>
              Play
            </button>
            <button className="p-2 border">Pause</button>
          </div>
        </section>

        <section className="flex-1">
          <div className="flex h-[90%]">

          </div>
          <div className="flex p-2 border rounded-full">
            <input type="text" className="flex-1 p-2 bg-transparent outline-none" onChange={(e)=>setChatValue(e.target.value)}/>
            <button className={`${chatValue?'opacity-100':'opacity-20'}`}>
              <IoSend size={25}/>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Party;
