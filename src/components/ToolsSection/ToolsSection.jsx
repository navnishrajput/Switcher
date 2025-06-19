import React from 'react';
import styled from 'styled-components';
import { 
  FiLayers, FiDivide, FiFileText, FiMinusCircle,
  FiEdit, FiEye, FiLock, FiUnlock, FiImage,
  FiCamera, FiType, FiGrid, FiFilm, FiSliders,
  FiPlus, FiColumns, FiFile, FiFilter, FiRotateCw
} from 'react-icons/fi';

const ToolsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  width: 100%;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ToolCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: #3498db;
  }
`;

const ToolIcon = styled.div`
  font-size: 32px;
  color: ${({ color }) => color || '#3498db'};
  margin-bottom: 15px;
`;

const ToolName = styled.h3`
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const ToolDescription = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
`;

export default function ToolsSection({ onToolSelect }) {
  const pdfTools = [
    { 
      id: 'merger', 
      component: 'PdfMerger', 
      name: 'PDF Merger', 
      icon: <FiLayers />, 
      desc: 'Combine multiple PDFs into one document',
      color: '#3498db'
    },
    { 
      id: 'splitter', 
      component: 'PdfSplitter', 
      name: 'PDF Splitter', 
      icon: <FiDivide />, 
      desc: 'Split PDF by pages or ranges',
      color: '#e74c3c'
    },
    { 
      id: 'converter', 
      component: 'PdfConverter', 
      name: 'PDF Converter', 
      icon: <FiFileText />, 
      desc: 'Convert to other file formats',
      color: '#2ecc71'
    },
    { 
      id: 'compressor', 
      component: 'PdfCompressor', 
      name: 'PDF Compressor', 
      icon: <FiMinusCircle />, 
      desc: 'Reduce PDF file size',
      color: '#f39c12'
    },
    { 
      id: 'editor', 
      component: 'PdfEditor', 
      name: 'PDF Editor', 
      icon: <FiEdit />, 
      desc: 'Edit PDF content',
      color: '#9b59b6'
    },
    { 
      id: 'reader', 
      component: 'PdfReader', 
      name: 'PDF Reader', 
      icon: <FiEye />, 
      desc: 'View PDF files',
      color: '#1abc9c'
    },
    { 
      id: 'protector', 
      component: 'PdfProtector', 
      name: 'PDF Protector', 
      icon: <FiLock />, 
      desc: 'Add password protection',
      color: '#34495e'
    },
    { 
      id: 'unlocker', 
      component: 'PdfUnlocker', 
      name: 'PDF Unlocker', 
      icon: <FiUnlock />, 
      desc: 'Remove passwords',
      color: '#e67e22'
    }
  ];

  const imageTools = [
    { 
      id: 'image-to-pdf', 
      component: 'ImageToPdf', 
      name: 'Image to PDF', 
      icon: <FiFileText />, 
      desc: 'Convert images to PDF documents',
      color: '#3498db'
    },
    { 
      id: 'pdf-to-image', 
      component: 'PdfToImage', 
      name: 'PDF to Images', 
      icon: <FiImage />, 
      desc: 'Extract images from PDF files',
      color: '#e74c3c'
    },
    { 
      id: 'image-compressor', 
      component: 'ImageCompressor', 
      name: 'Image Compressor', 
      icon: <FiMinusCircle />, 
      desc: 'Reduce image file size',
      color: '#2ecc71'
    },
    { 
      id: 'image-converter', 
      component: 'ImageFormatConverter', 
      name: 'Format Converter', 
      icon: <FiFileText />, 
      desc: 'Convert between image formats',
      color: '#f39c12'
    },
    { 
      id: 'image-editor', 
      component: 'ImageEditor', 
      name: 'Image Editor', 
      icon: <FiEdit />, 
      desc: 'Edit and enhance images',
      color: '#9b59b6'
    },
    { 
      id: 'collage-maker', 
      component: 'CollageMaker', 
      name: 'Collage Maker', 
      icon: <FiGrid />, 
      desc: 'Combine images into beautiful collages',
      color: '#8e44ad'
    },
    { 
      id: 'watermark-tool', 
      component: 'WatermarkTool', 
      name: 'Watermark Tool', 
      icon: <FiLock />, 
      desc: 'Add watermarks to protect images',
      color: '#16a085'
    },
    { 
      id: 'meme-generator', 
      component: 'MemeGenerator', 
      name: 'Meme Generator', 
      icon: <FiType />, 
      desc: 'Create hilarious memes with your images',
      color: '#f1c40f'
    },
    { 
      id: 'gif-maker', 
      component: 'GifMaker', 
      name: 'GIF Maker', 
      icon: <FiFilm />, 
      desc: 'Create animated GIFs from images',
      color: '#d35400'
    },
    { 
      id: 'background-remover', 
      component: 'BackgroundRemover', 
      name: 'Background Remover', 
      icon: <FiCamera />, 
      desc: 'Automatically remove image backgrounds',
      color: '#c0392b'
    },
    { 
      id: 'photo-enhancer', 
      component: 'PhotoEnhancer', 
      name: 'Photo Enhancer', 
      icon: <FiSliders />, 
      desc: 'Improve image quality automatically',
      color: '#27ae60'
    },
    { 
      id: 'batch-processor', 
      component: 'BatchProcessor', 
      name: 'Batch Processor', 
      icon: <FiColumns />, 
      desc: 'Process multiple images at once',
      color: '#2980b9'
    }
  ];

  return (
    <ToolsContainer>
      <Section>
        <SectionTitle>
          <FiFileText /> PDF Tools
        </SectionTitle>
        <ToolsGrid>
          {pdfTools.map(tool => (
            <ToolCard key={tool.id} onClick={() => onToolSelect(tool)}>
              <ToolIcon color={tool.color}>{tool.icon}</ToolIcon>
              <ToolName>{tool.name}</ToolName>
              <ToolDescription>{tool.desc}</ToolDescription>
            </ToolCard>
          ))}
        </ToolsGrid>
      </Section>

      <Section>
        <SectionTitle>
          <FiImage /> Image Tools
        </SectionTitle>
        <ToolsGrid>
          {imageTools.map(tool => (
            <ToolCard key={tool.id} onClick={() => onToolSelect(tool)}>
              <ToolIcon color={tool.color}>{tool.icon}</ToolIcon>
              <ToolName>{tool.name}</ToolName>
              <ToolDescription>{tool.desc}</ToolDescription>
            </ToolCard>
          ))}
        </ToolsGrid>
      </Section>
    </ToolsContainer>
  );
}