import React, { useState } from 'react';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl })
      });
      const data = await response.json();
      setShortUrl(data.shortUrl);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>URL Shortener</h1>
      <div style={styles.card}>
        <input 
          placeholder="Enter Long URL" 
          value={longUrl} 
          onChange={(e) => setLongUrl(e.target.value)} 
          style={styles.input} 
        />
        <button onClick={handleShorten} style={styles.button}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>

        {/* --- THIS IS THE NEW VIEW SPACE --- */}
{/* This only appears when the server sends back a link */}
{shortUrl && (
  <div style={styles.resultContainer}>
    <p style={styles.resultLabel}>Your Short Link:</p>
    <div style={styles.resultRow}>
      <input 
        readOnly 
        value={shortUrl} 
        style={styles.resultInput} 
      />
      <button 
        onClick={() => {
          navigator.clipboard.writeText(shortUrl);
          alert("Copied to clipboard!");
        }}
        style={styles.copyBtn}
      >
        Copy
      </button>
    </div>
    <a href={shortUrl} target="_blank" rel="noreferrer" style={styles.testLink}>
      Open link in new tab ↗
    </a>
  </div>
)}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default App;
