import generatePartyID from "../utils/randomID";
import JoinPartyModal from "./JoinPartyModal";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { handleLogout } from "../shared";
import useUserData from "../hooks/useAppData";
const Home = () => {
  const [displayJoinModal, setDisplayJoinModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [displayDropdown, setDisplayDropdown] = useState<boolean>(false);
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
      socket.emit("create", { partyID, user });
      localStorage.setItem("host", user);
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

  const handleProfileDropdown = () => {
    setDisplayDropdown((prevState) => !prevState);
  };

  const handleDisplayModal = () => {
    setDisplayJoinModal((prevState) => !prevState);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <main className="flex flex-col h-screen text-white bg-gradient-to-r from-[#274060] to-[#1B2845]">
      <nav className="flex justify-between gap-6 p-7 text-2xl border-b border-b-[#65b5eb]">
        <div className="font-['Lemon'] text-4xl" onClick={() => navigate("/")}>
          <span className="text-[#43acf3]">Watch</span>
          <span className="text-[#a855f7]">Party</span>
        </div>
        {username ? (
          <>
            <div
              className="flex cursor-pointer"
              onClick={handleProfileDropdown}
            >
              <div className="flex items-center pl-2 lg:gap-2">
                <UserCircleIcon className="w-7" />
                <div className="text-2xl font-['Kanit'] max-sm:hidden">
                  {username}
                </div>
                <ChevronDownIcon className="w-3 max-w-3" />
              </div>

              <div
                className={`absolute self-end p-2 text-lg text-center border rounded-md w-28 bg-[#274060] duration-200 right-8 top-20 border-[#65b5eb] ${
                  displayDropdown ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="text-red-500" onClick={handleLogout}>
                  Sign out
                </div>
              </div>
            </div>
          </>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </nav>

      {!loading && (
        <section className="flex items-center justify-center flex-grow">
          <div className="flex flex-col gap-4">
            <button
              className="p-8 font-extrabold rounded-full font-['Kanit'] bg-gradient-to-r from-cyan-500 to-blue-500"
              onClick={handleCreate}
            >
              Create Party
            </button>

            <button
              className="p-8 font-extrabold font-['Kanit'] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              onClick={handleDisplayModal}
            >
              Join Party
            </button>
          </div>
          <JoinPartyModal
            display={displayJoinModal}
            onExit={handleDisplayModal}
          />
        </section>
      )}
    </main>
  );
};

export default Home;
