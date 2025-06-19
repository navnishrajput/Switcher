import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiUpload, FiDownload, FiColumns, FiTrash2, FiArrowLeft, FiPlus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: ${props => props.variant === 'outline' ? 'transparent' : '#3498db'};
  color: ${props => props.variant === 'outline' ? '#3498db' : 'white'};
  border: ${props => props.variant === 'outline' ? '1px solid #3498db' : 'none'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.variant === 'outline' ? '#e8f4fc' : '#2980b9'};
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const FileList = styled.div`
  margin: 1.5rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }

  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    margin-right: 1.25rem;
    border-radius: 4px;
    border: 1px solid #eee;
  }

  .file-info {
    flex: 1;
    min-width: 0;

    .file-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #2c3e50;
    }

    .file-size {
      font-size: 0.8rem;
      color: #7f8c8d;
      margin-top: 0.2rem;
    }
  }

  button {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background: rgba(231, 76, 60, 0.1);
    }
  }
`;

const ProcessOptions = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #2c3e50;
    font-size: 1.2rem;
  }

  .option-group {
    margin-bottom: 1.25rem;

    label {
      display: block;
      margin-bottom: 0.6rem;
      font-weight: 500;
      color: #34495e;
      font-size: 0.95rem;
    }

    select, input[type="number"] {
      width: 100%;
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border 0.2s;

      &:focus {
        outline: none;
        border-color: #3498db;
      }
    }

    input[type="range"] {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #ddd;
      outline: none;
      -webkit-appearance: none;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #3498db;
        cursor: pointer;
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const UploadMoreButton = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: center;
`;

const StatusMessage = styled.div`
  padding: 0.8rem 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  background: ${props => props.type === 'error' ? '#fdecea' : '#e8f5e9'};
  color: ${props => props.type === 'error' ? '#c62828' : '#2e7d32'};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1.1rem;
  }
`;

const DownloadStatus = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: #e3f2fd;
  color: #1565c0;
  font-size: 0.85rem;
`;

export default function BatchProcessor() {
  const [files, setFiles] = useState([]);
  const [processType, setProcessType] = useState('resize');
  const [settings, setSettings] = useState({
    width: 800,
    height: 600,
    quality: 80,
    format: 'jpeg'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [status, setStatus] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      processed: false,
      processedUrl: null
    }));
    setFiles([...files, ...newFiles]);
    setStatus({ 
      message: `${newFiles.length} file(s) added successfully`, 
      type: 'success' 
    });
    setTimeout(() => setStatus(null), 3000);
  };

  const removeFile = (id) => {
    const fileToRemove = files.find(file => file.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
      if (fileToRemove.processedUrl) {
        URL.revokeObjectURL(fileToRemove.processedUrl);
      }
    }
    setFiles(files.filter(file => file.id !== id));
  };

  const resetTool = () => {
    files.forEach(file => {
      URL.revokeObjectURL(file.preview);
      if (file.processedUrl) {
        URL.revokeObjectURL(file.processedUrl);
      }
    });
    setFiles([]);
    setProcessType('resize');
    setSettings({
      width: 800,
      height: 600,
      quality: 80,
      format: 'jpeg'
    });
    setStatus({ message: 'Reset complete', type: 'success' });
    setTimeout(() => setStatus(null), 2000);
  };

  const processFiles = () => {
    if (files.length === 0) {
      setStatus({ 
        message: 'No files to process', 
        type: 'error' 
      });
      setTimeout(() => setStatus(null), 2000);
      return;
    }
    
    setIsProcessing(true);
    setStatus({ 
      message: 'Processing files...', 
      type: 'success' 
    });
    
    setTimeout(() => {
      const processedFiles = files.map(file => {
        // In a real app, this would actually process the image
        const processedUrl = URL.createObjectURL(file.file); // Using original file for demo
        return {
          ...file,
          processed: true,
          processedUrl
        };
      });
      
      setFiles(processedFiles);
      setIsProcessing(false);
      setStatus({ 
        message: `${files.length} file(s) processed successfully`, 
        type: 'success' 
      });
      setTimeout(() => setStatus(null), 3000);
    }, 1500);
  };

  const downloadFile = (file) => {
    return new Promise((resolve) => {
      try {
        if (!navigator.onLine) {
          throw new Error('Network connection unavailable');
        }

        const link = document.createElement('a');
        let extension = settings.format === 'jpeg' ? 'jpg' : settings.format;
        const originalName = file.file.name.replace(/\.[^/.]+$/, '');
        link.download = `enhanced_${originalName}_${settings.width}x${settings.height}.${extension}`;
        link.href = file.processedUrl || file.preview;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add small delay for cleanup
        setTimeout(() => {
          resolve(true);
        }, 100);
      } catch (error) {
        console.error('Download failed:', error);
        resolve(false);
      }
    });
  };

  const downloadAll = async () => {
    if (files.length === 0) {
      setStatus({ 
        message: 'No files to download', 
        type: 'error' 
      });
      setTimeout(() => setStatus(null), 2000);
      return;
    }

    const unprocessedFiles = files.filter(file => !file.processed);
    if (unprocessedFiles.length > 0) {
      setStatus({ 
        message: `${unprocessedFiles.length} file(s) need processing`, 
        type: 'error' 
      });
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    setIsDownloading(true);
    setDownloadStatus(`Starting download of ${files.length} file(s)...`);

    let successCount = 0;
    let failedCount = 0;
    const failedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setDownloadStatus(`Downloading ${i+1} of ${files.length}: ${file.file.name}`);
      
      const success = await downloadFile(file);
      if (success) {
        successCount++;
      } else {
        failedCount++;
        failedFiles.push(file.file.name);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsDownloading(false);
    setDownloadStatus(null);
    
    if (failedCount > 0) {
      setStatus({
        message: (
          <div>
            <FiAlertCircle /> {successCount} downloaded, {failedCount} failed
            {failedFiles.length > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                Failed: {failedFiles.slice(0, 3).join(', ')}
                {failedFiles.length > 3 && ` and ${failedFiles.length - 3} more`}
              </div>
            )}
            {!navigator.onLine && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                Please check your network connection
              </div>
            )}
          </div>
        ),
        type: 'error'
      });
    } else {
      setStatus({
        message: (
          <div>
            <FiCheckCircle /> {successCount} file(s) downloaded successfully
          </div>
        ),
        type: 'success'
      });
    }

    setTimeout(() => setStatus(null), 5000);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Container>
      <Header>
        {files.length > 0 && (
          <Button variant="outline" onClick={resetTool}>
            <FiArrowLeft /> Reset
          </Button>
        )}
        <h2><FiColumns /> Batch Image Processor</h2>
      </Header>
      <p>Upload, process, and download multiple images at once</p>

      {status && (
        <StatusMessage type={status.type}>
          {status.message}
        </StatusMessage>
      )}

      {downloadStatus && (
        <DownloadStatus>
          {downloadStatus}
        </DownloadStatus>
      )}

      {files.length === 0 ? (
        <div style={{ margin: '2rem 0' }}>
          <Button onClick={triggerFileInput}>
            <FiUpload /> Select Images
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <>
          <FileList>
            {files.map(file => (
              <FileItem key={file.id}>
                <img src={file.preview} alt="Preview" />
                <div className="file-info">
                  <div className="file-name">{file.file.name}</div>
                  <div className="file-size">
                    {(file.file.size / 1024).toFixed(1)} KB
                    {file.processed && (
                      <span style={{ color: '#27ae60', marginLeft: '0.5rem' }}>
                        ✓ Processed ({settings.width}x{settings.height})
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => removeFile(file.id)} title="Remove file">
                  <FiTrash2 />
                </button>
              </FileItem>
            ))}
          </FileList>

          <UploadMoreButton>
            <Button variant="outline" onClick={triggerFileInput}>
              <FiPlus /> Add More Images
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </UploadMoreButton>

          <ProcessOptions>
            <h3>Processing Options</h3>
            <div className="option-group">
              <label>Process Type</label>
              <select 
                value={processType} 
                onChange={(e) => setProcessType(e.target.value)}
                disabled={isProcessing || isDownloading}
              >
                <option value="resize">Resize</option>
                <option value="compress">Compress</option>
                <option value="convert">Convert Format</option>
                <option value="watermark">Add Watermark</option>
              </select>
            </div>

            {processType === 'resize' && (
              <>
                <div className="option-group">
                  <label>Width (px)</label>
                  <input
                    type="number"
                    min="10"
                    value={settings.width}
                    onChange={(e) => setSettings({...settings, width: parseInt(e.target.value) || 0})}
                    disabled={isProcessing || isDownloading}
                  />
                </div>
                <div className="option-group">
                  <label>Height (px)</label>
                  <input
                    type="number"
                    min="10"
                    value={settings.height}
                    onChange={(e) => setSettings({...settings, height: parseInt(e.target.value) || 0})}
                    disabled={isProcessing || isDownloading}
                  />
                </div>
              </>
            )}

            {(processType === 'compress' || processType === 'convert') && (
              <div className="option-group">
                <label>Quality: {settings.quality}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings.quality}
                  onChange={(e) => setSettings({...settings, quality: parseInt(e.target.value)})}
                  disabled={isProcessing || isDownloading}
                />
              </div>
            )}

            {processType === 'convert' && (
              <div className="option-group">
                <label>Output Format</label>
                <select
                  value={settings.format}
                  onChange={(e) => setSettings({...settings, format: e.target.value})}
                  disabled={isProcessing || isDownloading}
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            )}

            <ButtonGroup>
              <Button 
                onClick={processFiles} 
                disabled={isProcessing || isDownloading || files.length === 0}
              >
                {isProcessing ? 'Processing...' : `Process ${files.length} File(s)`}
              </Button>
              <Button 
                onClick={downloadAll}
                variant={files.some(f => !f.processed) ? 'outline' : 'primary'}
                disabled={isProcessing || isDownloading || files.length === 0 || files.some(f => !f.processed)}
              >
                <FiDownload /> Download All
              </Button>
            </ButtonGroup>
          </ProcessOptions>
        </>
      )}
    </Container>
  );
}