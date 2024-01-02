import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useUserData from "../hooks/useUserData";

const Participants = () => {
  interface Participants {
    _id: string;
    username: string;
  }

  const { partyID } = useParams();
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [host, setHost] = useState<string>("");
  const [user, setUser] = useState("");
  const { getUser } = useUserData();

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
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      const user = await getUser();
      setParticipants(data.users);
      setHost(data.party.host);
      setUser(user);
    }
  };

  const updatehost = async (token: string, newHost: string) => {
    const response = await fetch(`http://localhost:3000/party/${partyID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newHost }),
      credentials: "include",
    });

    if (response.ok) {
      setHost(newHost);
    }
  };

  const handleHost = (username: string) => {
    // const username = usernameRef.current?.textContent;
    const token = localStorage.getItem("token");
    console.log(username);

    if (username && token) {
      updatehost(token, username);
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
              className="flex items-center justify-around gap-2 p-2 hover:bg-slate-400 hover:transition hover:duration-700"
            >
              <span className="p-2 text-2xl">{participant.username}</span>
              {user === host && (
                <div className="flex gap-4">
                  <span
                    className="p-1 bg-green-700 hover:bg-green-800"
                    onClick={() => handleHost(participant.username)}
                  >
                    Host
                  </span>
                  <span className="p-1 bg-red-700 hover:bg-red-800">Kick</span>
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
