import React, { useState, useRef } from 'react';

const PDFProtector = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [protectedUrl, setProtectedUrl] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError('');
    setProtectedUrl(null);
    setPassword('');

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }

    setFile(selectedFile);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const createDownloadUrl = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProtectedUrl(url);
  };

  const handleDownloadClick = () => {
    if (!protectedUrl) return;
    const link = document.createElement('a');
    link.href = protectedUrl;
    link.download = `protected_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setFile(null);
    setPassword('');
    setProtectedUrl(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      borderRadius: '12px',
      backgroundColor: '#f9faff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{ textAlign: 'center', color: '#2c7cb4', marginBottom: '1.5rem' }}>PDF Protector</h1>

      <div
        style={{
          border: '2px dashed #3e92cc',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '1rem',
          cursor: 'pointer',
          backgroundColor: file ? '#e6f0ff' : 'white',
          transition: 'background-color 0.3s ease'
        }}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <p style={{ fontSize: '1.2rem', color: '#3e92cc', margin: 0 }}>
          {file ? file.name : 'Click to select a PDF file'}
        </p>
        <p style={{ fontSize: '1rem', color: '#666', marginTop: '0.25rem' }}>
          {file ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Max 50MB'}
        </p>
      </div>

      {error && (
        <div style={{
          color: 'red',
          padding: '0.75rem',
          marginBottom: '1rem',
          borderRadius: '6px',
          backgroundColor: '#ffe6e6',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          {error}
        </div>
      )}

      {file && !protectedUrl && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c7cb4' }}>
            Enter Password to Protect PDF (Note: Maybe show error)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #3e92cc',
              fontSize: '1rem',
              marginBottom: '1rem',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={createDownloadUrl}
            disabled={password.length < 4}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: password.length >= 4 ? '#2c7cb4' : '#a0c4ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: password.length >= 4 ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s ease'
            }}
          >
            Proceed to Download
          </button>
          <button
            onClick={resetForm}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '0.75rem'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {protectedUrl && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleDownloadClick}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginRight: '1rem',
              boxShadow: '0 4px 10px rgba(40,167,69,0.4)'
            }}
          >
            Download PDF
          </button>
          <button
            onClick={resetForm}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(108,117,125,0.4)'
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFProtector;
