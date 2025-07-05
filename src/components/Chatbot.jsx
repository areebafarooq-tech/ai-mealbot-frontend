import React, { useState } from "react";
import { foodData } from "../data/dummyData";
import axios from "axios";
import "../styles/chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([
    { role: "bot", content: "Hello! I’m your AI food assistant. How can I help you today?" },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newChat = [...chat, { role: "user", content: input }];
    setChat(newChat);
    setInput("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        { messages: newChat }
      );
      const botMessage = response.data.choices[0].message.content;

      setChat((prev) => [...prev, { role: "bot", content: botMessage }]);
    } catch (err) {
      console.error("API error:", err.response ? err.response.data : err.message);
      setChat((prev) => [
        ...prev,
        { role: "bot", content: "Error fetching response ❌" },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {chat.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
