import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

import useUserData from "../hooks/useAppData";
import { XMarkIcon } from "@heroicons/react/24/solid";
const JoinPartyModal = ({display,onExit}:{display:boolean,onExit:()=>void}) => {
  const [partyID, setPartyID] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const partyRef = useRef<HTMLInputElement>(null);
  const { getUser } = useUserData();

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
      body: JSON.stringify({
        join: true,
      }),
      credentials: "include",
    });
    if (response.ok) {
      navigate(`/party/${partyID}`);
      const user = await getUser();
      socket.emit("join", { partyID, user });
      localStorage.setItem("curr_party", partyID);
    } else {
      const err = await response.json();
      setError(err.message);
    }
  };

  return (
    display&&
    <>
    
      <div className="absolute rounded-lg  p-16 flex flex-col border border-blue-500 bg-gradient-to-r from-[#274060] to-[#0d1422] font-['Kanit'] shadow-2xl">
        <XMarkIcon className="relative w-8 cursor-pointer left-48 bottom-10 hover:scale-110" onClick={onExit}/>
        <form
          action="/party"
          className="flex flex-col gap-8"
          onSubmit={joinParty}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="partyID">Enter party ID:</label>
            <input
              ref={partyRef}
              type="text"
              name="partyID"
              id="partyID"
              onChange={(e) => setPartyID(e.target.value)}
              className="p-2 text-black rounded-md outline-none border-[2px] focus:border-[#43acf3]"
              placeholder="party id"
            />
          </div>

          <button
            className="p-2 font-extrabold font-['Kanit'] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            type="submit"
          >
            Join
          </button>
        </form>
      </div>
      <div className="text-red-500">{error}</div>
    </>
  );
};

export default JoinPartyModal;
