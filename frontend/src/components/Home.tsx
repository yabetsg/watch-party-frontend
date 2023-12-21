import generatePartyID from "../utils/randomID";
import JoinPartyModal from "./JoinPartyModal";
import { useContext, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserProvider";
import { handleLogout } from "../shared";
const Home = () => {
  const [displayJoinModal, setDisplayJoinModal] = useState(false);
  //TODO: nav not updated unless refreshed
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const handleCreate = async () => {
    const id = generatePartyID();
    const token = localStorage.getItem("token");
    socket.emit("join", id);
    navigate("/party/" + id);
    const response = await fetch(`http://localhost:3000/party/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Stat: " + response.status);
    const r = await response.json();
    console.log("r: " + r);
  };

  return (
    <main className="bg-[#272526] text-white h-screen flex flex-col">
      <nav className="flex justify-end gap-6 p-6 text-2xl border-b">
        {user ? (
          <>
            <div>{user}</div>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </nav>
      <section className="flex items-center justify-center flex-grow">
        <div className="flex flex-col gap-4">
          <button
            className="p-8 font-bold rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            onClick={handleCreate}
          >
            Create Party
          </button>

          <button
            className="p-8 font-bold rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            onClick={() => setDisplayJoinModal(true)}
          >
            Join Party
          </button>
        </div>
        {displayJoinModal && <JoinPartyModal />}
      </section>
    </main>
  );
};

export default Home;
