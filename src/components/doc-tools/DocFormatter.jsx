import React, { useState } from 'react';

export default function DocFormatter({ onClose }) {
  const [file, setFile] = useState(null);
  const [formatOptions, setFormatOptions] = useState({
    fontSize: 12,
    fontFamily: 'Arial',
    lineSpacing: 1.5,
  });
  const [error, setError] = useState(null);
  const [formattedFile, setFormattedFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormattedFile(null);
    setError(null);
  };

  const handleFormatChange = (e) => {
    const { name, value } = e.target;
    setFormatOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormat = async () => {
    if (!file) {
      setError('Please select a DOC file to format.');
      return;
    }
    setError(null);

    try {
      // Placeholder for actual DOC formatting logic
      setFormattedFile('formatted-doc-file.docx');
      alert('DOC file formatted successfully! (Simulation)');
    } catch (err) {
      setError('Failed to format DOC file.');
    }
  };

  return (
    <div>
      <h2>DOC Formatter</h2>
      <p>Select a DOC file and choose formatting options.</p>
      <input type="file" accept=".doc,.docx" onChange={handleFileChange} />
      <div>
        <label>
          Font Size:
          <input
            type="number"
            name="fontSize"
            value={formatOptions.fontSize}
            onChange={handleFormatChange}
            min={8}
            max={72}
          />
        </label>
      </div>
      <div>
        <label>
          Font Family:
          <input
            type="text"
            name="fontFamily"
            value={formatOptions.fontFamily}
            onChange={handleFormatChange}
          />
        </label>
      </div>
      <div>
        <label>
          Line Spacing:
          <input
            type="number"
            name="lineSpacing"
            value={formatOptions.lineSpacing}
            onChange={handleFormatChange}
            step={0.1}
            min={1}
            max={3}
          />
        </label>
      </div>
      <button onClick={handleFormat}>Format</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {formattedFile && <p>Formatted file: {formattedFile}</p>}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
