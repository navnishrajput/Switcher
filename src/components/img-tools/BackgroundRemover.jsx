import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 5px;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const BackButton = styled(Button)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

const UploadContainer = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
`;

const ResultImage = styled.img`
  max-width: 100%;
  margin-top: 20px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const StatusMessage = styled.p`
  color: ${props => props.error ? 'red' : '#2196F3'};
  margin-top: 10px;
  background-color: ${props => props.error ? '#ffebee' : '#e7f3fe'};
  padding: 10px;
  border-left: 4px solid ${props => props.error ? '#f44336' : '#2196F3'};
`;

export default function BackgroundRemover({ onBack }) {
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState({
    type: 'info',
    message: 'Note: This is a demo version. The actual background removal will be implemented soon.'
  });

  const handleRemoveBackground = async (file) => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select an image file' });
      return;
    }

    if (!file.type.match('image.*')) {
      setStatus({ type: 'error', message: 'Please upload an image file (JPEG, PNG, etc.)' });
      return;
    }

    setIsProcessing(true);
    setStatus(null);
    setResultImage(null);

    try {
      // Show processing message
      setStatus({ type: 'info', message: 'Processing image... Please wait' });

      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock implementation - shows the original image as a placeholder
      const mockImageUrl = URL.createObjectURL(file);
      setResultImage(mockImageUrl);
      setStatus({ type: 'success', message: 'Demo complete! In a real implementation, this would show the background removed.' });
    } catch (err) {
      console.error('Error processing image:', err);
      setStatus({ 
        type: 'error', 
        message: 'Image processing failed. Please try again later.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleRemoveBackground(file);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'image.png';
      link.click();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback if no navigation handler provided
      window.history.back();
    }
  };

  return (
    <Container>
      <BackButton onClick={handleBack}>Back to Tools</BackButton>
      <h2>Background Remover</h2>
      <p>Upload an image to automatically remove its background</p>
      
      {status && (
        <StatusMessage error={status.type === 'error'}>
          {status.message}
        </StatusMessage>
      )}
      
      <UploadContainer>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isProcessing}
        />
        <label htmlFor="image-upload">
          <Button as="span" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Upload Image'}
          </Button>
        </label>
      </UploadContainer>
      
      {resultImage && (
        <div>
          <h3>Demo Result:</h3>
          <ResultImage src={resultImage} alt="Uploaded preview" show={true} />
          <Button onClick={handleDownload}>
            Download Image
          </Button>
        </div>
      )}
    </Container>
  );
}