import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { 
  FiUpload, 
  FiDownload,
  FiRotateCw,
  FiImage,
  FiLock,
  FiTrash2,
  FiX,
  FiEye,
  FiCheck,
  FiArrowRight
} from 'react-icons/fi';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

// Styled Components
const EditorContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const EditorHeader = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h1 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #7f8c8d;
    font-size: 1.1rem;
  }
`;

const EditorDropzone = styled.div`
  border: 2px dashed ${props => props.isDragging ? '#3E92CC' : '#ddd'};
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragging ? '#f0f8ff' : '#fafafa'};
  animation: ${fadeIn} 0.3s ease-out;
  
  &:hover {
    border-color: #3E92CC;
    background: #f5f9ff;
  }
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const ToolCard = styled.div`
  border: 2px solid ${props => props.active ? '#3E92CC' : '#eee'};
  background: ${props => props.active ? '#f0f8ff' : 'white'};
  border-radius: 12px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  &:hover {
    border-color: #3E92CC;
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    color: #3E92CC;
  }

  p {
    margin: 0;
    font-weight: 500;
    color: #2c3e50;
  }
`;

const EditorButton = styled.button`
  background: ${props => props.primary ? '#3E92CC' : 'transparent'};
  color: ${props => props.primary ? 'white' : props.variant === 'danger' ? '#dc3545' : '#3E92CC'};
  border: ${props => props.primary ? 'none' : `1px solid ${props.variant === 'danger' ? '#dc3545' : '#3E92CC'}`};
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: ${props => props.primary ? '0 2px 6px rgba(62, 146, 204, 0.3)' : 'none'};
  
  &:hover {
    background: ${props => props.primary ? '#2c7cb4' : props.variant === 'danger' ? '#f8d7da' : '#f0f8ff'};
    transform: translateY(-1px);
    box-shadow: ${props => props.primary ? '0 4px 8px rgba(62, 146, 204, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 2.5rem 0;
  flex-wrap: wrap;
`;

const EditorPreviewContainer = styled.div`
  margin: 2rem 0;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

const EditorPDFPreview = styled.iframe`
  width: 100%;
  height: 500px;
  border: none;
`;

const EditorStatus = styled.div`
  padding: 1.25rem;
  margin: 1.5rem 0;
  border-radius: 8px;
  text-align: center;
  background: ${props => props.variant === 'success' ? '#e8f5e9' : props.variant === 'error' ? '#fdecea' : '#f8f9fa'};
  color: ${props => props.variant === 'success' ? '#2e7d32' : props.variant === 'error' ? '#d32f2f' : '#495057'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  animation: ${fadeIn} 0.3s ease-out;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ToolOptionsPanel = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 12px;
  background: #f8f9fa;
  border: 1px solid #eee;
  animation: ${fadeIn} 0.3s ease-out;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  label {
    font-weight: 500;
    color: #2c3e50;
    min-width: 120px;
  }

  input, select {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #3E92CC;
      box-shadow: 0 0 0 2px rgba(62, 146, 204, 0.2);
    }
  }
