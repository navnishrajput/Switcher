import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUpload, FiDownload, FiImage, FiCheck, FiX, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

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
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const QualityControl = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  
  input[type="range"] {
    width: 100%;
    margin-top: 0.5rem;
  }
`;

const BackButton = styled(Button)`
  margin-bottom: 1rem;
  background-color: transparent;
  color: #2c3e50;
  border: 2px solid #2c3e50;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default function ImageCompressor({ onClose }) {
  const [originalImages, setOriginalImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [quality, setQuality] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError(null);
    const files = Array.from(e.target.files).filter(file => file.type.match('image.*'));
    
    if (files.length) {
      setOriginalImages(files);
      setCompressedImages([]);
    } else {
      setError('Please upload valid image files');
    }
  };

  const compressImages = async () => {
    if (originalImages.length === 0) {
      setError('Please upload images first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const compressed = [];
      
      for (const img of originalImages) {
        const result = await compressImage(img, quality / 100);
        compressed.push({
          file: result,
          originalSize: img.size,
          compressedSize: result.size,
          url: URL.createObjectURL(result)
        });
      }
      
      setCompressedImages(compressed);
    } catch (err) {
      setError('Compression failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const compressImage = (file, quality) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', quality);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const clearAll = () => {
    setOriginalImages([]);
    setCompressedImages([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <Container>
      <BackButton onClick={onClose}>
        <FiArrowLeft /> Back to Tools
      </BackButton>

      <HeroSection>
        <Title>Image Compressor</Title>
        <Subtitle>Reduce image file size without losing quality</Subtitle>
      </HeroSection>

      <Dropzone onClick={() => fileInputRef.current?.click()}>
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
            <strong>Select images to compress</strong>
          </DropzoneText>
          <DropzoneText>JPG, PNG, WEBP supported</DropzoneText>
        </DropzoneContent>
      </Dropzone>

      {originalImages.length > 0 && (
        <QualityControl>
          <label>Compression Quality: {quality}%</label>
          <input 
            type="range" 
            min="10" 
            max="90" 
            value={quality} 
            onChange={(e) => setQuality(e.target.value)}
          />
        </QualityControl>
      )}

      {error && (
        <StatusMessage error>
          <FiAlertCircle /> {error}
        </StatusMessage>
      )}

      {originalImages.length > 0 && (
        <ActionButtons>
          <Button primary onClick={compressImages} disabled={isProcessing}>
            {isProcessing ? 'Compressing...' : <><FiDownload /> Compress Images</>}
          </Button>
          <Button onClick={clearAll}>
            <FiX /> Clear All
          </Button>
        </ActionButtons>
      )}

      {compressedImages.length > 0 && (
        <PreviewContainer>
          <SuccessMessage>
            <FiCheck size={20} /> Compression complete! Saved {(
              compressedImages.reduce((sum, img) => sum + (img.originalSize - img.compressedSize), 0) / 1024
            ).toFixed(1)} KB in total
          </SuccessMessage>
          
          <FileList>
            {compressedImages.map((img, index) => (
              <FileItem key={index}>
                <FileInfo>
                  <FileName>{img.file.name}</FileName>
                  <FileSize>
                    Original: {formatFileSize(img.originalSize)} → 
                    Compressed: {formatFileSize(img.compressedSize)} (
                      {((1 - img.compressedSize/img.originalSize) * 100).toFixed(1)}% smaller
                    )
                  </FileSize>
                </FileInfo>
                <Button as="a" href={img.url} download={`compressed_${img.file.name}`} small>
                  <FiDownload /> Download
                </Button>
              </FileItem>
            ))}
          </FileList>
        </PreviewContainer>
      )}
    </Container>
  );
}