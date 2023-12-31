import React, { useState } from 'react'
import { IoSend } from 'react-icons/io5'

const Chat = () => {
  const [chatValue, setChatValue] = useState("");

  return (
    <section className="flex-1">
    <div className="flex h-[90%]"></div>
    <div className="flex p-2 border rounded-full">
      <input
        type="text"
        className="flex-1 p-2 bg-transparent outline-none"
        onChange={(e) => setChatValue(e.target.value)}
      />
      <button className={`${chatValue ? "opacity-100" : "opacity-20"}`}>
        <IoSend size={25} />
      </button>
    </div>
  </section>
  )
}

export default Chat