import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUpload, FiFileText, FiDownload, FiCheck, FiAlertCircle, FiX } from 'react-icons/fi';
import Tesseract from 'tesseract.js';

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const Dropzone = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:hover {
    border-color: #3E92CC;
    background: #f5f9ff;
  }

  &.dragging {
    border-color: #3E92CC;
    background: #e1f0ff;
  }
`;

const DropzoneText = styled.p`
  margin: 0.5rem 0;
  color: #34495e;
`;

const DropzoneNote = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 1rem;
`;

const FileInfo = styled.div`
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const FileName = styled.div`
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const LanguageSelect = styled.div`
  margin: 2rem auto;
  width: 80%;
  max-width: 400px;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #495057;
  }

  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    background: white;
    transition: border 0.3s ease;

    &:focus {
      outline: none;
      border-color: #3E92CC;
      box-shadow: 0 0 0 2px rgba(62, 146, 204, 0.2);
    }
  }
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? '#3E92CC' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#3E92CC'};
  border: ${props => props.primary ? 'none' : '1px solid #3E92CC'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin: ${props => props.margin || '0 auto'};
  
  &:hover {
    background: ${props => props.primary ? '#2c7cb4' : '#f0f8ff'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: ${props => props.primary ? '#cccccc' : 'transparent'};
    color: ${props => props.primary ? 'white' : '#cccccc'};
    border-color: #cccccc;
  }
`;

const OutputArea = styled.textarea`
  width: 80%;
  max-width: 600px;
  height: 200px;
  margin: 1rem auto;
  display: block;
  padding: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3E92CC;
    box-shadow: 0 0 0 2px rgba(62, 146, 204, 0.2);
  }
`;

const StatusMessage = styled.div`
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  background: ${props => props.error ? '#fdecea' : '#f8f9fa'};
  border-radius: 6px;
  color: ${props => props.error ? '#d32f2f' : '#555'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  background: #e8f5e9;
  border-radius: 6px;
  color: #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
`;

const languages = [
  { code: 'eng', name: 'English' },
  { code: 'fra', name: 'French' },
  { code: 'spa', name: 'Spanish' },
  { code: 'deu', name: 'German' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'rus', name: 'Russian' },
  { code: 'ara', name: 'Arabic' }
];

export default function PdfOcr() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('eng');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Validate file type and size
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, JPG, or PNG file');
      return;
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }
    
    setFile(selectedFile);
    setExtractedText('');
    setError('');
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(droppedFile.type)) {
      setError('Please upload a PDF, JPG, or PNG file');
      return;
    }
    
    if (droppedFile.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }
    
    setFile(droppedFile);
    setExtractedText('');
    setError('');
  };

  const handleOcr = async () => {
    if (!file) {
      setError('Please upload a file first.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setExtractedText('');
    
    try {
      const { data: { text } } = await Tesseract.recognize(
        file,
        language,
        { logger: m => console.log(m) }
      );
      setExtractedText(text);
    } catch (err) {
      console.error('OCR Error:', err);
      setError('OCR failed. Please try again with a clearer image or different file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.replace(/\.[^/.]+$/, '') + '_extracted.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFile(null);
    setExtractedText('');
    setError('');
    document.getElementById('file-input').value = '';
  };

  return (
    <Container>
      <HeroSection>
        <Title>PDF & Image Text Extractor</Title>
        <Subtitle>Extract text from PDFs and images using OCR technology</Subtitle>
      </HeroSection>

      <Dropzone 
        onClick={() => document.getElementById('file-input').click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={isDragging ? 'dragging' : ''}
      >
        <input 
          id="file-input"
          type="file" 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <FiUpload size={48} color="#3E92CC" />
        <DropzoneText>
          <strong>Drag & drop your file here</strong>
        </DropzoneText>
        <DropzoneText>or click to browse your files</DropzoneText>
        <DropzoneNote>
          (Supports PDF, JPG, PNG - Max 50MB. Processing happens in your browser.)
        </DropzoneNote>
      </Dropzone>

      {error && (
        <StatusMessage error>
          <FiAlertCircle /> {error}
        </StatusMessage>
      )}

      {file && (
        <>
          <FileInfo>
            <FileName>
              <FiCheck color="#4CAF50" /> {file.name}
            </FileName>
          </FileInfo>

          <LanguageSelect>
            <label>Select Document Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </LanguageSelect>

          <ActionButtons>
            <ActionButton 
              primary 
              onClick={handleOcr}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (
                <>
                  <FiFileText /> Extract Text
                </>
              )}
            </ActionButton>

            <ActionButton onClick={clearAll}>
              <FiX /> Clear File
            </ActionButton>
          </ActionButtons>
        </>
      )}

      {extractedText && (
        <>
          <SuccessMessage>
            <FiCheck size={20} /> Text extraction successful!
          </SuccessMessage>
          
          <OutputArea 
            readOnly 
            value={extractedText}
            placeholder="Extracted text will appear here..."
          />
          
          <ActionButtons>
            <ActionButton 
              primary 
              onClick={handleDownload}
            >
              <FiDownload /> Download Text
            </ActionButton>

            <ActionButton onClick={clearAll}>
              <FiX /> Start New Extraction
            </ActionButton>
          </ActionButtons>
        </>
      )}
    </Container>
  );
}