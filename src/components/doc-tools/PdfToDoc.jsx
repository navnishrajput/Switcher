import React, { useState } from 'react';

export default function PdfToDoc({ onClose }) {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setConvertedFile(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file to convert.');
      return;
    }
    setError(null);

    try {
      // Placeholder for actual PDF to DOC conversion logic
      setConvertedFile('converted-file.docx');
      alert('PDF file converted to DOC successfully! (Simulation)');
    } catch (err) {
      setError('Failed to convert PDF file.');
    }
  };

  return (
    <div>
      <h2>PDF to DOC Converter</h2>
      <p>Select a PDF file to convert it to DOC format.</p>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleConvert}>Convert</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {convertedFile && <p>Converted file: {convertedFile}</p>}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
