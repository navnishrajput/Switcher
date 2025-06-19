import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiUpload, FiDownload, FiFilm, FiPlus, FiTrash2, FiArrowLeft, FiAlertCircle, FiCheck } from 'react-icons/fi';

// Styled Components
const GifContainer = styled.div`
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
  margin: 1rem 0;
`;

const ControlGroup = styled.div`
  display: grid;
  gap: 0.5rem;
  
  input[type="range"] {
    width: 100%;
  }
`;

const FramePreview = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  padding: 1rem 0;
`;

const FrameItem = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border: 2px solid ${props => props.active ? '#3498db' : '#ddd'};
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
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

const GifPreview = styled.div`
  margin: 1rem 0;
  border: 1px solid #ddd;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
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

export default function GifMaker({ onClose }) {
  const [frames, setFrames] = useState([]);
  const [speed, setSpeed] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gifUrl, setGifUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);
  const gifRef = useRef({ loaded: false });

  // Load gif.js from CDN with proper callback
  useEffect(() => {
    if (window.GIF) {
      gifRef.current = { loaded: true, lib: window.GIF };
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js';
    script.async = true;
    
    script.onload = () => {
      gifRef.current = { loaded: true, lib: window.GIF };
      setStatus({ message: 'GIF library ready', error: false });
    };
    
    script.onerror = () => {
      setStatus({ message: 'Failed to load GIF library', error: true });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFrameUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFrames = files.map(file => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file: file
      }));
      setFrames([...frames, ...newFrames]);
      setGifUrl(null);
      setStatus(null);
    }
  };

  const removeFrame = (id) => {
    const frameToRemove = frames.find(frame => frame.id === id);
    if (frameToRemove) {
      URL.revokeObjectURL(frameToRemove.url);
    }
    setFrames(frames.filter(frame => frame.id !== id));
    setGifUrl(null);
    setStatus(null);
  };

  const createGif = async () => {
    if (frames.length < 2) {
      setStatus({ message: 'You need at least 2 frames to create a GIF', error: true });
      return;
    }
    
    if (!gifRef.current.loaded) {
      setStatus({ message: 'GIF library not loaded yet', error: true });
      return;
    }

    setIsProcessing(true);
    setGifUrl(null);
    setStatus(null);
    
    try {
      // Load all frame images with proper dimensions
      const images = await Promise.all(
        frames.map(frame => 
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              if (img.complete && img.naturalWidth > 0) {
                resolve(img);
              } else {
                reject(new Error('Image failed to load'));
              }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = frame.url;
          })
        )
      );
      
      // Get dimensions from first image
      const width = images[0].naturalWidth;
      const height = images[0].naturalHeight;
      
      // Limit maximum dimensions to prevent crashes
      const maxDimension = 800;
      const scale = Math.min(1, maxDimension / Math.max(width, height));
      const targetWidth = Math.floor(width * scale);
      const targetHeight = Math.floor(height * scale);
      
      // Create GIF instance
      const gif = new gifRef.current.lib({
        workers: 2,
        quality: 10,
        width: targetWidth,
        height: targetHeight,
        workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js'
      });
      
      // Create canvas for frame processing
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      // Add frames to GIF
      for (const img of images) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        gif.addFrame(canvas, { delay: speed, copy: true });
      }
      
      // Render GIF
      await new Promise((resolve, reject) => {
        gif.on('finished', (blob) => {
          const url = URL.createObjectURL(blob);
          setGifUrl(url);
          setStatus({ message: 'GIF created successfully!', error: false });
          resolve();
        });
        
        gif.on('abort', () => {
          reject(new Error('GIF creation was aborted'));
        });
        
        gif.render();
      });
      
    } catch (error) {
      console.error('Error creating GIF:', error);
      setStatus({ 
        message: `Error creating GIF: ${error.message || 'Unknown error'}`,
        error: true 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    
    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.gif`;
    link.href = gifUrl;
    link.click();
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      frames.forEach(frame => URL.revokeObjectURL(frame.url));
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
  }, [frames, gifUrl]);

  return (
    <GifContainer>
      <BackButton onClick={onClose}>
        <FiArrowLeft /> Back to Tools
      </BackButton>

      <Header>
        <Title>
          <FiFilm /> GIF Maker
        </Title>
        <Description>Create animated GIFs from your images</Description>
      </Header>

      {status && (
        <StatusMessage error={status.error}>
          {status.error ? <FiAlertCircle /> : <FiCheck />}
          {status.message}
        </StatusMessage>
      )}

      <UploadButton onClick={() => fileInputRef.current?.click()}>
        <FiPlus /> Add Frames
      </UploadButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFrameUpload}
        style={{ display: 'none' }}
      />

      {frames.length > 0 && (
        <>
          <Controls>
            <ControlGroup>
              <label>Speed: {speed}ms</label>
              <input
                type="range"
                min="50"
                max="500"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
              />
            </ControlGroup>
          </Controls>

          <FramePreview>
            {frames.map((frame) => (
              <FrameItem key={frame.id}>
                <img 
                  src={frame.url} 
                  alt="GIF frame" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <RemoveButton onClick={() => removeFrame(frame.id)}>
                  <FiTrash2 size={14} />
                </RemoveButton>
              </FrameItem>
            ))}
          </FramePreview>

          {gifUrl && (
            <GifPreview>
              <img src={gifUrl} alt="Generated GIF" style={{ maxWidth: '100%' }} />
            </GifPreview>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <ActionButton 
              primary 
              onClick={createGif} 
              disabled={frames.length < 2 || isProcessing}
            >
              {isProcessing ? 'Creating...' : <><FiFilm /> Create GIF</>}
            </ActionButton>
            
            {gifUrl && (
              <ActionButton 
                primary 
                onClick={downloadGif}
                disabled={isProcessing}
              >
                <FiDownload /> Download GIF
              </ActionButton>
            )}
          </div>
        </>
      )}
    </GifContainer>
  );
}