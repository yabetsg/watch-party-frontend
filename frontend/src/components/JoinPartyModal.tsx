import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom"

const JoinPartyModal = () => {
    const [partyID,setPartyID]=useState("");
    const navigate = useNavigate();
    
    const handleSubmit = (event:FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        navigate(`/party/${partyID}`);


    }
  return (
    <div className="p-10">
        <form action="/party" className="flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="partyID">Party ID:</label>
            <input type="text" name="partyID" id="partyID" onChange={(e)=>setPartyID(e.target.value)} className="text-black"/>
            <button type="submit">Join</button>
        </form>
    </div>
  )
}

export default JoinPartyModal