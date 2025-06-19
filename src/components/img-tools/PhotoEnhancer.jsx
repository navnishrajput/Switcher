import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUpload, FiDownload, FiSliders, FiImage, FiArrowLeft } from 'react-icons/fi';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PreviewContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImagePreview = styled.div`
  flex: 1;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
  }

  h3 {
    margin-top: 0;
    color: #2c3e50;
  }
`;

const Controls = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ControlGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
  }

  input[type="range"] {
    width: 100%;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1a252f;
  }
`;

export default function PhotoEnhancer() {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [settings, setSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 50
  });
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      setEnhancedImage(null);
    }
  };

  const handleSettingChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: parseInt(e.target.value)
    });
  };

  const enhanceImage = () => {
    if (!originalImage) return;
    
    // In a real app, this would use canvas or a library to apply filters
    // This is just a simulation
    setEnhancedImage(originalImage);
  };

  const downloadImage = () => {
    if (!enhancedImage) return;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = 'enhanced-photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sharpness: 50
    });
  };

  return (
    <Container>
      <Header>
        {originalImage && (
          <Button onClick={resetTool}>
            <FiArrowLeft /> Back to Tool
          </Button>
        )}
        <h2><FiSliders /> Photo Enhancer</h2>
      </Header>
      <p>Automatically improve your photo quality</p>

      {!originalImage ? (
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={() => fileInputRef.current.click()}>
            <FiUpload /> Upload Photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <>
          <PreviewContainer>
            <ImagePreview>
              <h3>Original</h3>
              <img src={originalImage} alt="Original" />
            </ImagePreview>

            <Controls>
              <ControlGroup>
                <label>Brightness: {settings.brightness}%</label>
                <input
                  type="range"
                  name="brightness"
                  min="0"
                  max="200"
                  value={settings.brightness}
                  onChange={handleSettingChange}
                />
              </ControlGroup>

              <ControlGroup>
                <label>Contrast: {settings.contrast}%</label>
                <input
                  type="range"
                  name="contrast"
                  min="0"
                  max="200"
                  value={settings.contrast}
                  onChange={handleSettingChange}
                />
              </ControlGroup>

              <ControlGroup>
                <label>Saturation: {settings.saturation}%</label>
                <input
                  type="range"
                  name="saturation"
                  min="0"
                  max="200"
                  value={settings.saturation}
                  onChange={handleSettingChange}
                />
              </ControlGroup>

              <ControlGroup>
                <label>Sharpness: {settings.sharpness}%</label>
                <input
                  type="range"
                  name="sharpness"
                  min="0"
                  max="100"
                  value={settings.sharpness}
                  onChange={handleSettingChange}
                />
              </ControlGroup>

              <Button onClick={enhanceImage}>
                <FiImage /> Enhance Photo
              </Button>
            </Controls>
          </PreviewContainer>

          {enhancedImage && (
            <>
              <PreviewContainer>
                <ImagePreview>
                  <h3>Enhanced</h3>
                  <img src={enhancedImage} alt="Enhanced" style={{
                    filter: `
                      brightness(${settings.brightness}%)
                      contrast(${settings.contrast}%)
                      saturate(${settings.saturation}%)
                    `
                  }} />
                </ImagePreview>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button onClick={downloadImage}>
                    <FiDownload /> Download Enhanced Photo
                  </Button>
                </div>
              </PreviewContainer>
            </>
          )}
        </>
      )}
    </Container>
  );
}