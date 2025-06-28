import React, { useState } from 'react';
import mammoth from 'mammoth';

const DocMerger = ({ onClose }) => {
  const [files, setFiles] = useState([]);
  const [mergedContent, setMergedContent] = useState('');
  const [fileName, setFileName] = useState('merged-document');
  const [fileType, setFileType] = useState('docx'); // 'docx' or 'doc'
  const [error, setError] = useState('');
  const [isMerging, setIsMerging] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const handleFileChange = (e) => {
    setError('');
    setDownloadReady(false);
    setMergedContent('');
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.docx')
    );
    if (selectedFiles.length < 2) {
      setError('Please select at least two .txt or .docx files.');
      setFiles([]);
      return;
    }
    setFiles(selectedFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least two .txt or .docx files to merge.');
      return;
    }
    setIsMerging(true);
    setError('');
    let merged = '';
    for (const file of files) {
      try {
        let content = '';
        if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
          content = await readFileAsText(file);
        } else if (file.name.toLowerCase().endsWith('.docx')) {
          content = await readDocxAsText(file);
        }
        merged += content + '\n';
      } catch {
        // Skip files that cannot be read
      }
    }
    // Filter out unwanted lines (headers, metadata, empty lines)
    const cleaned = merged
      .split(/\r?\n/)
      .filter(line =>
        line.trim() !== '' &&
        !/^=+/.test(line.trim()) &&
        !/^Subject:/i.test(line.trim()) &&
        !/^CA0\d+/i.test(line.trim()) &&
        !/^Lab file/i.test(line.trim())
      )
      .join('\n');
    setMergedContent(cleaned);
    setDownloadReady(true);
    setIsMerging(false);
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject();
      reader.readAsText(file);
    });
  };

  const readDocxAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch {
          reject();
        }
      };
      reader.onerror = () => reject();
      reader.readAsArrayBuffer(file);
    });
  };

  const handleDownload = () => {
    if (!downloadReady || !mergedContent) {
      setError('No merged content available to download.');
      return;
    }
    let mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    let ext = 'docx';
    if (fileType === 'doc') {
      mimeType = 'application/msword';
      ext = 'doc';
    }
    const blob = new Blob([mergedContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName || 'merged-document'}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloadReady(false);
  };

  const clearAll = () => {
    setFiles([]);
    setMergedContent('');
    setDownloadReady(false);
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Document Merger</h2>
        <p style={styles.subtitle}>Combine multiple .txt or .docx files into one</p>
      </div>
      
      <div style={styles.card}>
        <label style={styles.fileInputLabel}>
          <input
            type="file"
            multiple
            accept=".txt,.docx"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <div style={styles.fileInputButton}>
            <svg style={styles.uploadIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
            </svg>
            Select Files
          </div>
          {files.length > 0 && <span style={styles.fileCount}>{files.length} files selected</span>}
        </label>
        
        <div style={styles.controls}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Output filename:</label>
            <input
              type="text"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              placeholder="merged-document"
              style={styles.nameInput}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>File type:</label>
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
        
        {files.length > 0 && (
          <div style={styles.fileList}>
            <h4 style={styles.fileListTitle}>Selected Files:</h4>
            <ul style={styles.fileListItems}>
              {files.map((file, idx) => (
                <li key={idx} style={styles.fileListItem}>
                  <span style={styles.fileName}>{file.name}</span>
                  <span style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.buttonGroup}>
          <button
            onClick={clearAll}
            style={styles.secondaryButton}
            disabled={files.length === 0 && !downloadReady}
          >
            Clear All
          </button>
          <button
            onClick={handleMerge}
            disabled={files.length < 2 || isMerging}
            style={styles.primaryButton}
          >
            {isMerging ? (
              <>
                <span style={styles.spinner}></span>
                Merging...
              </>
            ) : 'Merge Files'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!downloadReady}
            style={styles.downloadButton}
          >
            Download
          </button>
        </div>
      </div>
      
      <button onClick={onClose} style={styles.closeButton}>
        Close
      </button>
    </div>
  );
};

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
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
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
    padding: '12px 20px',
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
  fileCount: {
    display: 'block',
    marginTop: '8px',
    fontSize: '14px',
    color: '#6c757d',
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
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
  nameInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
  },
  selectType: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
  },
  fileList: {
    margin: '20px 0',
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  fileListTitle: {
    fontSize: '16px',
    margin: '0 0 10px 0',
    color: '#495057',
  },
  fileListItems: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #eee',
    borderRadius: '6px',
  },
  fileListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
    ':last-child': {
      borderBottom: 'none',
    },
    ':hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  fileName: {
    flex: '1',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: '10px',
  },
  fileSize: {
    color: '#6c757d',
    fontSize: '13px',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fff3f3',
    color: '#dc3545',
    borderRadius: '6px',
    margin: '15px 0',
    border: '1px solid #ffd6d6',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  primaryButton: {
    flex: '1',
    padding: '12px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#3367d6',
    },
    ':disabled': {
      backgroundColor: '#b8d1ff',
      cursor: 'not-allowed',
    },
  },
  secondaryButton: {
    padding: '12px 20px',
    backgroundColor: '#f8f9fa',
    color: '#495057',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#e9ecef',
    },
    ':disabled': {
      opacity: '0.6',
      cursor: 'not-allowed',
    },
  },
  downloadButton: {
    padding: '12px 20px',
    backgroundColor: '#34a853',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2d8e47',
    },
    ':disabled': {
      backgroundColor: '#a8dab5',
      cursor: 'not-allowed',
    },
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    marginRight: '8px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite',
  },
  closeButton: {
    display: 'block',
    width: '100%',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    color: '#495057',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '15px',
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

export default DocMerger;