import React, { useState } from 'react';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function DocEditor({ onClose }) {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError(null);
    setIsLoading(true);

    try {
      // Check file type
      if (!selectedFile.name.toLowerCase().endsWith('.docx')) {
        throw new Error('Please select a .docx file (Word 2007 or later)');
      }

      const arrayBuffer = await readFileAsArrayBuffer(selectedFile);
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      setFile(selectedFile);
      setContent(result.value);
    } catch (err) {
      setError(err.message || 'Failed to load document');
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSave = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    if (!content.trim()) {
      setError('Document content cannot be empty');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Create a new DOCX document
      const paragraphs = content.split('\n')
        .filter(line => line.trim())
        .map(line => new Paragraph({ children: [new TextRun(line)] }));

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs.length ? paragraphs : [new Paragraph({ children: [new TextRun('')] })],
        }],
      });

      // Generate and download the file
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);

      alert('Document saved successfully!');
    } catch (err) {
      setError('Failed to save document: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>DOCX Editor</h2>
        <p style={styles.subtitle}>Edit Word documents in your browser</p>
      </div>

      <div style={styles.card}>
        <label style={styles.fileInputLabel}>
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            style={styles.fileInput}
            disabled={isLoading || isSaving}
          />
          <div style={styles.fileInputButton}>
            {isLoading ? (
              <span style={styles.spinner}></span>
            ) : (
              <svg style={styles.uploadIcon} viewBox="0 0 24 24">
                <path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
              </svg>
            )}
            {file ? file.name : (isLoading ? 'Loading...' : 'Select DOCX File')}
          </div>
        </label>

        {file && (
          <div style={styles.editorContainer}>
            <textarea
              style={styles.editor}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit your document content here..."
              disabled={isSaving}
            />
            <div style={styles.characterCount}>
              {content.length} characters | {content.split('\n').length} lines
            </div>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonGroup}>
          <button
            onClick={handleSave}
            style={styles.primaryButton}
            disabled={!file || !content.trim() || isSaving || isLoading}
          >
            {isSaving ? (
              <>
                <span style={styles.spinner}></span>
                Saving...
              </>
            ) : 'Save Document'}
          </button>
          <button
            onClick={onClose}
            style={styles.secondaryButton}
            disabled={isSaving || isLoading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
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
  editorContainer: {
    margin: '20px 0',
  },
  editor: {
    width: '100%',
    minHeight: '300px',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontSize: '14px',
    lineHeight: '1.5',
    resize: 'vertical',
    transition: 'border-color 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#4285f4',
      boxShadow: '0 0 0 3px rgba(66, 133, 244, 0.1)',
    },
  },
  characterCount: {
    fontSize: '12px',
    color: '#718096',
    textAlign: 'right',
    marginTop: '5px',
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
  secondaryButton: {
    padding: '14px 20px',
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
    ':disabled': {
      opacity: '0.6',
      cursor: 'not-allowed',
    },
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
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
};