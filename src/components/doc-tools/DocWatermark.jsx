import React, { useState } from 'react';

export default function DocWatermark({ onClose }) {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [error, setError] = useState(null);
  const [watermarkedFile, setWatermarkedFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setWatermarkedFile(null);
    setError(null);
  };

  const handleAddWatermark = async () => {
    if (!file) {
      setError('Please select a DOC file to add watermark.');
      return;
    }
    if (!watermarkText) {
      setError('Please enter watermark text.');
      return;
    }
    setError(null);

    try {
      // Placeholder for actual DOC watermark logic
      setWatermarkedFile('watermarked-doc-file.docx');
      alert('Watermark added successfully! (Simulation)');
    } catch (err) {
      setError('Failed to add watermark to DOC file.');
    }
  };

  return (
    <div>
      <h2>DOC Watermark</h2>
      <p>Select a DOC file and enter watermark text to add.</p>
      <input type="file" accept=".doc,.docx" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter watermark text"
        value={watermarkText}
        onChange={(e) => setWatermarkText(e.target.value)}
      />
      <button onClick={handleAddWatermark}>Add Watermark</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {watermarkedFile && <p>Watermarked file: {watermarkedFile}</p>}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
