import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserData from "../hooks/useAppData";
import { socket } from "../socket";
import { Participants } from "../types";

const Participants = () => {
  const { partyID } = useParams();
  const [participants, setParticipants] = useState<Participants[]>([]);

  const [user, setUser] = useState("");
  const { getUser, setHost, host } = useUserData();

  const getParticipants = async () => {
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
      const data = await response.json();
      const user = await getUser();
      setParticipants(data.users);
      setHost(data.party.host);
      setUser(user);
    }
  };

  const updatehost = async (token: string,partyID:string, newHost: string) => {
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
      localStorage.setItem("host", newHost);
      socket.emit("assign_host", partyID, newHost);
    }
  };

  const switchHost = (username: string) => {
    const token = localStorage.getItem("token");

    if (username && token && partyID) {
      updatehost(token,partyID, username);
    }
  };
  useEffect(() => {
    getParticipants();
  }, []);

  return (
    <section className="flex-1">
      <div className="flex flex-col">
        {participants.map((participant) => {
          return (
            <button
              key={participant._id}
              className="flex items-center justify-center gap-2 p-2 m-2 hover:bg-[#09618E] hover:transition hover:duration-700 hover:rounded-lg"
            >
              {participant.username === host ? (
                <span className="p-2 text-2xl text-red-300">
                  {participant.username}
                </span>
              ) : (
                <span className="p-2 text-2xl">{participant.username}</span>
              )}

              {user === host && participant.username != user && (
                <div className="flex gap-4">
                  <span
                    className="p-1 bg-green-700 hover:bg-green-800"
                    onClick={() => switchHost(participant.username)}
                  >
                    Promote
                  </span>
                  {/* <span className="p-1 bg-red-700 hover:bg-red-800">Kick</span> */}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Participants;
