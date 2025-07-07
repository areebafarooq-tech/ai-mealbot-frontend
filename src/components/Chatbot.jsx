import React, { useState, useEffect } from "react";
import "../styles/chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const welcomeMessage = {
      role: "bot",
      content: "👋 Hey! I'm Milo. How can I help you today?",
      source: "bot"
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, source: "user" };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage = {
        role: "bot",
        content: data.answer || "⚠️ No response from AI.",
        source: data.source || "bot",
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages(prev => [
        ...prev,
        { role: "bot", content: "⚠️ Server error.", source: "error" },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something like 'I’m happy' or 'Recommend biryani'"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
