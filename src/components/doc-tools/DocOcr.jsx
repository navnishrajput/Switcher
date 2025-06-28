import React, { useState } from 'react';

export default function DocOcr({ onClose }) {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setExtractedText('');
    setError(null);
  };

  const handleExtract = async () => {
    if (!file) {
      setError('Please select a scanned DOC file to extract text.');
      return;
    }
    setError(null);

    try {
      // Placeholder for actual OCR logic on DOC files
      setExtractedText('Extracted text from scanned DOC file (simulation).');
      alert('Text extracted successfully! (Simulation)');
    } catch (err) {
      setError('Failed to extract text from DOC file.');
    }
  };

  return (
    <div>
      <h2>DOC OCR</h2>
      <p>Select a scanned DOC file to extract text using OCR.</p>
      <input type="file" accept=".doc,.docx" onChange={handleFileChange} />
      <button onClick={handleExtract}>Extract Text</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {extractedText && (
        <textarea
          rows={10}
          cols={50}
          value={extractedText}
          readOnly
        />
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
