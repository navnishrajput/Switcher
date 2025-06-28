import React, { useState } from 'react';

export default function DocConverterAdvanced({ onClose }) {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [includeImages, setIncludeImages] = useState(true);
  const [error, setError] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setConvertedFile(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a DOC file to convert.');
      return;
    }
    setError(null);

    try {
      // Placeholder for actual advanced DOC conversion logic
      setConvertedFile(`converted-file.${targetFormat}`);
      alert('DOC file converted successfully with advanced options! (Simulation)');
    } catch (err) {
      setError('Failed to convert DOC file.');
    }
  };

  return (
    <div>
      <h2>Advanced DOC Converter</h2>
      <p>Select a DOC file and configure advanced conversion options.</p>
      <input type="file" accept=".doc,.docx" onChange={handleFileChange} />
      <div>
        <label>
          Target Format:
          <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="txt">TXT</option>
            <option value="html">HTML</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Include Images:
          <input
            type="checkbox"
            checked={includeImages}
            onChange={(e) => setIncludeImages(e.target.checked)}
          />
        </label>
      </div>
      <button onClick={handleConvert}>Convert</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {convertedFile && <p>Converted file: {convertedFile}</p>}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
