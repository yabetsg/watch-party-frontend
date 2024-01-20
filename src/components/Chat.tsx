import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import uuid from "react-uuid";
import useUserData from "../hooks/useAppData";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface Message {
  messageID: string;
  user: string;
  content: string;
  timestamp: number;
}
const Chat = () => {
  const { getUser } = useUserData();
  const [chatValue, setChatValue] = useState<string>("");
  const [chat, setChat] = useState<Message[]>([]);
  const { partyID } = useParams();
  const token = localStorage.getItem("token");

  const saveMessage = async (
    token: string,
    partyID: string,
    message: Message
  ) => {
    const response = await fetch(
      `http://localhost:3000/party/${partyID}/chat`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ message, partyID }),
      }
    );

    if (!response.ok) {
      console.error("error saving chat");
    }
  };
  const sendChat = async () => {
    const id = uuid();
    const token = localStorage.getItem("token");
    const user = await getUser();
    const message = {
      user,
      messageID: id,
      content: chatValue,
      timestamp: Date.now(),
    } as Message;
    socket.emit("chat", partyID, message);

    setChat((prevMessages) => [...prevMessages, message]);

    if (token && partyID) {
      saveMessage(token, partyID, message).catch((err) => console.log(err));
    }

    setChatValue("");
  };

  const initializeChat = async (token: string) => {
    const response = await fetch(
      `http://localhost:3000/party/${partyID}/chat`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const { chat } = await response.json();
      if (chat) {
        setChat(chat.messages);
      }
    }
  };
  useEffect(() => {
    if (token) {
      initializeChat(token);
    }
    const handleChat = (message: Message) => {
      setChat((prevMsg) => [...prevMsg, message]);
    };

    socket.on("chat", handleChat);
    return () => {
      socket.off("chat", handleChat);
    };
  }, [socket]);

  return (
    <section className="flex-1 font-['Kanit'] flex flex-col">
      <div className="flex flex-col  overflow-y-auto max-lg:h-[180px] lg:h-[500px]">
        {chat &&
          chat.map((message) => {
            return (
              <div key={message.messageID} className="flex p-2 ">
                <div className="pt-1 pb-2 pr-2">
                  <UserCircleIcon className="w-8 max-w-8" />
                </div>
                <div className="flex flex-col ">
                  <div className="font-black">{message.user}</div>
                  <div className="font-thin text-gray-300">
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="flex p-2 border border-[#65b5eb] rounded-full">
        <input
          type="text"
          className="flex-1 p-2 bg-transparent outline-none"
          value={chatValue}
          onChange={(e) => setChatValue(e.target.value)}
        />
        <button
          onClick={sendChat}
          className={`${chatValue ? "opacity-100" : "opacity-20"}`}
        >
          <IoSend size={25} />
        </button>
      </div>
    </section>
  );
};

export default Chat;
