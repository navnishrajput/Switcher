import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiUpload, FiDownload, FiImage, FiType, FiArrowLeft } from 'react-icons/fi';

// Styled Components
const WatermarkContainer = styled.div`
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

const PreviewContainer = styled.div`
  position: relative;
  margin: 2rem 0;
  border: 1px solid #ddd;
  max-width: 100%;
  display: inline-block;
`;

const WatermarkText = styled.div`
  position: absolute;
  color: ${props => `rgba(255,255,255,${props.opacity / 100})`};
  font-size: ${props => `${props.size}px`};
  font-weight: bold;
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

export default function WatermarkTool({ onClose }) {
  const [image, setImage] = useState(null);
  const [watermark, setWatermark] = useState({
    text: 'Your Watermark',
    opacity: 50,
    size: 20,
    position: 'center'
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

  const handleWatermarkChange = (e) => {
    setWatermark({
      ...watermark,
      [e.target.name]: e.target.value
    });
  };

  const getWatermarkPosition = () => {
    switch(watermark.position) {
      case 'top-left':
        return { top: '20px', left: '20px', transform: 'none' };
      case 'top-right':
        return { top: '20px', right: '20px', transform: 'none' };
      case 'center':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px', transform: 'none' };
      case 'bottom-right':
        return { bottom: '20px', right: '20px', transform: 'none' };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  const downloadWatermarked = async () => {
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
      
      // Add watermark
      ctx.font = `bold ${watermark.size}px Arial`;
      ctx.fillStyle = `rgba(255,255,255,${watermark.opacity / 100})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Calculate position
      let x, y;
      switch(watermark.position) {
        case 'top-left':
          x = watermark.size;
          y = watermark.size;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          break;
        case 'top-right':
          x = img.width - watermark.size;
          y = watermark.size;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          break;
        case 'center':
          x = img.width / 2;
          y = img.height / 2;
          break;
        case 'bottom-left':
          x = watermark.size;
          y = img.height - watermark.size;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          break;
        case 'bottom-right':
          x = img.width - watermark.size;
          y = img.height - watermark.size;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          break;
      }
      
      ctx.fillText(watermark.text, x, y);
      
      // Trigger download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = 'watermarked.jpg';
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Error generating watermarked image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <WatermarkContainer>
      <BackButton onClick={onClose}>
        <FiArrowLeft /> Back to Tools
      </BackButton>

      <Header>
        <Title>
          <FiImage /> Watermark Tool
        </Title>
        <Description>Protect your images with custom watermarks</Description>
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
              <label>Watermark Text:</label>
              <input
                type="text"
                name="text"
                value={watermark.text}
                onChange={handleWatermarkChange}
              />
            </ControlGroup>

            <ControlGroup>
              <label>Opacity: {watermark.opacity}%</label>
              <input
                type="range"
                name="opacity"
                min="10"
                max="100"
                value={watermark.opacity}
                onChange={handleWatermarkChange}
              />
            </ControlGroup>

            <ControlGroup>
              <label>Size: {watermark.size}px</label>
              <input
                type="range"
                name="size"
                min="10"
                max="100"
                value={watermark.size}
                onChange={handleWatermarkChange}
              />
            </ControlGroup>

            <ControlGroup>
              <label>Position:</label>
              <select
                name="position"
                value={watermark.position}
                onChange={handleWatermarkChange}
              >
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="center">Center</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </ControlGroup>
          </Controls>

          <PreviewContainer>
            <img src={image} alt="Original" style={{ maxWidth: '100%' }} />
            <WatermarkText
              opacity={watermark.opacity}
              size={watermark.size}
              style={getWatermarkPosition()}
            >
              {watermark.text}
            </WatermarkText>
          </PreviewContainer>

          <ActionButton 
            primary 
            onClick={downloadWatermarked}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : <><FiDownload /> Download Watermarked Image</>}
          </ActionButton>
        </>
      )}
    </WatermarkContainer>
  );
}