import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

import useUserData from "../hooks/useUserData";
const JoinPartyModal = () => {
  const [partyID, setPartyID] = useState("");
  const navigate = useNavigate();
  const partyRef = useRef<HTMLInputElement>(null);
  const { getUser } = useUserData()
  const joinParty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    //
    const response = await fetch(`http://localhost:3000/party/${partyID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify({
        join:true
      }),
      credentials: "include",
    });
    if (response.ok) {
      navigate(`/party/${partyID}`);
      const user = await getUser()
      socket.emit("join", { partyID, user });
      localStorage.setItem("curr_party", partyID);
    }
  };
  return (
    <div className="p-10">
      <form action="/party" className="flex flex-col" onSubmit={joinParty}>
        <label htmlFor="partyID">Party ID:</label>
        <input
          ref={partyRef}
          type="text"
          name="partyID"
          id="partyID"
          onChange={(e) => setPartyID(e.target.value)}
          className="text-black"
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default JoinPartyModal;
