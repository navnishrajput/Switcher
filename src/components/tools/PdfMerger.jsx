import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUpload, FiTrash2, FiDownload, FiEye, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';

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

const FeaturesList = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 0;
  margin: 2rem 0;
  list-style: none;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3498db;
  font-weight: 500;
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
  position: relative;
  
  &:hover {
    border-color: #3E92CC;
    background: #f5f9ff;
  }

  &.dragging {
    border-color: #3E92CC;
    background: #e1f0ff;
  }
`;

const DropzoneContent = styled.div`
  pointer-events: none;
`;

const DropzoneIcon = styled.div`
  margin-bottom: 1rem;
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

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const FileItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
`;

const Button = styled.button`
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
  
  &:hover {
    background: ${props => props.primary ? '#2c7cb4' : '#f0f8ff'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const PreviewFrame = styled.iframe`
  width: 100%;
  height: 500px;
  border: none;
  margin-top: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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

// Main Component
export default function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Format file size to readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileChange = (e) => {
    setError(null);
    const newFiles = Array.from(e.target.files).filter(file => 
      file.type === 'application/pdf'
    );
    
    if (newFiles.length) {
      if (files.length + newFiles.length > 10) {
        setError('You can upload a maximum of 10 files');
        return;
      }
      
      const oversizedFiles = newFiles.filter(file => file.size > 50 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed 50MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }
      
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setMergedPdfUrl(null);
      setShowPreview(false);
    }
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
    setError(null);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf'
    );
    
    if (droppedFiles.length) {
      if (files.length + droppedFiles.length > 10) {
        setError('You can upload a maximum of 10 files');
        return;
      }
      
      const oversizedFiles = droppedFiles.filter(file => file.size > 50 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed 50MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }
      
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
      setMergedPdfUrl(null);
      setShowPreview(false);
    } else {
      setError('Please upload only PDF files');
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
    setShowPreview(false);
    setError(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach(page => mergedPdf.addPage(page));
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          throw new Error(`Failed to process ${file.name}. It may be corrupted or password protected.`);
        }
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
    } catch (error) {
      console.error('Merge error:', error);
      setError(error.message || 'Failed to merge PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
    setMergedPdfUrl(null);
    setShowPreview(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Container>
      <HeroSection>
        <Title>Merge PDF Files Online</Title>
        <Subtitle>Combine multiple PDFs into one document in seconds</Subtitle>
        
        <FeaturesList>
          <FeatureItem><FiCheck /> Free to use</FeatureItem>
          <FeatureItem><FiCheck /> No watermarks</FeatureItem>
          <FeatureItem><FiCheck /> Secure processing</FeatureItem>
          <FeatureItem><FiCheck /> Works in your browser</FeatureItem>
        </FeaturesList>
      </HeroSection>

      <Dropzone 
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={isDragging ? 'dragging' : ''}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <DropzoneContent>
          <DropzoneIcon>
            <FiUpload size={48} color="#3E92CC" />
          </DropzoneIcon>
          <DropzoneText>
            <strong>Drag & drop your PDF files here</strong>
          </DropzoneText>
          <DropzoneText>or click to browse your files</DropzoneText>
          <DropzoneNote>
            (Maximum 10 files, 50MB each. Your files are processed securely in your browser.)
          </DropzoneNote>
        </DropzoneContent>
      </Dropzone>

      {error && (
        <StatusMessage error>
          <FiAlertCircle /> {error}
        </StatusMessage>
      )}

      {files.length > 0 && (
        <>
          <h3>Selected Files ({files.length})</h3>
          <FileList>
            {files.map((file, index) => (
              <FileItem key={index}>
                <FileInfo>
                  <FileName title={file.name}>
                    <FiCheck color="#4CAF50" /> {file.name}
                  </FileName>
                  <FileSize>{formatFileSize(file.size)}</FileSize>
                </FileInfo>
                <button 
                  onClick={() => removeFile(index)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    transition: 'background 0.2s'
                  }}
                  aria-label={`Remove ${file.name}`}
                >
                  <FiTrash2 color="#dc3545" />
                </button>
              </FileItem>
            ))}
          </FileList>

          <ActionButtons>
            <Button onClick={() => fileInputRef.current?.click()}>
              <FiUpload /> Add More Files
            </Button>
            
            <Button 
              primary 
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
            >
              {isProcessing ? (
                <>Merging {files.length} PDFs...</>
              ) : (
                <>
                  <FiDownload /> Merge {files.length} PDFs
                </>
              )}
            </Button>

            <Button onClick={clearAll}>
              <FiX /> Clear All
            </Button>
          </ActionButtons>
        </>
      )}

      {isProcessing && (
        <StatusMessage>
          <div className="spinner"></div> Merging your {files.length} PDF files. Please wait...
        </StatusMessage>
      )}

      {mergedPdfUrl && (
        <PreviewContainer>
          <SuccessMessage>
            <FiCheck size={20} /> Success! Your {files.length} PDF files have been merged into one document.
          </SuccessMessage>
          
          <ActionButtons>
            <Button 
              as="a" 
              href={mergedPdfUrl} 
              download="merged-document.pdf" 
              primary
            >
              <FiDownload /> Download Merged PDF
            </Button>
            
            <Button onClick={() => setShowPreview(!showPreview)}>
              <FiEye /> {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>

            <Button onClick={clearAll}>
              <FiX /> Start New Merge
            </Button>
          </ActionButtons>

          {showPreview && (
            <PreviewFrame 
              src={mergedPdfUrl} 
              title="Merged PDF Preview"
            />
          )}
        </PreviewContainer>
      )}
    </Container>
  );
}