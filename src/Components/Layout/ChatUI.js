import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css"; // Import the CSS for styling
import SmartToyIcon from "@mui/icons-material/SmartToy"; // Icon for chatbot
import AspectRatioIcon from '@mui/icons-material/AspectRatio'; // Icon for resizing the chat window
import CloseIcon from '@mui/icons-material/Close'; // Icon for closing the chat window
import { chatRag } from "../../store/main/actions"; // Import action to handle API call for chatting
import { connect } from "react-redux"; // Connect component to Redux store

// Chatbot component definition
const Chatbot = ({ chatRag, ragResponse }) => {
  // State hooks for managing component state
  const [isOpen, setIsOpen] = useState(false); // Toggle for chat window visibility
  const [enlarge, setEnlarge] = useState(false); // Toggle for resizing the chat window
  const [lastQuery, setLastQuery] = useState(""); // Store the last user query
  const [messages, setMessages] = useState([ // Initial state of chat messages
    {
      sender: "bot", // Initial bot message
      text: `Hello, good to see you. I'm an AI chatbot. Do you have any questions for me?`
    },
  ]);
  const [inputMessage, setInputMessage] = useState(""); // Store the input message from the user

  const chatBodyRef = useRef(null); // Reference to the chat body element for auto-scrolling

  // Function to toggle the chat panel visibility
  const toggleChat = () => {
    setIsOpen(!isOpen); // Toggle between open and closed states
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim()) { // Only send if the input message is not empty
      try {
        // Add user message to the chat
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: "user", text: inputMessage }
        ]);
        // Make an API request to get the bot's response
        if (lastQuery === "") {
          setLastQuery(inputMessage); // Set the current query as the last query
          await chatRag({ message: inputMessage }); // Send the input message for first query
        } else {
          setLastQuery(inputMessage); // Set the current query as the last query
          await chatRag({ message: inputMessage, previous_query: lastQuery }); // Send the input message along with the previous query
        }
      } catch (error) {
        console.log(error); // Handle any errors during the API call
      }

      setInputMessage(""); // Clear the input message after sending
    }
  };

  // Handle "Enter" key to send the message
  const handleKeyDown = e => {
    if (e.key === "Enter") {
      handleSendMessage(); // Send the message when "Enter" is pressed
    }
  };

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; // Scroll to the bottom of the chat body
    }
  }, [messages]); // Effect runs whenever messages state changes

  // Update chat with the response from the backend
  useEffect(() => {
    if (ragResponse) {
      const formatResponse = ragResponse.split('***'); // Split the response from the *
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: "processing", text: `${formatResponse[0]}` }, // Add processing message
        { sender: "bot", text: `${formatResponse[1] || ""}` } // Add bot response message
      ]);
    }
  }, [ragResponse]); // This effect runs whenever ragResponse changes

  return (
    <div className="chatbot">
      {/* Floating Button to open/close chat */}
      <div className="chatbot-icon" onClick={toggleChat}>
        <SmartToyIcon /> {/* Icon for the chatbot */}
      </div>

      {/* Chat Panel */}
      {isOpen && // Only render the chat panel if it's open
        <div className="chat-panel" style={{ width: enlarge ? "45%" : "400px", height: enlarge ? "70%" : "400px" }}>
          {/* Chat Header */}
          <div className="chat-header">
            <h4>Kreative Chatbot</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Resize Button */}
              <AspectRatioIcon className="close-btn" onClick={() => setEnlarge(!enlarge)} /> {/* Toggle enlarge */}
              {/* Close Button */}
              <CloseIcon className="close-btn" onClick={toggleChat} /> {/* Close the chat */}
            </div>
          </div>

          {/* Chat Body */}
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((message, index) =>
              <div
                key={index}
                className={`chat-message ${message.sender === "user"
                  ? "user-message"
                  : message.sender === "bot"
                    ? "bot-message"
                    : "processing-message"}`}
                dangerouslySetInnerHTML={{ __html: message.text }} // Render HTML content inside the message
              />
            )}
          </div>

          {/* Chat Footer - Input field and Send Button */}
          <div className="chat-footer">
            <input
              type="text"
              value={inputMessage}
              placeholder="Type your message..."
              onChange={e => setInputMessage(e.target.value)} // Update input message as the user types
              onKeyDown={handleKeyDown} // Listen for "Enter" key press
            />
            <button onClick={handleSendMessage}>Send</button> {/* Button to send the message */}
          </div>
        </div>
      }
    </div>
  );
};

// Map state from Redux store to component props
const mapStatetoProps = ({ main }) => ({
  ragResponse: main.ragResponse, // Get the chat response from the Redux store
  loading: main.loading // Get the loading state from the Redux store (if applicable)
});

// Connect the component to Redux store and dispatch actions
export default connect(mapStatetoProps, { chatRag })(Chatbot);
