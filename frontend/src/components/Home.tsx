import generatePartyID from "../utils/randomID";
import JoinPartyModal from "./JoinPartyModal";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

import { handleLogout } from "../shared";
import useUserData from "../hooks/useUserData";
const Home = () => {
  const [displayJoinModal, setDisplayJoinModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  // const { user } = useContext(UserContext);
  const { getUser } = useUserData();
  const navigate = useNavigate();

  const handleCreate = async () => {
    const partyID = generatePartyID();
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/party/${partyID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const { data } = await response.json();
      const user = await getUser();
      socket.emit("join", { partyID, user });
      navigate(`/party/${data.partyID}`);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token === "undefined" || token === null) {
      navigate("/login");
    } else {
      const user = await getUser();
      if (user) {
        setLoading(false);
        setUsername(user);
      } else {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <main className="bg-[#272526] text-white h-screen flex flex-col">
      <nav className="flex justify-end gap-6 p-6 text-2xl border-b">
        {username ? (
          <>
            <div>{username}</div>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </nav>
      {!loading && (
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
      )}
    </main>
  );
};

export default Home;
