import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleAsk = async () => {
    if (!prompt.trim()) return;

    const newMessages = [...messages, { role: 'user', text: prompt, time: getTime() }];
    setMessages(newMessages);
    setPrompt('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/ask-gemini', { prompt });
      const aiResponse = res.data.response || 'No response from Gemini.';

      setMessages([
        ...newMessages,
        { role: 'assistant', text: aiResponse, time: getTime() }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', text: '❌ Failed to get response.', time: getTime() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      <div style={styles.chatHeader}>💬 Gemini AI Chat</div>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              animation: 'fadeIn 0.3s ease',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#dcf8c6' : '#fff',
              borderTopLeftRadius: msg.role === 'user' ? 12 : 0,
              borderTopRightRadius: msg.role === 'user' ? 0 : 12,
              position: 'relative'
            }}
          >
            {msg.text}
            <span style={styles.timestamp}>{msg.time}</span>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, backgroundColor: '#eee', alignSelf: 'flex-start' }}>
            <TypingDots />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          rows="2"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a message"
          style={styles.textarea}
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          style={styles.sendButton}
        >
          ➤
        </button>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes typing {
          0% { opacity: 0.2 }
          20% { opacity: 1 }
          100% { opacity: 0.2 }
        }

        .typing span {
          display: inline-block;
          font-size: 1.2rem;
          animation: typing 1.5s infinite;
        }

        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

const TypingDots = () => (
  <div className="typing">
    <span>.</span><span>.</span><span>.</span>
  </div>
);

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#e5ddd5',
    fontFamily: 'Segoe UI, sans-serif'
  },
  chatHeader: {
    backgroundColor: '#075e54',
    color: '#fff',
    padding: '1rem',
    fontSize: '1.2rem',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  chatBox: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  message: {
    padding: '0.7rem 1rem',
    borderRadius: '12px',
    maxWidth: '70%',
    fontSize: '1rem',
    wordWrap: 'break-word',
    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease-in-out'
  },

  inputContainer: {
    display: 'flex',
    padding: '0.75rem',
    backgroundColor: '#f0f0f0',
    borderTop: '1px solid #ccc'
  },
  textarea: {
    flex: 1,
    border: 'none',
    borderRadius: '20px',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    resize: 'none',
    outline: 'none',
    backgroundColor: '#fff',
    transition: 'box-shadow 0.2s ease-in-out'
  },
  sendButton: {
    backgroundColor: '#128c7e',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    marginLeft: '0.5rem',
    fontSize: '1.2rem',
    cursor: 'pointer',
    outline: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s'
  }
,
  bubbleContent: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: '0.5rem',
  flexWrap: 'wrap',
},

timestamp: {
  fontSize: '0.72rem',
  color: '#888',
  marginLeft: 'auto',
  marginTop: '0.3rem',
  display: 'block',
  alignSelf: 'flex-end',
}

};



export default App;
