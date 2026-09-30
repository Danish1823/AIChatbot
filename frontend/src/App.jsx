import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    const userText = message;

    // Show user's message
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: userText
      }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
            "https://ai-chatbot-backend-ldb9.onrender.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userText
          })
        }
      );

      // Convert backend response to JavaScript object
      const data = await response.json();

      console.log("Backend response:", data);

      // Backend returned an error
      if (!response.ok) {
        throw new Error(data.error || "Backend error");
      }

      // Show AI response
      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          text: data.reply
        }
      ]);

    } catch (error) {

      console.error("Chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          text: `Error: ${error.message}`
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app">

      <div className="chat-container">

        <div className="header">
          <h1>AI Chatbot</h1>
          <p>Powered by Gemini</p>
        </div>

        <div className="messages">

          {messages.length === 0 && (
            <div className="welcome">
              <h2>Hello 👋</h2>
              <p>Ask me anything!</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role}`}
            >
              <div className="message-content">

                <strong>
                  {msg.role === "user" ? "You" : "AI"}
                </strong>

                <p>{msg.text}</p>

              </div>
            </div>
          ))}

          {loading && (
            <div className="message ai">
              <div className="message-content">
                <strong>AI</strong>
                <p>Thinking...</p>
              </div>
            </div>
          )}

        </div>

        <div className="input-area">

          <input
            type="text"
            placeholder="Ask something..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;