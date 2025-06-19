import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUpload, FiTrash2, FiDownload, FiImage, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

// Styled Components (same pattern as PdfMerger)
const Container = styled.div`padding: 2rem; max-width: 800px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;`;
const HeroSection = styled.div`text-align: center; margin-bottom: 2rem;`;
const Title = styled.h1`color: #2c3e50; margin-bottom: 0.5rem;`;
const Subtitle = styled.p`color: #7f8c8d; font-size: 1.1rem; margin-bottom: 1.5rem;`;
const Dropzone = styled.div`
  border: 2px dashed #3E92CC;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &.dragging {
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

const DropzoneNote = styled.p`
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
`;

const StatusMessage = styled.div`
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  color: \${props => (props.error ? '#dc3545' : '#4CAF50')};
  background-color: \${props => (props.error ? '#f8d7da' : '#d4edda')};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileList = styled.div`
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

const FileName = styled.div`
  font-weight: 500;
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
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: \${props => (props.primary ? '#3E92CC' : 'transparent')};
  color: \${props => (props.primary ? 'white' : '#3E92CC')};
  border: 2px solid #3E92CC;
  border-radius: 4px;
  padding: 0.5rem 1rem;
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
    background-color: \${props => (props.primary ? '#2c6ea4' : '#e0f0ff')};
  }
`;

const PreviewContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
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

export default function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputPdfUrl, setOutputPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleImageUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files);
  };

  const handleImageUpload = (files) => {
    setError(null);
    const imageFiles = files.filter(file => file.type.match('image.*'));
    
    if (imageFiles.length) {
      if (images.length + imageFiles.length > 20) {
        setError('Maximum 20 images allowed');
        return;
      }
      setImages(prev => [...prev, ...imageFiles]);
    } else {
      setError('Please upload valid image files (JPG, PNG, WEBP)');
    }
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    setIsProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      
      for (const image of images) {
        const imageBytes = await image.arrayBuffer();
        const imageType = image.type.split('/')[1];
        const imageEmbed = imageType === 'png' 
          ? await pdfDoc.embedPng(imageBytes) 
          : await pdfDoc.embedJpg(imageBytes);
        
        const page = pdfDoc.addPage([imageEmbed.width, imageEmbed.height]);
        page.drawImage(imageEmbed, {
          x: 0, y: 0,
          width: imageEmbed.width,
          height: imageEmbed.height,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setOutputPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError('Failed to create PDF: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const clearAll = () => {
    setImages([]);
    if (outputPdfUrl) URL.revokeObjectURL(outputPdfUrl);
    setOutputPdfUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Container>
      <HeroSection>
        <Title>Convert Images to PDF</Title>
        <Subtitle>Combine multiple images into a single PDF document</Subtitle>
      </HeroSection>

      <Dropzone 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={isDragging ? 'dragging' : ''}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <DropzoneContent>
          <DropzoneIcon>
            <FiImage size={48} color="#3E92CC" />
          </DropzoneIcon>
          <DropzoneText>
            <strong>Drag & drop your images here</strong>
          </DropzoneText>
          <DropzoneText>or click to browse your files</DropzoneText>
          <DropzoneNote>
            (Maximum 20 images, 10MB each. Supported formats: JPG, PNG, WEBP)
          </DropzoneNote>
        </DropzoneContent>
      </Dropzone>

      {error && (
        <StatusMessage error>
          <FiAlertCircle /> {error}
        </StatusMessage>
      )}

      {images.length > 0 && (
        <>
          <h3>Selected Images ({images.length})</h3>
          <FileList>
            {images.map((image, index) => (
              <FileItem key={index}>
                <FileInfo>
                  <FileName title={image.name}>
                    <FiCheck color="#4CAF50" /> {image.name}
                  </FileName>
                  <FileSize>{formatFileSize(image.size)} • {image.type.split('/')[1].toUpperCase()}</FileSize>
                </FileInfo>
                <button onClick={() => removeImage(index)}>
                  <FiTrash2 color="#dc3545" />
                </button>
              </FileItem>
            ))}
          </FileList>

          <ActionButtons>
            <Button onClick={() => fileInputRef.current?.click()}>
              <FiUpload /> Add More Images
            </Button>
            
            <Button primary onClick={convertToPdf} disabled={isProcessing}>
              {isProcessing ? 'Creating PDF...' : <><FiDownload /> Create PDF</>}
            </Button>

            <Button onClick={clearAll}>
              <FiX /> Clear All
            </Button>
          </ActionButtons>
        </>
      )}

      {outputPdfUrl && (
        <PreviewContainer>
          <SuccessMessage>
            <FiCheck size={20} /> PDF created successfully!
          </SuccessMessage>
          
          <ActionButtons>
            <Button as="a" href={outputPdfUrl} download="images.pdf" primary>
              <FiDownload /> Download PDF
            </Button>
            <Button onClick={clearAll}>
              <FiX /> Start New Conversion
            </Button>
          </ActionButtons>
        </PreviewContainer>
      )}
    </Container>
  );
}