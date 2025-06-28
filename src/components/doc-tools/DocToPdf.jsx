import React, { useState } from 'react';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

export default function DocToPdf({ onClose }) {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.name.match(/\.(doc|docx)$/i)) {
      setError('Please select a valid DOC or DOCX file.');
      return;
    }
    setFile(selectedFile);
    setConvertedFile(null);
    setError(null);
    setPdfBlob(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a DOC file to convert.');
      return;
    }
    
    setError(null);
    setIsConverting(true);

    try {
      let htmlContent = '';
      if (file.name.toLowerCase().endsWith('.docx')) {
        // Convert DOCX to HTML with styles
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ 
          arrayBuffer,
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "r[style-name='Strong'] => strong",
            "r[style-name='Emphasis'] => em"
          ]
        });
        htmlContent = result.value;
      } else {
        // Fallback for .doc files
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject();
          reader.readAsText(file);
        });
        htmlContent = `<div style="font-family: Arial; font-size: 12px; white-space: pre-wrap">${text}</div>`;
      }

      if (!htmlContent.trim()) {
        setError('No content extracted from the file.');
        setIsConverting(false);
        return;
      }

      console.log('HTML content to render:', htmlContent);

      // Create PDF with proper formatting
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      try {
        // Await the html rendering
        await doc.html(htmlContent, {
          margin: [15, 15, 15, 15],
          // Removed autoPaging to fix excessive blank pages
          width: 180, // width of content in mm (A4 width is 210mm)
          windowWidth: 1200,
          html2canvas: {
            scale: 1,
            letterRendering: true
          },
          x: 15,
          y: 15
        });
      } catch (htmlErr) {
        console.error('jsPDF html rendering error:', htmlErr);
        // Fallback: generate PDF with plain text only
        const plainText = htmlContent.replace(/<[^>]+>/g, '');
        doc.text(plainText, 10, 10);
      }

      const pdfBlob = doc.output('blob');
      const convertedFileName = file.name.replace(/\.docx?$/i, '.pdf');
      setConvertedFile(convertedFileName);
      setPdfBlob(pdfBlob);

    } catch (err) {
      setError('Failed to convert DOC file. Please try again or use a different file.');
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFile || 'converted.pdf';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="converter-container">
      <div className="converter-header">
        <h2>DOC to PDF Converter</h2>
        <p className="description">Select a DOC/DOCX file to convert it to PDF format</p>
      </div>
      
      <div className="file-input-group">
        <label htmlFor="doc-upload" className="file-upload-label">
          <span className="button-text">Choose File</span>
          <input 
            id="doc-upload"
            type="file" 
            accept=".doc,.docx" 
            onChange={handleFileChange} 
            className="file-input"
          />
        </label>
        {file && (
          <div className="file-info">
            <span className="file-name">{file.name}</span>
            <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
          </div>
        )}
      </div>
      
      <div className="button-group">
        <button 
          onClick={handleConvert} 
          disabled={!file || isConverting}
          className="convert-button"
        >
          {isConverting ? (
            <>
              <span className="spinner"></span>
              Converting...
            </>
          ) : 'Convert to PDF'}
        </button>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {convertedFile && (
        <div className="success-message">
          <p>Conversion successful!</p>
          <button 
            onClick={handleDownload} 
            className="download-button"
          >
            <span className="download-icon">↓</span> Download {convertedFile}
          </button>
        </div>
      )}

      <style jsx>{`
        .converter-container {
          max-width: 500px;
          margin: 2rem auto;
          padding: 2rem;
          border-radius: 12px;
          background-color: #ffffff;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .converter-header {
          margin-bottom: 1.75rem;
          text-align: center;
        }
        
        .converter-header h2 {
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
          font-weight: 600;
        }
        
        .description {
          color: #666;
          margin: 0;
          font-size: 1rem;
          line-height: 1.5;
        }
        
        .file-input-group {
          margin-bottom: 1.5rem;
        }
        
        .file-upload-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          background-color: #f5f7fa;
          color: #3a3a3a;
          border: 2px dashed #cbd5e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          min-height: 48px;
        }
        
        .file-upload-label:hover {
          background-color: #ebf0f5;
          border-color: #a0aec0;
        }
        
        .file-input {
          display: none;
        }
        
        .file-info {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #f8fafc;
          border-radius: 6px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .file-name {
          font-weight: 500;
          color: #2d3748;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 70%;
        }
        
        .file-size {
          color: #718096;
          font-size: 0.85rem;
        }
        
        .button-group {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        
        .convert-button {
          flex: 1;
          padding: 0.875rem;
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);
        }
        
        .convert-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%);
          box-shadow: 0 3px 6px rgba(66, 153, 225, 0.4);
          transform: translateY(-1px);
        }
        
        .convert-button:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }
        
        .close-button {
          flex: 0 0 100px;
          padding: 0.875rem;
          background: #f56565;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(245, 101, 101, 0.3);
        }
        
        .close-button:hover {
          background: #e53e3e;
          box-shadow: 0 3px 6px rgba(245, 101, 101, 0.4);
          transform: translateY(-1px);
        }
        
        .error-message {
          color: #e53e3e;
          margin-top: 1.25rem;
          padding: 0.875rem;
          background-color: #fff5f5;
          border-radius: 8px;
          border-left: 4px solid #e53e3e;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        .success-message {
          color: #38a169;
          margin-top: 1.25rem;
          padding: 1rem;
          background-color: #f0fff4;
          border-radius: 8px;
          border-left: 4px solid #38a169;
          font-size: 0.9rem;
          text-align: center;
        }
        
        .success-message p {
          margin: 0 0 0.75rem 0;
          font-weight: 500;
        }
        
        .download-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(72, 187, 120, 0.3);
          gap: 0.5rem;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
        }
        
        .download-button:hover {
          background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
          box-shadow: 0 3px 6px rgba(72, 187, 120, 0.4);
          transform: translateY(-1px);
        }
        
        .download-icon {
          font-size: 1.1rem;
        }
        
        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}