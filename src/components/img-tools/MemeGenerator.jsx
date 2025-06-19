import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiUpload, FiDownload, FiType, FiImage, FiArrowLeft } from 'react-icons/fi';

// Styled Components
const MemeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
`;

const Description = styled.p`
  color: #7f8c8d;
`;

const UploadButton = styled.button`
  background-color: #3E92CC;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Controls = styled.div`
  display: grid;
  gap: 1rem;
  margin: 1rem 0;
`;

const ControlGroup = styled.div`
  display: grid;
  gap: 0.5rem;
  
  input[type="range"] {
    width: 100%;
  }
`;

const MemePreview = styled.div`
  position: relative;
  margin: 2rem 0;
  display: inline-block;
`;

const MemeText = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-family: impact, sans-serif;
  font-size: ${props => props.size}px;
  text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000;
  padding: 0 1rem;
  pointer-events: none;
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? '#3E92CC' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#3E92CC'};
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
    background-color: ${props => props.primary ? '#2c6ea4' : '#e0f0ff'};
  }
`;

const BackButton = styled(ActionButton)`
  margin-bottom: 1rem;
  background-color: transparent;
  color: #2c3e50;
  border: 2px solid #2c3e50;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default function MemeGenerator({ onClose }) {
  const [image, setImage] = useState(null);
  const [text, setText] = useState({
    top: 'TOP TEXT',
    bottom: 'BOTTOM TEXT',
    size: 40
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize canvas
    canvasRef.current = document.createElement('canvas');
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleTextChange = (e) => {
    setText({
      ...text,
      [e.target.name]: e.target.value
    });
  };

  const downloadMeme = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Load original image
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = image;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Add meme text
      ctx.font = `bold ${text.size}px impact, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      // Add black outline by drawing multiple times with offsets
      ctx.strokeStyle = 'black';
      ctx.lineWidth = text.size / 10;
      ctx.strokeText(text.top, img.width / 2, 10);
      ctx.fillText(text.top, img.width / 2, 10);
      
      ctx.textBaseline = 'bottom';
      ctx.strokeText(text.bottom, img.width / 2, img.height - 10);
      ctx.fillText(text.bottom, img.width / 2, img.height - 10);
      
      // Trigger download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = 'meme.jpg';
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Error generating meme:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MemeContainer>
      <BackButton onClick={onClose}>
        <FiArrowLeft /> Back to Tools
      </BackButton>

      <Header>
        <Title>
          <FiImage /> Meme Generator
        </Title>
        <Description>Create hilarious memes with your images</Description>
      </Header>

      <UploadButton onClick={() => fileInputRef.current?.click()}>
        <FiUpload /> Upload Image
      </UploadButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {image && (
        <>
          <Controls>
            <ControlGroup>
              <label>Top Text:</label>
              <input
                type="text"
                name="top"
                value={text.top}
                onChange={handleTextChange}
              />
            </ControlGroup>

            <ControlGroup>
              <label>Bottom Text:</label>
              <input
                type="text"
                name="bottom"
                value={text.bottom}
                onChange={handleTextChange}
              />
            </ControlGroup>

            <ControlGroup>
              <label>Text Size: {text.size}px</label>
              <input
                type="range"
                name="size"
                min="20"
                max="80"
                value={text.size}
                onChange={handleTextChange}
              />
            </ControlGroup>
          </Controls>

          <MemePreview>
            <img src={image} alt="Meme" style={{ maxWidth: '100%' }} />
            {text.top && (
              <MemeText size={text.size} style={{ top: '10px' }}>
                {text.top}
              </MemeText>
            )}
            {text.bottom && (
              <MemeText size={text.size} style={{ bottom: '10px' }}>
                {text.bottom}
              </MemeText>
            )}
          </MemePreview>

          <ActionButton 
            primary 
            onClick={downloadMeme}
            disabled={isProcessing}
          >
            {isProcessing ? 'Generating...' : <><FiDownload /> Download Meme</>}
          </ActionButton>
        </>
      )}
    </MemeContainer>
  );
}