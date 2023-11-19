import React, { useRef, useState } from "react";
// import { useParams } from 'react-router-dom';
import { IoSearch, IoSend } from "react-icons/io5";

import { socket } from "../socket";
// import testVideo from "../assets/sample.mp4";
import { useParams } from "react-router-dom";

const Party = () => {
  const { partyID } = useParams();

  const [chatValue, setChatValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [youtubeID,setYoutubeID] = useState("");
  const [play, setPlay] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
 
  const playVideo = () => {
    socket.emit("play", partyID);
  };

  const pauseVideo = () => {
    socket.emit("pause", partyID);
  };

  socket.on("play", () => {
    videoRef.current?.contentWindow?.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
  });

  socket.on("pause",()=>{
      console.log("inside pause");
      videoRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
        "*"
      );
  })
  
  socket.on("search",(id)=>{
    setYoutubeID(id);
  });

  const parseYoutubeURL = (url:string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const youtubeID = match && match[7].length == 11 ? match[7] : "";
    return youtubeID;
  };
  const handleSearch = ()=>{
      const id = parseYoutubeURL(searchInput);
      socket.emit("search", {partyID,id});
      setSearchInput("");
  }
  return (
    <main className="bg-[#272526] text-white h-screen flex flex-col">
      <div className="">
        <nav className="flex justify-between p-6 text-2xl border-b">
          <div className="flex px-4 py-2 border rounded-full min-w-[600px]">
            <input
              type="text"
              className="flex-1 p-2 text-sm bg-transparent outline-none cursor-auto"
              placeholder="Youtube URL"
              value={searchInput}
              onChange={(e)=>setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch}>
              <IoSearch size={25} />
            </button>
          </div>

          <div className="flex gap-10">
            <div className="flex items-center">John Doe</div>
          <button>Log out</button>
          </div>
          
        </nav>
      </div>
      <div className="flex">
        <section className="m-2 border rounded-lg w-fit">
          {/* <video
            ref={videoRef}
            width="854"
            height="480"
            src={testVideo}
          ></video> */}
          {/* <YouTube
          videoId={youtubeID}
          opts={{
            height: '390',
            width: '640',
          }}
          onReady={handleReady}
          /> */}
          {/* ${play?"?autoplay=1":"?autoplay=0"} */}
          <iframe
            ref={videoRef}
            width="854"
            height="480"
            src={`https://www.youtube.com/embed/${youtubeID}?enablejsapi=1&version=3&playerapiid=ytplayer`}
            
          ></iframe>
          <div>
            <button className="p-2 border" onClick={playVideo}>
              Play
            </button>
            <button className="p-2 border" onClick={pauseVideo}>Pause</button>
          </div>
        </section>

        <section className="flex-1">
          <div className="flex h-[90%]"></div>
          <div className="flex p-2 border rounded-full">
            <input
              type="text"
              className="flex-1 p-2 bg-transparent outline-none"
              onChange={(e) => setChatValue(e.target.value)}
            />
            <button className={`${chatValue ? "opacity-100" : "opacity-20"}`}>
              <IoSend size={25} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Party;
