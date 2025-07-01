import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

const handleAsk = async () => {
  if (!prompt.trim()) return;

  setLoading(true);
  setResponse('');

  try {
    const res = await axios.post(`http://localhost:3000/ask-gemini`, { prompt });
    setResponse(res.data.response || 'No response from Gemini.');
    console.log("Gemini Response:", res.data);
  } catch (err) {
    setResponse('❌ Failed to get response from Gemini.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '800px', margin: 'auto' }}>
      <h2>💬 Ask Gemini AI</h2>
      <textarea
        rows="5"
        cols="60"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your question here..."
        style={{ fontSize: '1rem', padding: '0.5rem' }}
      />
      <br />
      <button
        onClick={handleAsk}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
        disabled={loading}
      >
        {loading ? 'Asking...' : 'Ask'}
      </button>

      <h3 style={{ marginTop: '2rem' }}>🧠 Gemini's Response:</h3>
      <div
        style={{
          whiteSpace: 'pre-wrap',
          backgroundColor: '#f4f4f4',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #ddd',
          minHeight: '100px',
          fontSize: '1rem'
        }}
      >
        {response}
      </div>
    </div>
  );
};

export default App;
