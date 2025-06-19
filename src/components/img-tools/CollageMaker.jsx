import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiUpload, FiGrid, FiDownload, FiX, FiPlus, FiArrowLeft } from 'react-icons/fi';

// Styled Components
const Container = styled.div`
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

const Controls = styled.div`
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const CollageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: 1rem;
  margin: 2rem 0;
  border: 2px dashed #ddd;
  min-height: 400px;
  padding: 1rem;
`;

const CollageCell = styled.div`
  position: relative;
  background: #f5f5f5;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const AddButton = styled.button`
  background: transparent;
  border: none;
  color: #3E92CC;
  cursor: pointer;
  padding: 1rem;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
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

export default function CollageMaker({ onClose }) {
  const [layout, setLayout] = useState(2); // 2x2 grid
  const [images, setImages] = useState(Array(4).fill(null));
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRefs = useRef([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize canvas
    canvasRef.current = document.createElement('canvas');
  }, []);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleLayoutChange = (e) => {
    const newLayout = parseInt(e.target.value);
    setLayout(newLayout);
    setImages(Array(newLayout * newLayout).fill(null));
  };

  const generateCollage = async () => {
    if (!images.some(img => img)) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions (adjust as needed)
      const collageWidth = 1000;
      const collageHeight = 1000;
      canvas.width = collageWidth;
      canvas.height = collageHeight;
      
      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, collageWidth, collageHeight);
      
      // Calculate cell dimensions
      const cellWidth = collageWidth / layout;
      const cellHeight = collageHeight / layout;
      
      // Draw each image
      const imagePromises = images.map((imgUrl, index) => {
        if (!imgUrl) return Promise.resolve();
        
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = imgUrl;
          img.onload = () => {
            const row = Math.floor(index / layout);
            const col = index % layout;
            const x = col * cellWidth;
            const y = row * cellHeight;
            
            // Draw image centered in cell
            const scale = Math.min(
              cellWidth / img.width,
              cellHeight / img.height
            );
            const width = img.width * scale;
            const height = img.height * scale;
            const offsetX = (cellWidth - width) / 2;
            const offsetY = (cellHeight - height) / 2;
            
            ctx.drawImage(img, x + offsetX, y + offsetY, width, height);
            resolve();
          };
          img.onerror = resolve;
        });
      });
      
      await Promise.all(imagePromises);
      
      // Trigger download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = 'collage.jpg';
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Error generating collage:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container>
      <BackButton onClick={onClose}>
        <FiArrowLeft /> Back to Tools
      </BackButton>

      <Header>
        <Title>
          <FiGrid /> Collage Maker
        </Title>
        <Description>Combine multiple images into beautiful collages</Description>
      </Header>

      <Controls>
        <label>
          Layout:
          <select value={layout} onChange={handleLayoutChange}>
            <option value={2}>2x2</option>
            <option value={3}>3x3</option>
            <option value={4}>4x4</option>
          </select>
        </label>
      </Controls>

      <CollageGrid columns={layout}>
        {Array(layout * layout).fill().map((_, index) => (
          <CollageCell key={index}>
            {images[index] ? (
              <>
                <img src={images[index]} alt={`Collage part ${index}`} />
                <RemoveButton onClick={() => removeImage(index)}>
                  <FiX />
                </RemoveButton>
              </>
            ) : (
              <AddButton onClick={() => fileInputRefs.current[index]?.click()}>
                <FiPlus size={24} />
                <input
                  ref={el => fileInputRefs.current[index] = el}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                  style={{ display: 'none' }}
                />
              </AddButton>
            )}
          </CollageCell>
        ))}
      </CollageGrid>

      <ActionButton 
        primary 
        onClick={generateCollage} 
        disabled={!images.some(img => img) || isGenerating}
      >
        {isGenerating ? 'Generating...' : <><FiDownload /> Download Collage</>}
      </ActionButton>
    </Container>
  );
}