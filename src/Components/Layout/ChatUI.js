import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css"; // Import the CSS for styling
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello, good to see you. I'm an AI chatbot. Do you have any questions for me?`,
    },
    {
      sender: "user",
      text: "Tell me what is the monthly energy consumption KPI for the Large Capacity Cutting Machine from 19th February 2020 to half of March 2020.",
    },
    { sender: "processing", text: `Retrieving data of _List of machines_` },
    { sender: "processing", text: `Selecting dates from _begin_ to _end_` },
    { sender: "processing", text: `Using KPI calculation engine to compute _Nome KPI_` },
    { sender: "processing", text: `Formulating textual response…` },
    {
      sender: "bot",
      text: `<h2>Energy Consumption KPI</h2>
      <p><strong>Machine Name:</strong> Large Capacity Cutting Machine</p>
      <p><strong>Time Period:</strong> 19th February 2020 – 15th March 2020</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Date Range</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Energy Consumption (kWh)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">19th – 29th Feb 2020</td>
            <td style="border: 1px solid #ddd; padding: 8px;">3,450 kWh</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">1st – 15th Mar 2020</td>
            <td style="border: 1px solid #ddd; padding: 8px;">2,300 kWh</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Total</td>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">5,750 kWh</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 20px;">
        <h3>Insights:</h3>
        <ul>
          <li><strong>Daily Average Consumption:</strong> Approximately 230 kWh/day</li>
          <li><strong>Peak Usage Date:</strong> 27th February 2020 with 450 kWh consumption</li>
          <li><strong>Comparison:</strong> Energy consumption reduced by ~5% in March compared to the last 10 days of February</li>
        </ul>
      </div>`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const chatBodyRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Add user message
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: inputMessage },
      ]);

      // Simulated bot response sequence
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "processing", text: `Retrieving data of _List of machines_` },
        ]);
      }, 1500);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "processing", text: `Selecting dates from _begin_ to _end_` },
        ]);
      }, 2500);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "processing", text: `Using KPI calculation engine to compute _Nome KPI_` },
        ]);
      }, 4000);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "processing", text: `Formulating textual response…` },
        ]);
      }, 6000);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: `You said: ${inputMessage}` },
        ]);
      }, 9000);

      setInputMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatbot">
      {/* Floating Button */}
      <div className="chatbot-icon" onClick={toggleChat}>
        <SmartToyIcon />
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <h4>Kreative Chatbot</h4>
            <button className="close-btn" onClick={toggleChat}>
              ✖
            </button>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.sender === "user"
                    ? "user-message"
                    : message.sender === "bot"
                    ? "bot-message"
                    : "processing-message"
                }`}
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={inputMessage}
              placeholder="Type your message..."
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
