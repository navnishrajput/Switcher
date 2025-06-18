import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiUpload, FiDownload, FiImage, FiFileText, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

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

const FormatOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const FormatOption = styled.div`
  border: 1px solid ${props => props.active ? '#3E92CC' : '#ddd'};
  background: ${props => props.active ? '#f0f8ff' : 'white'};
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-width: 100px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  &:hover {
    border-color: #3E92CC;
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #3E92CC;
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

const formats = [
  { id: 'jpg', name: 'JPG', icon: <FiImage />, mime: 'image/jpeg' },
  { id: 'png', name: 'PNG', icon: <FiImage />, mime: 'image/png' },
  { id: 'pdf', name: 'PDF', icon: <FiFileText />, mime: 'application/pdf' },
  { id: 'txt', name: 'Text', icon: <FiFileText />, mime: 'text/plain' }
];

export default function PdfConverter() {
  const [file, setFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('jpg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState(null);
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
      setConvertedUrl(null);
    }
  };

  const convertPdfToImage = async (pdfData, format) => {
    // Load the PDF
    const { PDFDocument } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.load(pdfData);
    
    // Get the first page
    const page = pdfDoc.getPage(0);
    
    // Create a canvas to render the PDF page
    const canvas = document.createElement('canvas');
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Render PDF page to canvas
    const canvasContext = canvas.getContext('2d');
    const renderContext = {
      canvasContext,
      viewport
    };
    
    await page.render(renderContext).promise;
    
    // Convert canvas to the requested image format
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, `image/${format}`, 0.95);
    });
  };

  const convertPdfToText = async (pdfData) => {
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs');
    
    // Set worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map(item => item.str);
      fullText += textItems.join(' ') + '\n\n';
    }
    
    return new Blob([fullText], { type: 'text/plain' });
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      let resultBlob;
      const fileName = file.name.replace('.pdf', '');
      const formatInfo = formats.find(f => f.id === selectedFormat);
      
      switch (selectedFormat) {
        case 'jpg':
        case 'png':
          resultBlob = await convertPdfToImage(arrayBuffer, selectedFormat);
          break;
        
        case 'txt':
          resultBlob = await convertPdfToText(arrayBuffer);
          break;
        
        case 'pdf':
          // Just return the original PDF
          resultBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
          break;
        
        default:
          throw new Error('Unsupported format');
      }
      
      const url = URL.createObjectURL(resultBlob);
      const convertedFileName = `${fileName}.${selectedFormat}`;
      
      setConvertedUrl({
        url,
        fileName: convertedFileName,
        mimeType: formatInfo.mime
      });
    } catch (error) {
      console.error('Conversion error:', error);
      setError(error.message || 'Failed to convert PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl.url);
    setConvertedUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Container>
      <HeroSection>
        <Title>PDF Converter</Title>
        <Subtitle>Convert PDF files to various formats</Subtitle>
        
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

          <FormatOptions>
            {formats.map(format => (
              <FormatOption
                key={format.id}
                active={selectedFormat === format.id}
                onClick={() => setSelectedFormat(format.id)}
              >
                {format.icon}
                <div>{format.name}</div>
              </FormatOption>
            ))}
          </FormatOptions>

          <ActionButtons>
            <Button 
              primary 
              onClick={handleConvert}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner /> Processing...
                </>
              ) : (
                <>
                  <FiDownload /> Convert to {selectedFormat.toUpperCase()}
                </>
              )}
            </Button>

            <Button onClick={clearAll}>
              <FiX /> Clear All
            </Button>
          </ActionButtons>
        </>
      )}

      {convertedUrl && (
        <SuccessMessage>
          <FiCheck size={20} /> Success! Your PDF has been converted to {selectedFormat.toUpperCase()}.
          
          <Button 
            as="a"
            href={convertedUrl.url}
            download={convertedUrl.fileName}
            primary
            style={{ marginTop: '1rem' }}
          >
            <FiDownload /> Download {convertedUrl.fileName}
          </Button>
        </SuccessMessage>
      )}
    </Container>
  );
}