import { useEffect, useRef, useState } from "react";

import { IoSearch, IoSend } from "react-icons/io5";
import YouTube, { YouTubeEvent } from "react-youtube";
import { socket } from "../socket";
import { Status } from "../types";
import { useParams } from "react-router-dom";

const Party = () => {

  const { partyID } = useParams();
  const [chatValue, setChatValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [youtubeID, setYoutubeID] = useState("Kwlf3b98GDs");
  const [videoStatus, setVideoStatus] = useState<Status>(Status.Paused);
  const videoRef = useRef<YouTube>(null);

  const playVideo = () => {
    socket.emit("play", partyID);
  };

  const pauseVideo = () => {
    socket.emit("pause", partyID);
  };
  const getDuration = async () => {
    const rawSeconds = await videoRef?.current?.internalPlayer.getCurrentTime();
    const seconds = Math.floor(rawSeconds);
    return seconds;
  };

  useEffect(() => {
    socket.on("duration", async (seconds) => {
      const clientSeconds = await getDuration();
      if (Math.abs(seconds - clientSeconds) > 3) {
        videoRef?.current?.internalPlayer.seekTo(seconds);
      }
    });

    socket.on("search", (id) => {
      setYoutubeID(id);
    });
  }, []);

  socket.on("play", () => {
    setVideoStatus(Status.Playing);
    videoRef?.current?.internalPlayer.playVideo();
  });

  socket.on("pause", () => {
    setVideoStatus(Status.Paused);
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
  const handleStateChange = (event: YouTubeEvent) => {
    //0-ended, 1 - playing, 2- paused
    switch (event.data) {
      case Status.Playing:
        playVideo();
        break;
      case Status.Paused:
        pauseVideo();
        break;
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const updateDuration = async () => {
      const rawSeconds =
        await videoRef?.current?.internalPlayer.getCurrentTime();
      const seconds = Math.floor(rawSeconds);
      socket.emit("duration", { partyID, seconds });
    };

    if (youtubeID && videoStatus === Status.Playing) {
      timer = setInterval(updateDuration, 2000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [youtubeID, partyID, videoRef, videoStatus, Status.Playing]);

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
            onStateChange={handleStateChange}
            ref={videoRef}
          />

          {/* <div>
            <button className="p-2 border" onClick={playVideo}>
              Play
            </button>
            <button className="p-2 border" onClick={pauseVideo}>
              Pause
            </button>
          </div> */}
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
