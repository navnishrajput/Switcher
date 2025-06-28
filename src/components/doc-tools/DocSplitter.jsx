import React, { useState } from 'react';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function DocSplitter({ onClose }) {
  const [file, setFile] = useState(null);
  const [splitRanges, setSplitRanges] = useState('');
  const [splitFiles, setSplitFiles] = useState([]);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState('docx');
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitMode, setSplitMode] = useState('auto');
  const [unitPreview, setUnitPreview] = useState([]);

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    setFile(f);
    setSplitFiles([]);
    setError(null);
    setUnitPreview([]);
    
    if (f) {
      if (f.type === 'text/plain' || f.name.toLowerCase().endsWith('.txt')) {
        setSplitMode('line');
      } else if (f.name.toLowerCase().endsWith('.docx')) {
        setSplitMode('auto');
      }
      
      try {
        const content = await extractContent(f);
        let units = splitMode === 'line' 
          ? content.split(/\r?\n/) 
          : content.split(/\r?\n\r?\n/);
        setUnitPreview(cleanLines(units));
      } catch {
        setUnitPreview(['(Failed to extract content)']);
      }
    }
  };

  function parseRanges(rangesStr, max) {
    return rangesStr.split(',')
      .map(r => {
        const [start, end] = r.split('-').map(x => parseInt(x.trim(), 10));
        if (isNaN(start)) return null;
        if (!end || isNaN(end)) return [start, start];
        return [start, end];
      })
      .filter(Boolean)
      .map(([s, e]) => [Math.max(1, s), Math.min(max, e)]);
  }

  async function extractContent(file) {
    if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      return await readFileAsText(file);
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      return await readDocxAsText(file);
    }
    throw new Error('Unsupported file type');
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  function readDocxAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (err) {
          reject(new Error('Failed to parse DOCX file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  function cleanLines(lines) {
    return lines.filter(line =>
      line.trim() !== '' &&
      !/^=+/.test(line.trim()) &&
      !/^Subject:/i.test(line.trim()) &&
      !/^CA0\d+/i.test(line.trim()) &&
      !/^Lab file/i.test(line.trim())
    );
  }

  const handleSplit = async () => {
    if (!file) {
      setError('Please select a .txt or .docx file to split.');
      return;
    }
    if (!splitRanges) {
      setError('Please specify split ranges (e.g., 1-3,5,7-8).');
      return;
    }
    
    setError(null);
    setIsSplitting(true);
    setSplitFiles([]);
    
    try {
      const content = await extractContent(file);
      let units = splitMode === 'line' 
        ? content.split(/\r?\n/) 
        : content.split(/\r?\n\r?\n/);
      
      units = cleanLines(units);
      const maxUnit = units.length;
      const ranges = parseRanges(splitRanges, maxUnit);
      
      if (ranges.length === 0) {
        setError('No valid ranges specified.');
        setIsSplitting(false);
        return;
      }
      
      const parts = ranges.map(([start, end], idx) => ({
        name: `${file.name.replace(/\.[^.]+$/, '')}_part${idx + 1}.${fileType}`,
        content: units.slice(start - 1, end).join('\n\n'),
        originalLines: units.slice(start - 1, end)
      }));
      
      setSplitFiles(parts);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownload = async (part) => {
    try {
      if (fileType === 'docx') {
        const paragraphs = part.originalLines.length > 0
          ? part.originalLines.map(line => new Paragraph({ children: [new TextRun(line)] }))
          : [new Paragraph({ children: [new TextRun('')] })];
        
        const doc = new Document({
          sections: [{
            properties: {},
            children: paragraphs,
          }],
        });
        
        const blob = await Packer.toBlob(doc);
        downloadBlob(blob, part.name);
      } else {
        const blob = new Blob([part.content], { 
          type: fileType === 'doc' ? 'application/msword' : 'text/plain' 
        });
        downloadBlob(blob, part.name);
      }
    } catch (err) {
      setError('Failed to generate download: ' + err.message);
    }
  };

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Document Splitter</h2>
        <p style={styles.subtitle}>Split .txt or .docx files by line or paragraph ranges</p>
      </div>
      
      <div style={styles.card}>
        <label style={styles.fileInputLabel}>
          <input
            type="file"
            accept=".txt,.docx"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <div style={styles.fileInputButton}>
            <svg style={styles.uploadIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
            </svg>
            {file ? file.name : 'Select File'}
          </div>
        </label>
        
        <div style={styles.controls}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Split Ranges:</label>
            <input
              type="text"
              placeholder={`e.g., 1-3,5,7-8 (${splitMode === 'line' ? 'lines' : 'paragraphs'})`}
              value={splitRanges}
              onChange={e => setSplitRanges(e.target.value)}
              style={styles.rangeInput}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Output Format:</label>
            <select
              value={fileType}
              onChange={e => setFileType(e.target.value)}
              style={styles.selectType}
            >
              <option value="docx">.docx</option>
              <option value="doc">.doc</option>
            </select>
          </div>
        </div>

        {unitPreview.length > 0 && (
          <div style={styles.previewSection}>
            <p style={styles.previewTitle}>
              Detected {unitPreview.length} {splitMode === 'line' ? 'lines' : 'paragraphs'}. Preview:
            </p>
            <div style={styles.previewContent}>
              {unitPreview.slice(0, 5).map((u, i) => (
                <div key={i} style={styles.previewItem}>
                  <span style={styles.previewIndex}>{i + 1}.</span>
                  <span style={styles.previewText}>
                    {u.length > 100 ? u.slice(0, 100) + '...' : u}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div style={styles.buttonGroup}>
          <button
            onClick={handleSplit}
            disabled={!file || !splitRanges || isSplitting}
            style={styles.primaryButton}
          >
            {isSplitting ? (
              <>
                <span style={styles.spinner}></span>
                Splitting...
              </>
            ) : 'Split Document'}
          </button>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        
        {splitFiles.length > 0 && (
          <div style={styles.resultsSection}>
            <h4 style={styles.resultsTitle}>Split Results:</h4>
            <ul style={styles.resultsList}>
              {splitFiles.map((part, idx) => (
                <li key={idx} style={styles.resultItem}>
                  <span style={styles.resultName}>{part.name}</span>
                  <button 
                    onClick={() => handleDownload(part)}
                    style={styles.downloadButton}
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <button onClick={onClose} style={styles.closeButton}>
        Close
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    margin: '0',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginBottom: '20px',
  },
  fileInputLabel: {
    display: 'block',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
  fileInputButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 20px',
    backgroundColor: '#f8f9fa',
    border: '2px dashed #ced4da',
    borderRadius: '8px',
    color: '#495057',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#e9ecef',
      borderColor: '#adb5bd',
    },
  },
  uploadIcon: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px',
  },
  inputGroup: {
    flex: '1',
    minWidth: '200px',
  },
  inputLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  rangeInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#4285f4',
      boxShadow: '0 0 0 3px rgba(66, 133, 244, 0.1)',
    },
  },
  selectType: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#4285f4',
      boxShadow: '0 0 0 3px rgba(66, 133, 244, 0.1)',
    },
  },
  previewSection: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  previewTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568',
    margin: '0 0 10px 0',
  },
  previewContent: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  previewItem: {
    display: 'flex',
    padding: '8px 0',
    borderBottom: '1px solid #edf2f7',
    ':last-child': {
      borderBottom: 'none',
    },
  },
  previewIndex: {
    color: '#718096',
    marginRight: '10px',
    minWidth: '20px',
  },
  previewText: {
    flex: '1',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  primaryButton: {
    flex: '1',
    padding: '14px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#3367d6',
    },
    ':disabled': {
      backgroundColor: '#e2e8f0',
      color: '#a0aec0',
      cursor: 'not-allowed',
    },
  },
  resultsSection: {
    margin: '25px 0 10px 0',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '15px',
  },
  resultsTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#2d3748',
    margin: '0 0 15px 0',
  },
  resultsList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    borderBottom: '1px solid #edf2f7',
    ':last-child': {
      borderBottom: 'none',
    },
    ':hover': {
      backgroundColor: '#f8fafc',
    },
  },
  resultName: {
    flex: '1',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: '15px',
  },
  downloadButton: {
    padding: '8px 16px',
    backgroundColor: '#34a853',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#2d8e47',
    },
  },
  error: {
    padding: '12px',
    backgroundColor: '#fff3f3',
    color: '#dc3545',
    borderRadius: '8px',
    margin: '15px 0',
    border: '1px solid #ffd6d6',
    fontSize: '14px',
  },
  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    marginRight: '10px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite',
  },
  closeButton: {
    display: 'block',
    width: '100%',
    padding: '14px',
    backgroundColor: '#f8f9fa',
    color: '#495057',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#e9ecef',
    },
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
};