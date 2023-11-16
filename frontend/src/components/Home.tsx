// import { useState } from "react";
import { Link } from "react-router-dom";
import generatePartyID from "../utils/randomID";
import JoinPartyModal from "./JoinPartyModal";
import { useState } from "react";
const Home = () => {
  const [displayJoinModal, setDisplayJoinModal] = useState(false);
  return (
    <main className="bg-[#272526] text-white h-screen flex flex-col">
      <nav className="flex justify-end gap-6 p-6 text-2xl border-b">
        <div>John Doe</div>
        <button>Log out</button>
      </nav>
      <section className="flex items-center justify-center flex-grow">
        <div className="flex flex-col gap-4">
          <Link to={`/party/${generatePartyID()}`}>
            <button
              className="p-8 font-bold rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"

            >
              Create Party
            </button>
          </Link>
          <button className="p-8 font-bold rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" onClick={()=>setDisplayJoinModal(true)}>
            Join Party
          </button>
        </div>
      {displayJoinModal&&<JoinPartyModal/>}
      </section>

    </main>
  );
};

export default Home;
