import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(true);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  /*
  ========================================
  LOAD AVAILABLE VOICES
  ========================================
  */

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      const availableVoices =
        window.speechSynthesis.getVoices();

      console.log("Available voices:");

      availableVoices.forEach((voice, index) => {
        console.log(
          index,
          voice.name,
          voice.lang
        );
      });

      setVoices(availableVoices);
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged =
      loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /*
  ========================================
  AUTO SCROLL
  ========================================
  */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /*
  ========================================
  SPEECH RECOGNITION
  ========================================
  */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log(
        "Speech recognition is not supported."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    // English voice input
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      console.log(
        "You said:",
        transcript
      );

      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "Microphone error:",
        event.error
      );

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore stop error
      }
    };
  }, []);

  /*
  ========================================
  MICROPHONE
  ========================================
  */

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(
        "Voice recognition is not supported. Please use Google Chrome."
      );

      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error(
        "Microphone error:",
        error
      );
    }
  };

  /*
  ========================================
  FIND FEMALE ASSISTANT VOICE
  ========================================
  */

  const findFemaleVoice = () => {
    if (!voices.length) {
      return null;
    }

    /*
      Prefer voices that usually sound
      natural and suitable for an
      assistant.
    */

    const preferredVoices = [
      "Samantha",
      "Microsoft Jenny",
      "Microsoft Aria",
      "Microsoft Zira",
      "Microsoft Sonia",
      "Microsoft Libby",
      "Google US English Female",
      "Google UK English Female",
      "Karen",
      "Ava",
      "Victoria",
      "Allison",
      "Susan",
      "Jenny",
      "Aria",
      "Zira",
    ];

    /*
      Search preferred voices
    */

    for (const preferredName of preferredVoices) {
      const voice = voices.find((voice) =>
        voice.name
          .toLowerCase()
          .includes(
            preferredName.toLowerCase()
          )
      );

      if (voice) {
        return voice;
      }
    }

    /*
      Search for a voice containing
      "female"
    */

    const femaleVoice = voices.find(
      (voice) =>
        voice.name
          .toLowerCase()
          .includes("female")
    );

    if (femaleVoice) {
      return femaleVoice;
    }

    /*
      Search English voices
    */

    const englishVoice = voices.find(
      (voice) =>
        voice.lang
          .toLowerCase()
          .startsWith("en")
    );

    if (englishVoice) {
      return englishVoice;
    }

    /*
      Last option
    */

    return voices[0];
  };

  /*
  ========================================
  TEXT TO SPEECH
  ========================================
  */

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      alert(
        "Text-to-speech is not supported in this browser."
      );

      return;
    }

    /*
      Stop previous speech
    */

    window.speechSynthesis.cancel();

    /*
      Remove unnecessary markdown
      symbols before speaking.
    */

    const cleanText = text
      .replace(/[*#_`]/g, "")
      .replace(/\n+/g, ". ");

    const utterance =
      new SpeechSynthesisUtterance(
        cleanText
      );

    /*
      Find female voice
    */

    const femaleVoice =
      findFemaleVoice();

    if (femaleVoice) {
      utterance.voice =
        femaleVoice;

      console.log(
        "Selected voice:",
        femaleVoice.name
      );

      console.log(
        "Language:",
        femaleVoice.lang
      );
    }

    /*
      Siri-like assistant settings
    */

    utterance.lang =
      femaleVoice?.lang ||
      "en-US";

    // Slightly slower
    utterance.rate = 0.9;

    // Slightly higher pitch
    utterance.pitch = 1.15;

    // Full volume
    utterance.volume = 1;

    /*
      Speech starts
    */

    utterance.onstart = () => {
      setSpeaking(true);
    };

    /*
      Speech ends
    */

    utterance.onend = () => {
      setSpeaking(false);
    };

    /*
      Speech error
    */

    utterance.onerror = (event) => {
      console.error(
        "Speech error:",
        event
      );

      setSpeaking(false);
    };

    /*
      Start speaking
    */

    window.speechSynthesis.speak(
      utterance
    );
  };

  /*
  ========================================
  STOP SPEAKING
  ========================================
  */

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  };

  /*
  ========================================
  SEND MESSAGE TO FLASK
  ========================================
  */

  const sendMessage = async () => {
    if (
      !message.trim() ||
      loading
    ) {
      return;
    }

    const userText =
      message.trim();

    /*
      Add user message
    */

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: userText,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response =
        await fetch(
          "https://ai-chatbot-backend-ldb9.onrender.com/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message: userText,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "Backend response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Something went wrong"
        );
      }

      /*
        Add AI response
      */

      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          text: data.reply,
        },
      ]);

      /*
        Speak AI response
      */

      speakText(data.reply);

    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "ai",

          text:
            "Sorry, something went wrong.\n\n" +
            error.message,

          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  ENTER KEY
  ========================================
  */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  /*
  ========================================
  NEW CHAT
  ========================================
  */

  const newChat = () => {
    setMessages([]);
    setMessage("");

    stopSpeaking();
  };

  /*
  ========================================
  COPY MESSAGE
  ========================================
  */

  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(
        text
      );

      console.log(
        "Message copied"
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  /*
  ========================================
  UI
  ========================================
  */

  return (
    <div
      className={
        darkMode
          ? "app dark"
          : "app light"
      }
    >

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-top">

          <div className="logo">

            <div className="logo-icon">
              ✦
            </div>

            <span>
              AI Chatbot
            </span>

          </div>

          <button
            className="new-chat-btn"
            onClick={newChat}
          >
            <span>＋</span>

            New chat

          </button>

        </div>

        <div className="sidebar-content">

          <p className="sidebar-label">
            AI ASSISTANT
          </p>

          <div className="sidebar-info">

            <div className="info-icon">
              ✦
            </div>

            <div>

              <h3>
                Gemini AI
              </h3>

              <p>
                Female voice assistant
              </p>

            </div>

          </div>

        </div>

        <div className="sidebar-bottom">

          <div className="status">

            <span className="status-dot"></span>

            <span>
              AI Online
            </span>

          </div>

          <p className="version">
            AI Chatbot v1.0
          </p>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="mobile-logo">

            <div className="logo-icon">
              ✦
            </div>

            <span>
              AI Chatbot
            </span>

          </div>

          <div className="topbar-right">

            {speaking && (

              <button
                className="speaking-indicator"
                onClick={
                  stopSpeaking
                }
              >
                🔊 Speaking...
              </button>

            )}

            <button
              className="icon-btn"
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              title="Toggle theme"
            >
              {darkMode
                ? "☀"
                : "☾"}
            </button>

          </div>

        </header>


        {/* CHAT AREA */}

        <section className="chat-area">

          {messages.length === 0 ? (

            <div className="welcome-screen">

              <div className="welcome-icon">
                ✦
              </div>

              <h1>
                Meet your{" "}
                <span>
                  AI Assistant
                </span>
              </h1>

              <p>
                Ask questions, learn
                something new, or talk
                naturally with your AI
                assistant.
              </p>

              <div className="voice-badge">
                🎙️ Female assistant
                voice enabled
              </div>


              <div className="suggestions">

                <button
                  onClick={() =>
                    setMessage(
                      "Explain RAG in simple English"
                    )
                  }
                >

                  <span>
                    💡
                  </span>

                  <div>

                    <strong>
                      Explain something
                    </strong>

                    <small>
                      Explain RAG in simple
                      English
                    </small>

                  </div>

                </button>


                <button
                  onClick={() =>
                    setMessage(
                      "Give me a Python project idea"
                    )
                  }
                >

                  <span>
                    🐍
                  </span>

                  <div>

                    <strong>
                      Learn Python
                    </strong>

                    <small>
                      Give me a Python
                      project idea
                    </small>

                  </div>

                </button>


                <button
                  onClick={() =>
                    setMessage(
                      "Help me build an AI application"
                    )
                  }
                >

                  <span>
                    🤖
                  </span>

                  <div>

                    <strong>
                      Build with AI
                    </strong>

                    <small>
                      Help me build an AI
                      application
                    </small>

                  </div>

                </button>


                <button
                  onClick={() =>
                    setMessage(
                      "Explain how an API works"
                    )
                  }
                >

                  <span>
                    ⚡
                  </span>

                  <div>

                    <strong>
                      Understand technology
                    </strong>

                    <small>
                      Explain how an API
                      works
                    </small>

                  </div>

                </button>

              </div>

            </div>

          ) : (

            <div className="messages">

              {messages.map(
                (msg, index) => (

                  <div
                    key={index}
                    className={`message-row ${msg.role}`}
                  >

                    <div className="avatar">

                      {msg.role ===
                      "user"
                        ? "D"
                        : "✦"}

                    </div>


                    <div className="message-wrapper">

                      <div className="message-name">

                        {msg.role ===
                        "user"
                          ? "You"
                          : "AI Assistant"}

                      </div>


                      <div
                        className={`message-text ${
                          msg.error
                            ? "error-message"
                            : ""
                        }`}
                      >
                        {msg.text}
                      </div>


                      {msg.role ===
                        "ai" &&
                        !msg.error && (

                          <div className="message-actions">

                            <button
                              onClick={() =>
                                copyMessage(
                                  msg.text
                                )
                              }
                            >
                              ⧉ Copy
                            </button>

                            <button
                              onClick={() =>
                                speakText(
                                  msg.text
                                )
                              }
                            >
                              🔊 Speak
                            </button>

                          </div>

                        )}

                    </div>

                  </div>

                )
              )}


              {loading && (

                <div className="message-row ai">

                  <div className="avatar">
                    ✦
                  </div>

                  <div className="message-wrapper">

                    <div className="message-name">
                      AI Assistant
                    </div>

                    <div className="typing">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>

                </div>

              )}

              <div
                ref={messagesEndRef}
              />

            </div>

          )}

        </section>


        {/* INPUT */}

        <div className="input-section">

          <div
            className={`input-container ${
              listening
                ? "listening"
                : ""
            }`}
          >

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder={
                listening
                  ? "Listening..."
                  : "Message AI Chatbot..."
              }
              rows="1"
              disabled={loading}
            />


            <div className="input-actions">

              <button
                className={`input-icon ${
                  listening
                    ? "mic-active"
                    : ""
                }`}
                onClick={
                  toggleVoiceInput
                }
                type="button"
                title={
                  listening
                    ? "Stop listening"
                    : "Voice input"
                }
              >
                {listening
                  ? "⏹"
                  : "🎤"}
              </button>


              <button
                className="send-btn"
                onClick={
                  sendMessage
                }
                disabled={
                  !message.trim() ||
                  loading
                }
                title="Send message"
              >
                ➤
              </button>

            </div>

          </div>


          <p className="input-note">

            {listening
              ? "Listening to your voice..."
              : speaking
              ? "AI assistant is speaking..."
              : "AI can make mistakes. Check important information."}

          </p>

        </div>

      </main>

    </div>
  );
}

export default App;