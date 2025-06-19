import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUpload, FiDownload, FiImage, FiRotateCw, FiFilter, FiArrowLeft, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

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
  color: ${props => props.error ? '#dc3545' : '#4CAF50'};
  background-color: ${props => props.error ? '#f8d7da' : '#d4edda'};
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
  background-color: ${props => props.primary ? '#3E92CC' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#3E92CC'};
  border: 2px solid #3E92CC;
  border-radius: 4px;
  padding: ${props => props.small ? '0.3rem 0.6rem' : '0.5rem 1rem'};
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
    background-color: ${props => props.primary ? '#2c6ea4' : '#e0f0ff'};
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

const EditorControls = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  display: grid;
  gap: 1rem;
`;

const ControlGroup = styled.div`
  display: grid;
  gap: 0.5rem;
  
  input[type="range"] {
    width: 100%;
  }
`;

const ImagePreview = styled.div`
  margin: 1rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
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

const CropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed #3E92CC;
  pointer-events: none;
`;

export default function ImageEditor({ onClose }) {
  const [originalImage, setOriginalImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const previewRef = useRef(null);

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setOriginalImage(file);
      setEditedImage(null);
      setRotation(0);
      setBrightness(100);
      setContrast(100);
      setCrop({ x: 0, y: 0, width: 100, height: 100 });
    } else {
      setError('Please upload a valid image file');
    }
  };

  const handleMouseDown = (e) => {
    if (!originalImage) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setIsCropping(true);
    setCrop({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isCropping || !startPos) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCrop({
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      width: Math.abs(x - startPos.x),
      height: Math.abs(y - startPos.y)
    });
  };

  const handleMouseUp = () => {
    setIsCropping(false);
    setStartPos(null);
  };

  const applyEdits = async () => {
    if (!originalImage) {
      setError('Please upload an image first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await applyImageEdits(
        originalImage, 
        crop, 
        rotation, 
        brightness, 
        contrast
      );
      
      setEditedImage(result);
    } catch (err) {
      setError('Editing failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyImageEdits = (file, crop, rotation, brightness, contrast) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate crop dimensions based on percentage
          const cropX = (crop.x / previewRef.current.offsetWidth) * img.width;
          const cropY = (crop.y / previewRef.current.offsetHeight) * img.height;
          const cropWidth = (crop.width / previewRef.current.offsetWidth) * img.width;
          const cropHeight = (crop.height / previewRef.current.offsetHeight) * img.height;

          // Apply rotation first
          if (rotation % 360 !== 0) {
            const rad = rotation * Math.PI / 180;
            canvas.width = Math.abs(Math.cos(rad) * cropWidth) + Math.abs(Math.sin(rad) * cropHeight);
            canvas.height = Math.abs(Math.sin(rad) * cropWidth) + Math.abs(Math.cos(rad) * cropHeight);
            
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rad);
            ctx.drawImage(img, -cropWidth / 2, -cropHeight / 2, cropWidth, cropHeight, -img.width / 2, -img.height / 2, img.width, img.height);
          } else {
            canvas.width = cropWidth;
            canvas.height = cropHeight;
            ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
          }
          
          // Apply filters
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
          ctx.drawImage(canvas, 0, 0);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], `edited_${file.name}`, { type: file.type }));
          }, file.type, 0.9);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const clearAll = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Container>
      <BackButton onClick={onClose}>
        <FiArrowLeft /> Back to Tools
      </BackButton>

      <HeroSection>
        <Title>Image Editor</Title>
        <Subtitle>Crop, rotate and adjust your images</Subtitle>
      </HeroSection>

      <Dropzone onClick={() => fileInputRef.current?.click()}>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <DropzoneContent>
          <DropzoneIcon>
            <FiImage size={48} color="#3E92CC" />
          </DropzoneIcon>
          <DropzoneText>
            <strong>{originalImage ? originalImage.name : 'Select an image to edit'}</strong>
          </DropzoneText>
        </DropzoneContent>
      </Dropzone>

      {originalImage && (
        <EditorControls>
          <ControlGroup>
            <label>Rotation: {rotation}°</label>
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={rotation} 
              onChange={(e) => setRotation(parseInt(e.target.value))}
            />
          </ControlGroup>
          
          <ControlGroup>
            <label>Brightness: {brightness}%</label>
            <input 
              type="range" 
              min="0" 
              max="200" 
              value={brightness} 
              onChange={(e) => setBrightness(parseInt(e.target.value))}
            />
          </ControlGroup>
          
          <ControlGroup>
            <label>Contrast: {contrast}%</label>
            <input 
              type="range" 
              min="0" 
              max="200" 
              value={contrast} 
              onChange={(e) => setContrast(parseInt(e.target.value))}
            />
          </ControlGroup>
        </EditorControls>
      )}

      {originalImage && (
        <ImagePreview 
          ref={previewRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img 
            ref={imgRef}
            src={URL.createObjectURL(originalImage)} 
            alt="Original" 
            style={{
              transform: `rotate(${rotation}deg)`,
              filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              maxWidth: '100%',
              maxHeight: '400px'
            }}
          />
          {isCropping && (
            <CropOverlay style={{
              left: `${crop.x}px`,
              top: `${crop.y}px`,
              width: `${crop.width}px`,
              height: `${crop.height}px`
            }} />
          )}
        </ImagePreview>
      )}

      {error && (
        <StatusMessage error>
          <FiAlertCircle /> {error}
        </StatusMessage>
      )}

      {originalImage && (
        <ActionButtons>
          <Button primary onClick={applyEdits} disabled={isProcessing}>
            {isProcessing ? 'Applying...' : <><FiFilter /> Apply Edits</>}
          </Button>
          <Button onClick={clearAll}>
            <FiX /> Clear
          </Button>
        </ActionButtons>
      )}

      {editedImage && (
        <PreviewContainer>
          <SuccessMessage>
            <FiCheck size={20} /> Edit complete!
          </SuccessMessage>
          
          <ImagePreview>
            <img 
              src={URL.createObjectURL(editedImage)} 
              alt="Edited" 
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          </ImagePreview>
          
          <ActionButtons>
            <Button as="a" href={URL.createObjectURL(editedImage)} download={editedImage.name} primary>
              <FiDownload /> Download Edited Image
            </Button>
          </ActionButtons>
        </PreviewContainer>
      )}
    </Container>
  );
}