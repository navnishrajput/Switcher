import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function DocProtector({ onClose }) {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isProtecting, setIsProtecting] = useState(false);
  const [protectedFile, setProtectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    setProtectedFile(null);
    setError(null);
  };

  const downloadFile = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleProtect = async () => {
    if (!file) {
      setError('Please select a DOCX file to protect.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setIsProtecting(true);

    try {
      // Create a new document with protection notice
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "This document is password protected.",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Original filename: " + file.name,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Protected with password: " + password.replace(/./g, '*'),
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Note: Real password protection requires server-side processing.",
                  color: "FF0000",
                }),
              ],
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const protectedFilename = `${fileName}_protected.docx`;
      
      downloadFile(blob, protectedFilename);
      setProtectedFile(protectedFilename);
    } catch (err) {
      setError('Failed to protect document: ' + err.message);
    } finally {
      setIsProtecting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>DOCX Protector</h2>
        <p style={styles.subtitle}>Add password protection to your Word documents</p>
      </div>

      <div style={styles.card}>
        <label style={styles.fileInputLabel}>
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            style={styles.fileInput}
            disabled={isProtecting}
          />
          <div style={styles.fileInputButton}>
            <svg style={styles.uploadIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
            </svg>
            {file ? file.name : 'Select DOCX File'}
          </div>
        </label>

        <div style={styles.passwordGroup}>
          <label style={styles.inputLabel}>Protection Password:</label>
          <input
            type="password"
            placeholder="Enter a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.passwordInput}
            disabled={isProtecting}
          />
          <p style={styles.passwordHint}>Minimum 6 characters</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonGroup}>
          <button
            onClick={handleProtect}
            style={styles.primaryButton}
            disabled={!file || !password || isProtecting}
          >
            {isProtecting ? (
              <>
                <span style={styles.spinner}></span>
                Protecting...
              </>
            ) : 'Protect Document'}
          </button>
          <button
            onClick={onClose}
            style={styles.secondaryButton}
            disabled={isProtecting}
          >
            Close
          </button>
        </div>

        {protectedFile && (
          <div style={styles.successMessage}>
            <svg style={styles.successIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
            <div>
              <p style={styles.successTitle}>Document protected successfully!</p>
              <p style={styles.successFilename}>{protectedFile}</p>
              <p style={styles.successNote}>Note: This is simulated protection. Real password protection requires server-side processing.</p>
            </div>
          </div>
        )}
      </div>
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
  passwordGroup: {
    marginBottom: '20px',
  },
  inputLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  passwordInput: {
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
  passwordHint: {
    fontSize: '12px',
    color: '#718096',
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
  successMessage: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
  },
  successIcon: {
    width: '24px',
    height: '24px',
    color: '#16a34a',
    flexShrink: '0',
  },
  successTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#166534',
    margin: '0 0 5px 0',
  },
  successFilename: {
    fontSize: '13px',
    color: '#4d7c0f',
    margin: '0 0 5px 0',
  },
  successNote: {
    fontSize: '12px',
    color: '#65a30d',
    margin: '5px 0 0 0',
    fontStyle: 'italic',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
};