import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import { socket } from "../socket";
const JoinPartyModal = () => {
    const [partyID,setPartyID]=useState("");
    const navigate = useNavigate();
    const partyRef = useRef<HTMLInputElement>(null);
    const joinParty = (event:FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        navigate(`/party/${partyID}`);
        socket.emit("join",partyRef.current?.value)
    }
  return (
    <div className="p-10">
        <form action="/party" className="flex flex-col" onSubmit={joinParty}>
            <label htmlFor="partyID">Party ID:</label>
            <input ref={partyRef} type="text" name="partyID" id="partyID" onChange={(e)=>setPartyID(e.target.value)} className="text-black"/>
            <button type="submit">Join</button>
        </form>
    </div>
  )
}

export default JoinPartyModal