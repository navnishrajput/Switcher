import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUpload, FiTrash2, FiDownload, FiImage, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  border: 2px dashed #3E92CC;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    background-color: #e0f0ff;
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DropzoneIcon = styled.div`
  margin-bottom: 1rem;
`;

const DropzoneText = styled.p`
  margin: 0.2rem 0;
  font-weight: 600;
  color: #3E92CC;
`;

const StatusMessage = styled.div`
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  color: ${props => (props.error ? '#dc3545' : '#4CAF50')};
  background-color: ${props => (props.error ? '#f8d7da' : '#d4edda')};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: ${props => (props.primary ? '#3E92CC' : 'transparent')};
  color: ${props => (props.primary ? 'white' : '#3E92CC')};
  border: 2px solid #3E92CC;
  border-radius: 4px;
  padding: ${props => (props.small ? '0.3rem 0.6rem' : '0.5rem 1rem')};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${props => (props.primary ? '#2c6ea4' : '#e0f0ff')};
  }
`;

const PreviewContainer = styled.div`
  margin-top: 2rem;
`;

const SuccessMessage = styled.div`
  color: #4CAF50;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImageItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const ImageActions = styled.div`
  padding: 0.5rem;
  background: #f8f9fa;
  text-align: center;
`;

export default function PdfToImage({ onClose }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setImages([]);
    } else {
      setError('Please upload a valid PDF file');
    }
  };

  const extractImages = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      
      const extractedImages = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        
        // Create canvas for each page
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // Convert canvas to image
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        extractedImages.push({
          url: imageData,
          name: `page-${i}.jpg`,
          size: imageData.length
        });
      }
      
      setImages(extractedImages);
    } catch (err) {
      setError('Failed to extract images: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setPdfFile(null);
    setImages([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Container>
      <Button onClick={onClose} style={{ marginBottom: '1rem' }}>
        &larr; Back to Tools
      </Button>

      <HeroSection>
        <Title>Extract Images from PDF</Title>
        <Subtitle>Save all images contained in a PDF document</Subtitle>
      </HeroSection>

      <Dropzone onClick={() => fileInputRef.current?.click()}>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <DropzoneContent>
          <DropzoneIcon>
            <FiUpload size={48} color="#3E92CC" />
          </DropzoneIcon>
          <DropzoneText>
            <strong>{pdfFile ? pdfFile.name : 'Select a PDF file'}</strong>
          </DropzoneText>
          <DropzoneText>{pdfFile ? 'Click to change' : 'Click to browse'}</DropzoneText>
        </DropzoneContent>
      </Dropzone>

      {error && (
        <StatusMessage error>
          <FiAlertCircle /> {error}
        </StatusMessage>
      )}

      {pdfFile && (
        <ActionButtons>
          <Button primary onClick={extractImages} disabled={isProcessing}>
            {isProcessing ? 'Extracting...' : <><FiImage /> Extract Images</>}
          </Button>
          <Button onClick={clearAll}>
            <FiX /> Clear
          </Button>
        </ActionButtons>
      )}

      {isProcessing && (
        <StatusMessage>
          Processing PDF... Please wait
        </StatusMessage>
      )}

      {images.length > 0 && (
        <PreviewContainer>
          <SuccessMessage>
            <FiCheck size={20} /> Found {images.length} images
          </SuccessMessage>
          
          <ImageGrid>
            {images.map((img, index) => (
              <ImageItem key={index}>
                <img src={img.url} alt={`Extracted page ${index + 1}`} />
                <ImageActions>
                  <Button as="a" href={img.url} download={img.name} small>
                    <FiDownload /> Download
                  </Button>
                </ImageActions>
              </ImageItem>
            ))}
          </ImageGrid>
        </PreviewContainer>
      )}
    </Container>
  );
}