import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleAsk = async () => {
    if (!prompt.trim()) return;

    const newMessages = [...messages, { role: 'user', text: prompt }];
    setMessages(newMessages);
    setPrompt('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/ask-gemini', { prompt });
      const aiResponse = res.data.response || 'No response from Gemini.';
      setMessages([...newMessages, { role: 'assistant', text: aiResponse }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', text: '❌ Failed to get response.' }]);
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
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#dcf8c6' : '#fff',
              borderTopLeftRadius: msg.role === 'user' ? 12 : 0,
              borderTopRightRadius: msg.role === 'user' ? 0 : 12,
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, backgroundColor: '#eee', alignSelf: 'flex-start' }}>
            Gemini is typing...
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
    </div>
  );
};

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
    textAlign: 'center'
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
    boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
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
    backgroundColor: '#fff'
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
    outline: 'none'
  }
};

export default App;
