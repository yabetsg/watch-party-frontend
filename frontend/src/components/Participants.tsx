import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Participants = () => {
  interface Participants {
    _id: string;
    username: string;
  }

  const { partyID } = useParams();
  const [participants, setParticipants] = useState<Participants[]>([]);

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
      setParticipants(data);
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
            <button key={participant._id} className="flex items-center justify-around gap-2 p-2 hover:bg-slate-400 hover:transition hover:duration-700">
              <span className="p-2 text-2xl">{participant.username}</span>
              <div className="flex gap-4">
                <span className="p-1 bg-green-700 hover:bg-green-800">
                  Host
                </span>
                <span className="p-1 bg-red-700 hover:bg-red-800">Kick</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Participants;
