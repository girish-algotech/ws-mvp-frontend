"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("wss://ws-mvp-backend.onrender.com/");

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const onNewMessageAvailable = (message: string) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessageAvailable", onNewMessageAvailable);

    return () => {
      socket.off("newMessageAvailable", onNewMessageAvailable);
    };
  }, []);

  const onButtonClick = () => {
    socket.emit("newMessage", message);
    setMessage("");
  };

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="mb-20 text-center text-2xl">Chat app</h1>
      <div className="flex flex-row">
        <input
          className="w-80 h-10 border-2 border-gray-300 rounded-md p-2"
          value={message}
          type="text"
          placeholder="Enter message"
          onChange={onTextChange}
        />
        <button
          className="bg-amber-600 w-20 text-white ml-6 rounded-md"
          onClick={onButtonClick}
        >
          Send
        </button>
      </div>

      <div className="mt-12">
        <h1 className="underline">Messages</h1>
        <div>
          {messages.map((message, index) => (
            <div key={index} className="">
              {message}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
