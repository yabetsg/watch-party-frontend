import { useEffect, useRef, useState } from "react";
// import { useParams } from 'react-router-dom';
import { IoSearch, IoSend } from "react-icons/io5";
import YouTube from "react-youtube";
import { socket } from "../socket";
// import testVideo from "../assets/sample.mp4";
import { useParams } from "react-router-dom";

const Party = () => {
  const { partyID } = useParams();
  const [chatValue, setChatValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [youtubeID, setYoutubeID] = useState("Kwlf3b98GDs");
  const videoRef = useRef<YouTube>(null);

  const playVideo = () => {
    socket.emit("play", partyID);
  };

  const pauseVideo = () => {
    socket.emit("pause", partyID);
  };
  const getDuration = async()=>{
    const rawSeconds =
        await videoRef?.current?.internalPlayer.getCurrentTime();
      const seconds = Math.floor(rawSeconds);
      return seconds;
  }
  useEffect(() => {
    socket.on("duration", async(seconds) => {
      const clientSeconds =  await getDuration()
      if(Math.abs(seconds-clientSeconds)>5){
        videoRef?.current?.internalPlayer.seekTo(seconds)
      }
    });

    socket.on("search", (id) => {
      console.log("id");
      setYoutubeID(id);
    });
  }, []);

  socket.on("play", () => {
    videoRef?.current?.internalPlayer.playVideo();
  });

  socket.on("pause", () => {
    videoRef?.current?.internalPlayer.pauseVideo();
  });

  const parseYoutubeURL = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const youtubeID = match && match[7].length == 11 ? match[7] : "";
    return youtubeID;
  };
  const handleSearch = () => {
    const id = parseYoutubeURL(searchInput);

    socket.emit("search", { partyID, id });
    setSearchInput("");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const updateDuration = async () => {
      const rawSeconds =
        await videoRef?.current?.internalPlayer.getCurrentTime();
      const seconds = Math.floor(rawSeconds);
      socket.emit("duration", { partyID, seconds });
    };

    if (youtubeID) {
      timer = setInterval(updateDuration, 2000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [youtubeID, partyID, videoRef]);


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
              onChange={(e) => setSearchInput(e.target.value)}
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
          <YouTube
            videoId={youtubeID}
            opts={{
              width: "854",
              height: "480",
            }}
            ref={videoRef}
          />

          <div>
            <button className="p-2 border" onClick={playVideo}>
              Play
            </button>
            <button className="p-2 border" onClick={pauseVideo}>
              Pause
            </button>
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
