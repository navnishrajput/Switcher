import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiDownload, FiX, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import styled from 'styled-components';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Dropzone = styled.div`
  border: 2px dashed ${props => props.isDragging ? '#3E92CC' : '#ddd'};
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragging ? '#f8f9fa' : 'white'};
  
  &:hover {
    border-color: #3E92CC;
    background: #f8f9fa;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const PdfCanvas = styled.canvas`
  width: 100%;
  border: 1px solid #eee;
  margin-top: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 100%;
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
  margin: 0.5rem;
  
  &:hover {
    background: ${props => props.primary ? '#2c7cb4' : '#f0f8ff'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #555;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 1rem 0;
`;

function PdfViewer({ pdfDocument, fileName, onCancel }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!pdfDocument) return;

    const loadPdf = async () => {
      try {
        setNumPages(pdfDocument.numPages);
        if (canvasRef.current) {
          await renderPage();
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF document');
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [pdfDocument]);

  useEffect(() => {
    if (pdfDocument && pageNumber && canvasRef.current) {
      renderPage();
    }
  }, [pageNumber, scale]);

  const renderPage = async () => {
    try {
      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
    } catch (err) {
      console.error('Error rendering PDF page:', err, err.stack);
      setError(`Failed to render PDF page: ${err.message || err.toString()}`);
    }
  };

  const downloadPdf = async () => {
    try {
      const data = await pdfDocument.getData();
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF');
    }
  };

  if (isLoading) {
    return <StatusMessage>Loading PDF...</StatusMessage>;
  }

  if (error) {
    return <StatusMessage error><FiAlertCircle /> {error}</StatusMessage>;
  }

  return (
    <div>
      <h3>{fileName}</h3>
      
      <ActionButtons>
        <Button onClick={downloadPdf} primary>
          <FiDownload /> Download PDF
        </Button>
        <Button onClick={onCancel}>
          <FiX /> Cancel
        </Button>
      </ActionButtons>

      <div>
        <PageControls>
          <Button 
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >
            <FiChevronLeft /> Previous
          </Button>
          <span>Page {pageNumber} of {numPages || '--'}</span>
          <Button 
            onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))}
            disabled={pageNumber >= (numPages || Infinity)}
          >
            Next <FiChevronRight />
          </Button>
          <select 
            value={scale} 
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1.0">100%</option>
            <option value="1.25">125%</option>
            <option value="1.5">150%</option>
            <option value="2.0">200%</option>
          </select>
        </PageControls>
        <PdfCanvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
    </div>
  );
}

export default function PdfReader() {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
    if (!files || !files.length) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }

    setError(null);
    setFileName(file.name);
    setIsLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      setPdfDocument(pdf);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Error loading PDF file');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setPdfDocument(null);
    setFileName('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    handleFileChange(e);
  };

  return (
    <Container>
      <Dropzone 
        onClick={() => fileInputRef.current?.click()}
        isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <FiUpload size={48} color="#3E92CC" />
        <p>{isDragging ? 'Drop the PDF here' : 'Click to upload or drag and drop a PDF file'}</p>
        <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
          (Maximum file size: 50MB)
        </p>
      </Dropzone>

      {error && (
        <StatusMessage error>
          <FiAlertCircle /> {error}
        </StatusMessage>
      )}

      {isLoading && <StatusMessage>Loading PDF...</StatusMessage>}

      {pdfDocument ? (
        <PreviewContainer>
          <PdfViewer 
            pdfDocument={pdfDocument} 
            fileName={fileName}
            onCancel={clearFile}
          />
        </PreviewContainer>
      ) : (
        !isLoading && <StatusMessage>No PDF file selected</StatusMessage>
      )}
    </Container>
  );
}