`;

const tools = [
  { id: 'rotate', name: 'Rotate Pages', icon: <FiRotateCw /> },
  { id: 'watermark', name: 'Add Watermark', icon: <FiImage /> },
  { id: 'protect', name: 'Password Protect', icon: <FiLock /> }
];

export default function PdfEditor() {
  const [file, setFile] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [processedPdfUrl, setProcessedPdfUrl] = useState('');
  const [watermarkText, setWatermarkText] = useState('');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [password, setPassword] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);

  // Clean up object URLs when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (processedPdfUrl) URL.revokeObjectURL(processedPdfUrl);
    };
  }, [previewUrl, processedPdfUrl]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type === 'application/pdf') {
      // Clean up previous URLs
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (processedPdfUrl) URL.revokeObjectURL(processedPdfUrl);

      setFile(selectedFile);
      setSelectedTool(null);
      setProcessedPdfUrl('');
      setWatermarkText('');
      setRotationAngle(0);
      setPassword('');
      
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setStatus({ type: 'success', message: 'PDF loaded successfully' });
    } else {
      setStatus({ type: 'error', message: 'Please select a valid PDF file' });
    }
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const dt = e.dataTransfer;
    if (dt.files.length) {
      handleFileChange({ target: { files: dt.files } });
    }
  };

  const processPdf = async () => {
    if (!file || !selectedTool) return;
    
    setIsProcessing(true);
    setStatus({ type: 'info', message: 'Processing PDF...' });
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Apply selected modification
      switch(selectedTool) {
        case 'watermark':
          if (watermarkText) {
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont('Helvetica');
            
            pages.forEach(page => {
              const { width, height } = page.getSize();
              page.drawText(watermarkText, {
                x: width / 4,
                y: height / 2,
                size: 50,
                font,
                opacity: 0.2,
                color: rgb(0.5, 0.5, 0.5),
                rotate: degrees(-45),
              });
            });
            setStatus({ type: 'success', message: 'Watermark added successfully' });
          } else {
            throw new Error('Please enter watermark text');
          }
          break;
          
        case 'rotate':
          const pages = pdfDoc.getPages();
          pages.forEach(page => {
            page.setRotation(degrees(rotationAngle));
          });
          setStatus({ type: 'success', message: `Pages rotated by ${rotationAngle}°` });
          break;
          
        case 'protect':
          // Note: Actual password protection would require additional libraries
          setStatus({ type: 'info', message: 'Password protection simulated (would require server-side processing)' });
          break;
      }
      
      // Save and create download URL
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setProcessedPdfUrl(url);
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      setStatus({ type: 'error', message: error.message || 'Failed to process PDF' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedPdfUrl) return;
    
    const a = document.createElement('a');
    a.href = processedPdfUrl;
    a.download = `edited_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCancel = () => {
    if (isProcessing) {
      // In a real app, you might want to abort the ongoing processing
      setStatus({ type: 'info', message: 'Operation cancelled' });
      setIsProcessing(false);
      return;
    }
    
    // Clean up URLs
    if (processedPdfUrl) URL.revokeObjectURL(processedPdfUrl);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    // Reset state
    setFile(null);
    setSelectedTool(null);
    setProcessedPdfUrl('');
    setPreviewUrl('');
    setWatermarkText('');
    setRotationAngle(0);
    setPassword('');
    setStatus(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderToolOptions = () => {
    if (!selectedTool) return null;

    return (
      <ToolOptionsPanel>
        <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
          {tools.find(t => t.id === selectedTool).name} Options
        </h3>
        
        {selectedTool === 'watermark' && (
          <OptionRow>
            <label>Watermark Text:</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text"
            />
          </OptionRow>
        )}
        
        {selectedTool === 'rotate' && (
          <OptionRow>
            <label>Rotation Angle:</label>
            <select
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
            >
              <option value="0">0° (No rotation)</option>
              <option value="90">90° Clockwise</option>
              <option value="180">180° (Upside down)</option>
              <option value="270">270° Clockwise</option>
            </select>
          </OptionRow>
        )}
        
        {selectedTool === 'protect' && (
          <OptionRow>
            <label>Set Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </OptionRow>
        )}
        
        <ButtonGroup>
          <EditorButton
            primary
            onClick={processPdf}
            disabled={isProcessing || (selectedTool === 'watermark' && !watermarkText)}
          >
            {isProcessing ? (
              <>
                <LoadingSpinner /> Applying Changes...
              </>
            ) : (
              <>
                <FiArrowRight /> Apply Changes
              </>
            )}
          </EditorButton>
          
          <EditorButton
            onClick={() => setSelectedTool(null)}
            disabled={isProcessing}
          >
            <FiX /> Back to Tools
          </EditorButton>
        </ButtonGroup>
      </ToolOptionsPanel>
    );
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <h1>PDF Editor</h1>
        <p>Modify your PDF files with various editing tools</p>
      </EditorHeader>

      <EditorDropzone 
        onClick={() => fileInputRef.current.click()}
        onDragEnter={handleDragEvents}
        onDragLeave={handleDragEvents}
        onDragOver={handleDragEvents}
        onDrop={handleDrop}
        isDragging={isDragging}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <FiUpload size={48} color="#3E92CC" />
        <p>Drag & drop a PDF file here or click to browse</p>
        <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
          (Maximum file size: 50MB. File processed securely in your browser.)
        </p>
      </EditorDropzone>

      {status && (
        <EditorStatus variant={status.type}>
          {status.type === 'error' ? <FiX /> : 
           status.type === 'success' ? <FiCheck /> : null}
          {status.message}
        </EditorStatus>
      )}

      {file && (
        <>
          <EditorPreviewContainer>
            <EditorPDFPreview 
              src={processedPdfUrl || previewUrl} 
              title="PDF Preview"
            />
          </EditorPreviewContainer>

          {!selectedTool ? (
            <>
              <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Select an Editing Tool</h2>
              <ToolGrid>
                {tools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    active={selectedTool === tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    {tool.icon}
                    <p>{tool.name}</p>
                  </ToolCard>
                ))}
              </ToolGrid>
            </>
          ) : (
            renderToolOptions()
          )}

          <ButtonGroup>
            {processedPdfUrl && (
              <EditorButton 
                primary 
                onClick={handleDownload}
              >
                <FiDownload /> Download Edited PDF
              </EditorButton>
            )}
            
            <EditorButton 
              variant="danger"
              onClick={handleCancel}
              disabled={isProcessing && !processedPdfUrl}
            >
              <FiTrash2 /> {file && !processedPdfUrl ? 'Remove PDF' : 'Start Over'}
            </EditorButton>
          </ButtonGroup>
        </>
      )}
    </EditorContainer>
  );
}