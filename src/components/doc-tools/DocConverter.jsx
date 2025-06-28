
import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiUpload, FiTrash2, FiDownload, FiFileText, FiX, FiCheck, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { PDFDocument, rgb } from 'pdf-lib';
import * as mammoth from 'mammoth';

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
`;

const BackButton = styled.button`
  background: #f5f9ff;
  border: none;
  color: #3E92CC;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin-right: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  &:hover {
    background: #e1f0ff;
  }
`;

const UploadArea = styled.div`
  border: 2px dashed #3E92CC;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  background: #f5f9ff;
  transition: all 0.3s ease;
  &:hover {
    background: #e1f0ff;
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background: #3E92CC;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  margin: 1.5rem 0;
  font-size: 1.1rem;
  min-width: 200px;
  min-height: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(62, 146, 204, 0.3);
  &:hover {
    background: #2c7cb4;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(62, 146, 204, 0.4);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
  border-left: 4px solid #4CAF50;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const FileName = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const FileSize = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.4rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 2.5rem 0;
  justify-content: center;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#3E92CC' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#3E92CC'};
  border: ${props => props.primary ? 'none' : '2px solid #3E92CC'};
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: ${props => props.primary ? '0 2px 8px rgba(62, 146, 204, 0.3)' : 'none'};
  &:hover {
    background: ${props => props.primary ? '#2c7cb4' : '#f5f9ff'};
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? '0 4px 12px rgba(62, 146, 204, 0.4)' : '0 2px 8px rgba(62, 146, 204, 0.2)'};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s ease-in-out infinite;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background: #fdecea;
  padding: 1.25rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  border-left: 4px solid #d32f2f;
`;

const SuccessMessage = styled.div`
  color: #2e7d32;
  background: #e8f5e9;
  padding: 1.25rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  border-left: 4px solid #2e7d32;
`;

const Instructions = styled.p`
  color: #7f8c8d;
  font-size: 1rem;
  margin-top: 0.8rem;
`;

export default function DocConverter({ onBackToTools }) {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    const validTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(selectedFile.type) && 
        !selectedFile.name.match(/\.(doc|docx)$/i)) {
      setError('Please upload a Word document (.doc or .docx)');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }

    setFile(selectedFile);
    setConvertedFile(null);
  };

  const clearFile = () => {
    setFile(null);
    if (convertedFile) {
      URL.revokeObjectURL(convertedFile.url);
    }
    setConvertedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const convertToPdf = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      // Read the Word file content
      const arrayBuffer = await file.arrayBuffer();
      
      // Convert Word to text with mammoth
      const result = await mammoth.extractRawText({ arrayBuffer });
      const textContent = result.value;

      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);

      // Add the content to PDF
      const lines = textContent.split('\n');
      let yPosition = 750;
      const fontSize = 12;

      for (const line of lines) {
        if (line.trim()) {
          try {
            page.drawText(line, {
              x: 50,
              y: yPosition,
              size: fontSize,
              color: rgb(0, 0, 0),
            });
          } catch (err) {
            console.warn('Could not render some characters, using fallback:', err);
            // Fallback for unsupported characters
            page.drawText(line.replace(/[^\x00-\x7F]/g, ''), {
              x: 50,
              y: yPosition,
              size: fontSize,
              color: rgb(0, 0, 0),
            });
          }
          yPosition -= (fontSize + 4);
          
          // Add new page if we reach the bottom
          if (yPosition < 50) {
            yPosition = 750;
            pdfDoc.addPage([600, 800]);
          }
        }
      }

      // Add document info
      const firstPage = pdfDoc.getPages()[0];
      firstPage.drawText(`Converted from: ${file.name}`, {
        x: 50,
        y: 30,
        size: 10,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setConvertedFile({
        name: file.name.replace(/\.[^/.]+$/, '') + '.pdf',
        url: url
      });
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to convert document. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={onBackToTools}>
          <FiArrowLeft size={18} /> Back to Tools
        </BackButton>
        <Title>DOCX to PDF Converter</Title>
      </Header>

      <UploadArea>
        <FiFileText size={60} color="#3E92CC" />
        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
          <strong>Drag & drop your Word document here</strong>
        </p>
        
        <FileInput 
          ref={fileInputRef}
          type="file" 
          id="file-upload"
          accept=".doc,.docx"
          onChange={handleFileChange}
        />
        <UploadButton htmlFor="file-upload">
          <FiUpload size={20} /> Choose a File
        </UploadButton>
        
        <Instructions>Supported formats: .doc, .docx (Max 50MB)</Instructions>
      </UploadArea>

      {error && (
        <ErrorMessage>
          <FiAlertCircle size={20} /> {error}
        </ErrorMessage>
      )}

      {file && (
        <div>
          <FileInfo>
            <div>
              <FileName>
                <FiCheck color="#4CAF50" size={20} /> {file.name}
              </FileName>
              <FileSize>{formatFileSize(file.size)}</FileSize>
            </div>
            <button 
              onClick={clearFile}
              style={{ 
                background: '#fdecea', 
                border: 'none', 
                cursor: 'pointer',
                padding: '0.75rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              aria-label="Remove file"
            >
              <FiTrash2 color="#dc3545" size={18} />
            </button>
          </FileInfo>

          <ActionButtons>
            <Button 
              primary 
              onClick={convertToPdf}
              disabled={isConverting || convertedFile}
            >
              {isConverting ? (
                <>
                  <Spinner /> Converting...
                </>
              ) : (
                <>
                  <FiDownload size={18} /> Convert to PDF
                </>
              )}
            </Button>
            <Button onClick={clearFile}>
              <FiX size={18} /> Clear
            </Button>
          </ActionButtons>
        </div>
      )}

      {convertedFile && (
        <div>
          <SuccessMessage>
            <FiCheck size={20} /> Conversion successful! Your file is ready to download.
          </SuccessMessage>

          <FileInfo>
            <div>
              <FileName>
                <FiFileText color="#3E92CC" size={20} /> {convertedFile.name}
              </FileName>
              <FileSize>PDF Document</FileSize>
            </div>
            <a 
              href={convertedFile.url} 
              download={convertedFile.name}
              style={{
                background: '#3E92CC',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              <FiDownload size={18} /> Download PDF
            </a>
          </FileInfo>

          <ActionButtons>
            <Button onClick={clearFile}>
              <FiArrowLeft size={18} /> Convert Another File
            </Button>
          </ActionButtons>
        </div>
      )}
    </Container>
  );
}