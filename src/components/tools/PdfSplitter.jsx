import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiUpload, FiScissors, FiDownload, FiTrash2, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';

// Animation for progress spinner
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

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
  
  &:hover {
    border-color: #3E92CC;
    background: #f5f9ff;
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
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const FileInfo = styled.div`
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
  gap: 0.5rem;
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
`;

const RangeInput = styled.div`
  margin: 1rem 0;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #3E92CC;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
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

const Spinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s ease-in-out infinite;
`;

const DownloadLinks = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;
`;

export default function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [splitResults, setSplitResults] = useState([]);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit');
        return;
      }
      
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      
      setFile(selectedFile);
      setSplitResults([]);
    }
  };

  const parsePageRange = (rangeStr, totalPages) => {
    if (!rangeStr.trim()) return [];
    
    const parts = rangeStr.split(',');
    const pages = new Set();
    
    for (const part of parts) {
      const trimmedPart = part.trim();
      if (trimmedPart.includes('-')) {
        const [startStr, endStr] = trimmedPart.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        
        if (isNaN(start)) {
          throw new Error(`Invalid start page in range: ${trimmedPart}`);
        }
        if (isNaN(end)) {
          throw new Error(`Invalid end page in range: ${trimmedPart}`);
        }
        if (start < 1 || start > totalPages) {
          throw new Error(`Start page ${start} is out of bounds (1-${totalPages})`);
        }
        if (end < 1 || end > totalPages) {
          throw new Error(`End page ${end} is out of bounds (1-${totalPages})`);
        }
        if (start > end) {
          throw new Error(`Invalid range: ${start} is greater than ${end}`);
        }
        
        for (let i = start; i <= end; i++) {
          pages.add(i - 1); // Using 0-based index
        }
      } else {
        const page = parseInt(trimmedPart, 10);
        if (isNaN(page)) {
          throw new Error(`Invalid page number: ${trimmedPart}`);
        }
        if (page < 1 || page > totalPages) {
          throw new Error(`Page ${page} is out of bounds (1-${totalPages})`);
        }
        pages.add(page - 1); // Using 0-based index
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !pageRange) {
      setError('Please select a file and enter page range');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      
      const pagesToExtract = parsePageRange(pageRange, totalPages);
      
      if (pagesToExtract.length === 0) {
        throw new Error('No valid pages specified');
      }
      
      const results = [];
      
      // Create individual PDFs for each page
      for (const pageIndex of pagesToExtract) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
        newPdf.addPage(copiedPage);
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        results.push({
          url,
          pageNumber: pageIndex + 1,
          fileName: `${file.name.replace('.pdf', '')}_page_${pageIndex + 1}.pdf`
        });
      }
      
      setSplitResults(results);
    } catch (error) {
      console.error('Split error:', error);
      setError(error.message || 'Failed to split PDF. Please check your page range and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setPageRange('');
    setSplitResults([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Clean up object URLs
    splitResults.forEach(result => URL.revokeObjectURL(result.url));
  };

  return (
    <Container>
      <HeroSection>
        <Title>Split PDF Files Online</Title>
        <Subtitle>Extract specific pages from your PDF document</Subtitle>
        
        <FeaturesList>
          <FeatureItem><FiCheck /> Free to use</FeatureItem>
          <FeatureItem><FiCheck /> No watermarks</FeatureItem>
          <FeatureItem><FiCheck /> Secure processing</FeatureItem>
          <FeatureItem><FiCheck /> Works in your browser</FeatureItem>
        </FeaturesList>
      </HeroSection>

      <Dropzone onClick={() => fileInputRef.current?.click()}>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <FiUpload size={48} color="#3E92CC" />
        <p>Click to upload a PDF file or drag and drop</p>
        <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
          (Maximum file size: 50MB. Your file is processed securely in your browser.)
        </p>
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
            <FileSize>{formatFileSize(file.size)}</FileSize>
          </FileInfo>

          <RangeInput>
            <label>Enter page range to extract (e.g., 1-3,5,7-9)</label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="1-5,8,10-12"
            />
          </RangeInput>

          <ActionButtons>
            <Button 
              primary 
              onClick={handleSplit}
              disabled={!pageRange || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner /> Processing...
                </>
              ) : (
                <>
                  <FiScissors /> Split PDF
                </>
              )}
            </Button>

            <Button onClick={clearAll}>
              <FiX /> Clear All
            </Button>
          </ActionButtons>
        </>
      )}

      {splitResults.length > 0 && (
        <SuccessMessage>
          <FiCheck size={20} /> Success! Your PDF has been split into {splitResults.length} pages.
          
          <DownloadLinks>
            {splitResults.map((result, index) => (
              <Button 
                key={index}
                as="a"
                href={result.url}
                download={result.fileName}
                primary
              >
                <FiDownload /> Download Page {result.pageNumber}
              </Button>
            ))}
          </DownloadLinks>
        </SuccessMessage>
      )}
    </Container>
  );
}