import { Dispatch, SetStateAction } from "react";
interface MenuProps {
  menu: string;
  setMenu: Dispatch<SetStateAction<string>>;
}

const Menu = ({ menu, setMenu }: MenuProps) => {
  return (
    <div className="right-0 flex justify-center gap-4 top-15">
      <div className="">
        <button
          className="p-1"
          onClick={() => {
            setMenu("chat");
          }}
        >
          Chat
        </button>
        {menu === "chat" && (
          <div className="w-full h-1 rounded-lg bg-[#09618E]"></div>
        )}
      </div>

      <div className="">
        <button
          className="p-1"
          onClick={() => {
            console.log("setting to participants");
            setMenu("participants");
          }}
        >
          Participants
        </button>
        {menu === "participants" && (
          <div className="w-full h-1 rounded-lg bg-[#09618E]"></div>
        )}
      </div>
    </div>
  );
};

export default Menu;
