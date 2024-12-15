import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css"; // Import the CSS for styling
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CloseIcon from '@mui/icons-material/Close';
import { chatRag } from "../../store/main/actions";
import { connect } from "react-redux";

const Chatbot = ({ chatRag, ragResponse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [enlarge, setEnlarge] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello, good to see you. I'm an AI chatbot. Do you have any questions for me?`
    },
    // {
    //   sender: "user",
    //   text:
    //     "Tell me what is the monthly energy consumption KPI for the Large Capacity Cutting Machine from 19th February 2020 to half of March 2020."
    // },
    // { sender: "processing", text: `Formulating textual response…` },
    
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const chatBodyRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      
      try {
        // Add user message
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: "user", text: inputMessage }
        ]);
        // API Request
        if (lastQuery === "") {
          await chatRag({ message: inputMessage });
          setLastQuery(inputMessage);
        } else {
          await chatRag({ message: inputMessage, previous_query: lastQuery });
        }
      } catch (error) {
        console.log(error);
      }

      setInputMessage("");
    }
  };

  const handleKeyDown = e => {
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

  useEffect(() => {
      if (ragResponse) {
        const formatResponse = ragResponse.split('"""');
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: "processing", text: `${formatResponse[0]}` },
          { sender: "bot", text: `${formatResponse[1] || ""}` }
        ]);
      }
  }, [ragResponse]);

  return (
    <div className="chatbot">
      {/* Floating Button */}
      <div className="chatbot-icon" onClick={toggleChat}>
        <SmartToyIcon />
      </div>

      {/* Chat Panel */}
      {isOpen &&
        <div className="chat-panel" style={{ width: enlarge ? "45%" : "400px", height: enlarge ? "70%" : "400px" }}>
          <div className="chat-header">
            <h4>Kreative Chatbot</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              
              <AspectRatioIcon className="close-btn" onClick={() => setEnlarge(!enlarge)} />
              <CloseIcon className="close-btn" onClick={toggleChat} />
              
            </div>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((message, index) =>
              <div
                key={index}
                className={`chat-message ${message.sender === "user"
                  ? "user-message"
                  : message.sender === "bot"
                    ? "bot-message"
                    : "processing-message"}`}
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            )}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={inputMessage}
              placeholder="Type your message..."
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      }
    </div>
  );
};

const mapStatetoProps = ({ main }) => ({
  ragResponse: main.ragResponse,
  loading: main.loading
});

export default connect(mapStatetoProps, { chatRag })(Chatbot);
