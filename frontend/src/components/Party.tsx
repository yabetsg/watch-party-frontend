import { useEffect, useRef, useState } from "react";

import { IoExitOutline, IoSearch, IoSend } from "react-icons/io5";
import ReactPlayer from "react-player";
import { socket } from "../socket";
import { Status } from "../types";
import { useNavigate, useParams } from "react-router-dom";

import { handleLogout } from "../shared";

import useUserData from "../hooks/useUserData";

const Party = () => {
  const { partyID } = useParams();
  const [chatValue, setChatValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [youtubeID, setYoutubeID] = useState("");
  const [videoStatus, setVideoStatus] = useState<Status>(Status.Paused);
  const videoRef = useRef<ReactPlayer>(null);
  const [user, setUser] = useState<string>("");
  const { getUser } = useUserData();
  const navigate = useNavigate();

  const initializeParty = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/party/${partyID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (response.ok) {
      const { data } = await response.json();

      const user = await getUser();
      setUser(user);
      socket.emit("join", { partyID, user });
      setYoutubeID(data.videoID ? data.videoID : "");
    }
  };

  useEffect(() => {
    socket.on("search", (youtubeID: string) => {
      setYoutubeID(youtubeID);
      updateVideo(youtubeID);
    });

    socket.on("play", () => {
      console.log("onPlay");
      setVideoStatus(Status.Playing);
      videoRef.current?.getInternalPlayer().playVideo();
    });

    socket.on("pause", () => {
      console.log("onPause");
      setVideoStatus(Status.Paused);
      videoRef.current?.getInternalPlayer().pauseVideo();
    });

    socket.on("duration", async (seconds) => {
      const clientSeconds = videoRef?.current?.getCurrentTime() || 0;
      if (Math.abs(seconds - clientSeconds) > 3) {
        videoRef?.current?.seekTo(seconds);
        videoRef.current?.getInternalPlayer().playVideo();
      }
    });
    socket.on("switch_host", async () => {
      const [users] = await getParticipants();
      socket.emit("assign_host", users.username);
    });
    initializeParty();
  }, []);

  const updateVideo = async (youtubeID: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/party/${partyID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ youtubeID }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Party updated with youtube id: " + JSON.stringify(data));
    }
  };

  const handleSearch = () => {
    socket.emit("search", { partyID, youtubeID: searchInput });
    console.log(searchInput);

    setSearchInput("");
  };
  const handleLeave = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/party/${partyID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ leave: true }),
    });
    if (response.ok) {
      socket.emit("leave", { partyID, user });
      navigate("/")
    }
  };

  const updateDuration = () => {
    const rawSeconds = videoRef?.current?.getCurrentTime() || 0;
    const seconds = Math.floor(rawSeconds);
    socket.emit("duration", { partyID, seconds, user });
  };
  const playVideo = () => {
    socket.emit("play", { partyID, user });
  };
  const pauseVideo = () => {
    socket.emit("pause", { partyID, user });
  };

  const getParticipants = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/party/${partyID}/users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const users = await response.json();
      return users;
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    console.log("Status: " + videoStatus);

    if (youtubeID && videoStatus === Status.Playing) {
      timer = setInterval(updateDuration, 2000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [youtubeID, partyID, videoRef, videoStatus, user]);

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

          {user ? (
            <>
              <div>{user}</div>
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
          <button onClick={handleLeave}>
            <IoExitOutline size={25} />
          </button>
        </nav>
      </div>
      <div className="flex">
        <section className="m-2 border rounded-lg w-fit">
          <ReactPlayer
            url={youtubeID}
            controls={true}
            ref={videoRef}
            onPause={() => pauseVideo()}
            onPlay={() => playVideo()}
            width={854}
            height={480}
          ></ReactPlayer>
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
