import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiUpload, FiDownload, FiMinimize2, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { PDFDocument } from 'pdf-lib';

// Animation for progress spinner
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

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

const FeaturesList = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 0;
  margin: 2rem 0;
  list-style: none;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3498db;
  font-weight: 500;
`;

const Dropzone = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:hover {
    border-color: #3E92CC;
    background: #f5f9ff;
  }
`;

const StatusMessage = styled.div`
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  background: ${props => props.error ? '#fdecea' : '#f8f9fa'};
  border-radius: 6px;
  color: ${props => props.error ? '#d32f2f' : '#555'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  background: #e8f5e9;
  border-radius: 6px;
  color: #2e7d32;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const FileInfo = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const FileName = styled.div`
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
`;

const SliderContainer = styled.div`
  margin: 2rem auto;
  width: 80%;
  text-align: center;

  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 500;
    color: #495057;
  }

  input[type="range"] {
    width: 100%;
    margin-bottom: 0.5rem;
    -webkit-appearance: none;
    height: 8px;
    border-radius: 4px;
    background: #ddd;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #3E92CC;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #3E92CC;
      cursor: pointer;
    }
  }

  .slider-value {
    font-size: 1.2rem;
    font-weight: bold;
    color: #3E92CC;
  }

  .slider-description {
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#3E92CC' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#3E92CC'};
  border: ${props => props.primary ? 'none' : '1px solid #3E92CC'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.primary ? '#2c7cb4' : '#f0f8ff'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s ease-in-out infinite;
`;

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit');
        return;
      }
      
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      
      setFile(selectedFile);
      setCompressedFile(null);
    }
  };

  const compressPdf = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Read the original PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Apply compression settings based on the slider value
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        useCompression: true,
        // Lower quality means more compression
        imageQuality: compressionLevel / 100
      });
      
      // Create a new Blob with the compressed PDF
      const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });
      const compressedFileName = `compressed_${file.name}`;
      const compressedFile = new File([compressedBlob], compressedFileName, {
        type: 'application/pdf',
      });
      
      setCompressedFile({
        file: compressedFile,
        url: URL.createObjectURL(compressedBlob),
        fileName: compressedFileName
      });
    } catch (error) {
      console.error('Compression error:', error);
      setError(error.message || 'Failed to compress PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    if (compressedFile) URL.revokeObjectURL(compressedFile.url);
    setCompressedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Container>
      <HeroSection>
        <Title>PDF Compressor</Title>
        <Subtitle>Reduce PDF file size while preserving quality</Subtitle>
        
        <FeaturesList>
          <FeatureItem><FiCheck /> Free to use</FeatureItem>
          <FeatureItem><FiCheck /> No quality loss</FeatureItem>
          <FeatureItem><FiCheck /> Secure processing</FeatureItem>
          <FeatureItem><FiCheck /> Works in your browser</FeatureItem>
        </FeaturesList>
      </HeroSection>

      <Dropzone onClick={() => fileInputRef.current?.click()}>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <FiUpload size={48} color="#3E92CC" />
        <p>Click to upload a PDF file or drag and drop</p>
        <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
          (Maximum file size: 50MB. Your file is processed securely in your browser.)
        </p>
      </Dropzone>

      {error && (
        <StatusMessage error>
          <FiAlertCircle /> {error}
        </StatusMessage>
      )}

      {file && (
        <>
          <FileInfo>
            <FileName>
              <FiCheck color="#4CAF50" /> {file.name}
            </FileName>
            <FileSize>Original size: {formatFileSize(file.size)}</FileSize>
            {compressedFile && (
              <FileSize style={{ color: '#28a745' }}>
                Compressed size: {formatFileSize(compressedFile.file.size)} 
                ({Math.round((1 - compressedFile.file.size / file.size) * 100)}% reduction)
              </FileSize>
            )}
          </FileInfo>

          {!compressedFile && (
            <>
              <SliderContainer>
                <label>Compression Level</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                />
                <div className="slider-value">{compressionLevel}%</div>
                <p className="slider-description">
                  {compressionLevel > 70 ? 'High Quality' : 
                   compressionLevel > 40 ? 'Balanced' : 'Maximum Compression'}
                </p>
              </SliderContainer>

              <ActionButtons>
                <Button 
                  primary 
                  onClick={compressPdf}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Spinner /> Compressing...
                    </>
                  ) : (
                    <>
                      <FiMinimize2 /> Compress PDF
                    </>
                  )}
                </Button>

                <Button onClick={clearAll}>
                  <FiX /> Clear All
                </Button>
              </ActionButtons>
            </>
          )}

          {compressedFile && (
            <SuccessMessage>
              <FiCheck size={20} /> Success! Your PDF has been compressed.
              
              <Button 
                as="a"
                href={compressedFile.url}
                download={compressedFile.fileName}
                primary
                style={{ marginTop: '1rem' }}
              >
                <FiDownload /> Download {compressedFile.fileName}
              </Button>

              <Button onClick={clearAll} style={{ marginTop: '0.5rem' }}>
                <FiUpload /> Compress Another PDF
              </Button>
            </SuccessMessage>
          )}
        </>
      )}
    </Container>
  );
}