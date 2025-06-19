import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUpload, FiTrash2, FiDownload, FiImage, FiCheck, FiX, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

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

const FormatOptions = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  
  select {
    margin-left: 0.5rem;
    padding: 0.25rem;
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

export default function ImageFormatConverter({ onClose }) {
  const [originalImages, setOriginalImages] = useState([]);
  const [convertedImages, setConvertedImages] = useState([]);
  const [targetFormat, setTargetFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError(null);
    const files = Array.from(e.target.files).filter(file => file.type.match('image.*'));
    
    if (files.length) {
      setOriginalImages(files);
      setConvertedImages([]);
    } else {
      setError('Please upload valid image files');
    }
  };

  const convertImages = async () => {
    if (originalImages.length === 0) {
      setError('Please upload images first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const converted = [];
      
      for (const img of originalImages) {
        const result = await convertImage(img, targetFormat);
        converted.push({
          file: result,
          originalFormat: img.type.split('/')[1],
          url: URL.createObjectURL(result)
        });
      }
      
      setConvertedImages(converted);
    } catch (err) {
      setError('Conversion failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const convertImage = (file, format) => {
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
          
          let mimeType;
          switch(format) {
            case 'jpeg': mimeType = 'image/jpeg'; break;
            case 'png': mimeType = 'image/png'; break;
            case 'webp': mimeType = 'image/webp'; break;
            default: mimeType = 'image/jpeg';
          }
          
          canvas.toBlob((blob) => {
            const ext = format === 'jpeg' ? 'jpg' : format;
            resolve(new File([blob], `${file.name.split('.')[0]}.${ext}`, { type: mimeType }));
          }, mimeType, 0.9);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const clearAll = () => {
    setOriginalImages([]);
    setConvertedImages([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Container>
      <BackButton onClick={onClose}>
        <FiArrowLeft /> Back to Tools
      </BackButton>

      <HeroSection>
        <Title>Image Format Converter</Title>
        <Subtitle>Convert between JPG, PNG, and WEBP formats</Subtitle>
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
            <strong>Select images to convert</strong>
          </DropzoneText>
        </DropzoneContent>
      </Dropzone>

      {originalImages.length > 0 && (
        <FormatOptions>
          <label>Convert to:</label>
          <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
            <option value="jpeg">JPEG (.jpg)</option>
            <option value="png">PNG (.png)</option>
            <option value="webp">WEBP (.webp)</option>
          </select>
        </FormatOptions>
      )}

      {error && (
        <StatusMessage error>
          <FiAlertCircle /> {error}
        </StatusMessage>
      )}

      {originalImages.length > 0 && (
        <ActionButtons>
          <Button primary onClick={convertImages} disabled={isProcessing}>
            {isProcessing ? 'Converting...' : <><FiDownload /> Convert Images</>}
          </Button>
          <Button onClick={clearAll}>
            <FiX /> Clear All
          </Button>
        </ActionButtons>
      )}

      {convertedImages.length > 0 && (
        <PreviewContainer>
          <SuccessMessage>
            <FiCheck size={20} /> Conversion complete!
          </SuccessMessage>
          
          <FileList>
            {convertedImages.map((img, index) => (
              <FileItem key={index}>
                <FileInfo>
                  <FileName>
                    {originalImages[index].name} → {img.file.name}
                  </FileName>
                  <FileSize>
                    {img.originalFormat.toUpperCase()} → {targetFormat.toUpperCase()}
                  </FileSize>
                </FileInfo>
                <Button as="a" href={img.url} download={img.file.name} small>
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