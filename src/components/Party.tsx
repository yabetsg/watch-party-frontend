import { useCallback, useEffect, useRef, useState } from "react";

import { IoSearch } from "react-icons/io5";
import ReactPlayer from "react-player";
import { socket } from "../socket";
import { Status } from "../types";
import { useNavigate, useParams } from "react-router-dom";

import { handleLogout } from "../shared";

import Chat from "./Chat";
import Menu from "./Menu";
import Participants from "./Participants";
import useAppData from "../hooks/useAppData";
import {
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightEndOnRectangleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const Party = () => {
  const { partyID } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [menu, setMenu] = useState("chat");
  const [youtubeID, setYoutubeID] = useState("");

  const [videoStatus, setVideoStatus] = useState<Status>(Status.Paused);
  const videoRef = useRef<ReactPlayer>(null);
  const [user, setUser] = useState<string>("");
  const [logoutDropdown, setLogoutDropdown] = useState<boolean>(false);
  const [copyPartyIDDropdown, setCopyPartyIDDropdown] =
    useState<boolean>(false);

  const { getUser, host, setHost } = useAppData();
  const navigate = useNavigate();

  const initializeParty = useCallback(async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_API}/party/${partyID}`, {
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
  }, [getUser, navigate, partyID]);

  const updateVideo = useCallback(
    async (youtubeID: string) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API}/party/${partyID}`, {
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
    },
    [partyID]
  );

  const handleSearch = () => {
    if (user == host) {
      socket.emit("search", partyID, searchInput);
      setSearchInput("");
    }
  };
  const handleLeave = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API}/party/${partyID}`, {
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
          const newHost = users[0].username;
          if (token && partyID) updatehost(token, partyID, newHost);
        } else {
          navigate("/");
        }
      }
      navigate("/");
    } else {
      console.log("Error leaving party");
    }
  };

  const updateDuration = useCallback(() => {
    const rawSeconds = videoRef?.current?.getCurrentTime() || 0;
    const seconds = Math.floor(rawSeconds);
    if (user == host) {
      socket.emit("duration", partyID, seconds);
    }
  }, [host, partyID, user]);
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

  const getParticipants = useCallback(async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API}/party/${partyID}/users`,
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
  }, [partyID]);

  const updatehost = async (
    token: string,
    partyID: string,
    newHost: string
  ) => {
    const response = await fetch(`${import.meta.env.VITE_API}/party/${partyID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newHost }),
      credentials: "include",
    });

    if (response.ok) {
      socket.emit("assign_host", partyID, newHost);
    }
  };
  const handleProfileDropdown = () => {
    setLogoutDropdown((prevState) => !prevState);
  };

  const copyPartyID = () => {
    if (partyID) {
      navigator.clipboard.writeText(partyID);
    }
    setCopyPartyIDDropdown(true);
    setTimeout(() => {
      setCopyPartyIDDropdown(false);
    }, 1500);
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

    socket.on("assign_host", (newHost) => {
      const token = localStorage.getItem("token");
      if (token) {
        setHost(newHost);
        localStorage.setItem("host", newHost);
      }
    });
    initializeParty();
  }, [getParticipants, initializeParty, partyID, setHost, updateVideo]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (youtubeID && videoStatus === Status.Playing) {
      timer = setInterval(updateDuration, 2000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [youtubeID, partyID, videoRef, videoStatus, user, updateDuration]);

  return (
    <main className="bg-gradient-to-r font-['Kanit'] from-[#274060] to-[#1B2845] text-white h-screen  flex flex-col">
      <div className="">
        <nav className="flex justify-between p-6 text-2xl border-b border-b-[#65b5eb]">
          <div className="flex px-4 py-2 border border-[#65b5eb] rounded-full max-w-[600px] w-[600px]">
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

          <div className="flex text-center max-lg:gap-2 lg:gap-6">
            {user && (
              <>
                <div
                  className="flex cursor-pointer "
                  onClick={handleProfileDropdown}
                >
                  <div className="flex items-center pl-2 lg:gap-2">
                    <UserCircleIcon className="w-7" />
                    <div className="text-2xl font-['Kanit'] max-lg:hidden">
                      {user}
                    </div>
                    <ChevronDownIcon className="w-3 max-w-3" />
                  </div>

                  <div
                    className={`absolute self-end p-2 text-lg text-center border  rounded-md w-28 bg-[#274060] duration-200 right-28 top-20 border-[#65b5eb] ${
                      logoutDropdown ? "block" : "hidden"
                    }`}
                  >
                    <div className="text-red-500" onClick={handleLogout}>
                      Sign out
                    </div>
                  </div>

                  <div
                    className={`absolute self-end p-2 text-lg text-center border  rounded-md w-30 bg-[#274060] duration-200 right-10 top-20 border-[#65b5eb] ${
                      copyPartyIDDropdown ? "block" : "hidden"
                    }`}
                  >
                    <div className="text-green-500" onClick={handleLogout}>
                      Copied party id to clipboard!
                    </div>
                  </div>
                </div>
              </>
            )}
            <button
              className="flex items-center gap-2 text-center text-md"
              onClick={copyPartyID}
            >
              <DocumentDuplicateIcon className="w-6 max-w-6" />
            </button>
            <button onClick={handleLeave}>
              <ArrowRightEndOnRectangleIcon className="w-6 max-w-6" />
            </button>
          </div>
        </nav>
      </div>
      <div className="flex max-xl:flex-col">
        <section className="m-2 border xl:max-w-[1050px] xl:w-[1050px]  h-[586px]  border-[#65b5eb] ">
          <ReactPlayer
            url={youtubeID}
            controls={true}
            ref={videoRef}
            onPause={() => pauseVideo()}
            onPlay={() => playVideo()}
            width={"100%"}
            height={"100%"}
          ></ReactPlayer>
        </section>

        <div className="flex flex-col flex-1 bg-[] overflow-x-auto break-words max-xl:bg-gradient-to-r font-['Kanit'] from-[#274060] to-[#1B2845]">
          <Menu menu={menu} setMenu={setMenu} />
          {menu === "chat" && <Chat />}
          {menu === "participants" && <Participants />}
        </div>
      </div>
    </main>
  );
};

export default Party;
