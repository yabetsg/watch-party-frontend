import { UserGroupIcon } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
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
          className="flex gap-2 p-1"
          onClick={() => {
            setMenu("chat");
          }}
        >
          Chat
          <ChatBubbleOvalLeftEllipsisIcon className="w-5" />
        </button>
        {menu === "chat" && (
          <div className="w-full h-1 rounded-lg bg-[#09618E]"></div>
        )}
      </div>

      <div className="">
        <button
          className="flex gap-2 p-1"
          onClick={() => {
            setMenu("participants");
          }}
        >
          Participants
          <UserGroupIcon className="w-5" />
        </button>
        {menu === "participants" && (
          <div className="w-full h-1 rounded-lg bg-[#09618E]"></div>
        )}
      </div>
    </div>
  );
};

export default Menu;
