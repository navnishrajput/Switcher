import React, { useState } from 'react';

export default function DocUnlocker({ onClose }) {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [unlockedFile, setUnlockedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUnlockedFile(null);
    setError(null);
  };

  const handleUnlock = async () => {
    if (!file) {
      setError('Please select a DOC file to unlock.');
      return;
    }
    if (!password) {
      setError('Please enter the password.');
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Placeholder for actual DOC unlock logic
      setUnlockedFile(file.name.replace('.docx', '-unlocked.docx'));
    } catch (err) {
      setError('Failed to unlock DOC file. Please check the password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="doc-unlocker-container">
      <div className="doc-unlocker-header">
        <h2>DOC Unlocker</h2>
        <p>Select a password-protected DOC file and enter the password to unlock it.</p>
      </div>
      
      <div className="input-group">
        <label htmlFor="file-input">Select DOC File:</label>
        <input 
          id="file-input"
          type="file" 
          accept=".doc,.docx" 
          onChange={handleFileChange} 
        />
        {file && <div className="file-info">Selected: {file.name}</div>}
      </div>
      
      <div className="input-group">
        <label htmlFor="password-input">Password:</label>
        <input
          id="password-input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="button-group">
        <button 
          onClick={handleUnlock} 
          disabled={isLoading}
          className="unlock-button"
        >
          {isLoading ? 'Processing...' : 'Unlock'}
        </button>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {unlockedFile && (
        <div className="success-message">
          <p>File unlocked successfully!</p>
          <a href="#" download={unlockedFile} className="download-link">
            Download {unlockedFile}
          </a>
        </div>
      )}

      <style jsx>{`
        .doc-unlocker-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          background-color: #fff;
          font-family: Arial, sans-serif;
        }
        
        .doc-unlocker-header {
          margin-bottom: 20px;
          text-align: center;
        }
        
        .doc-unlocker-header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .input-group {
          margin-bottom: 15px;
        }
        
        .input-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #34495e;
        }
        
        .input-group input[type="file"],
        .input-group input[type="password"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .file-info {
          margin-top: 5px;
          font-size: 14px;
          color: #7f8c8d;
        }
        
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .unlock-button {
          flex: 1;
          padding: 12px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .unlock-button:hover {
          background-color: #2980b9;
        }
        
        .unlock-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .close-button {
          flex: 1;
          padding: 12px;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .close-button:hover {
          background-color: #c0392b;
        }
        
        .error-message {
          color: #e74c3c;
          margin-top: 15px;
          padding: 10px;
          background-color: #fadbd8;
          border-radius: 4px;
          border-left: 4px solid #e74c3c;
        }
        
        .success-message {
          color: #27ae60;
          margin-top: 15px;
          padding: 10px;
          background-color: #d5f5e3;
          border-radius: 4px;
          border-left: 4px solid #27ae60;
        }
        
        .download-link {
          display: inline-block;
          margin-top: 5px;
          color: #2980b9;
          text-decoration: none;
          font-weight: bold;
        }
        
        .download-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}