import { useEffect, useRef, useState } from "react";

import { IoExitOutline, IoSearch } from "react-icons/io5";
import ReactPlayer from "react-player";
import { socket } from "../socket";
import { Status } from "../types";
import { useNavigate, useParams } from "react-router-dom";

import { handleLogout } from "../shared";

import useUserData from "../hooks/useUserData";
import Chat from "./Chat";
import Menu from "./Menu";
import Participants from "./Participants";

//TODO: fix issue causing video to be paused when seeking.
const Party = () => {
  const { partyID } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [menu, setMenu] = useState("chat");
  const [youtubeID, setYoutubeID] = useState("");

  const [videoStatus, setVideoStatus] = useState<Status>(Status.Paused);
  const videoRef = useRef<ReactPlayer>(null);
  const [user, setUser] = useState<string>("");
  const { getUser, host, setHost } = useUserData();
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
      socket.emit("join", partyID, user);
      const videoUrl = data.videoID ? data.videoID : "";
      setYoutubeID(videoUrl);
    } else {
      navigate("/");
    }
  };

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
      //
    }
  };

  const handleSearch = () => {
    if (user == host) {
      socket.emit("search", partyID, searchInput);
      console.log(searchInput);

      setSearchInput("");
    }
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
      if (user === host) {
        socket.emit("leave", partyID, user);

        //switch host
        const { users } = await getParticipants();
        if (users && users.length > 0) {
          console.log(users);
          console.log("switched to " + users[0].username);
          socket.emit("assign_host", partyID, users[0].username);
        } else {
          navigate("/");
        }
      }
      navigate("/");
    } else {
      //handle error
      console.log("Error leaving party");
    }
  };

  const updateDuration = () => {
    const rawSeconds = videoRef?.current?.getCurrentTime() || 0;
    const seconds = Math.floor(rawSeconds);
    if (user == host) {
      socket.emit("duration", partyID, seconds);
    }
  };
  const playVideo = () => {
    if (user === host) {
      socket.emit("play", partyID);
    }
  };
  const pauseVideo = () => {
    if (user === host) {
      socket.emit("pause", partyID);
    }
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
    socket.on("search", (youtubeID: string) => {
      setYoutubeID(youtubeID);
      updateVideo(youtubeID);
    });

    socket.on("play", () => {
      setVideoStatus(Status.Playing);
      videoRef.current?.getInternalPlayer().playVideo();
    });

    socket.on("pause", () => {
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
      localStorage.setItem("host", users.username);
      socket.emit("assign_host", partyID, users.username);
    });

    socket.on("assign_host", (newHost) => {
      setHost(newHost);
      localStorage.setItem("host", newHost);
    });
    initializeParty();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

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

        <div className="flex flex-col flex-1">
          <Menu menu={menu} setMenu={setMenu} />
          {menu === "chat" && <Chat />}
          {menu === "participants" && <Participants />}
        </div>
      </div>
    </main>
  );
};

export default Party;
