import React from 'react';
import styled from 'styled-components';
import { 
  FiLayers, FiDivide, FiFileText, FiMinusCircle,
  FiEdit, FiEye, FiLock, FiUnlock, FiImage 
} from 'react-icons/fi';

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1450px;
  margin: 0 auto;

  /* Glass morphism effect */
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  /* Optional: Add a gradient for extra depth */
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.1)
  );
`;

const ToolCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral.offWhite};
  border: 1px solid ${({ theme }) => theme.colors.primary.violet};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.card};
    border-color: ${({ theme }) => theme.colors.secondary.mint};
    background-color: white;
  }

  svg {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary.violet};
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.colors.neutral.charcoal};
    font-size: 1.25rem;
    font-family: ${({ theme }) => theme.fonts.headings};
  }

  p {
    color: ${({ theme }) => theme.colors.primary.navy};
    font-size: 0.95rem;
    margin: 0;
    line-height: 1.5;
    font-family: ${({ theme }) => theme.fonts.body};
  }
`;

export default function ToolsSection({ onToolSelect }) {
  const tools = [
    { id: 'merger', component: 'PdfMerger', name: 'PDF Merger', icon: <FiLayers />, desc: 'Combine multiple PDFs' },
    { id: 'splitter', component: 'PdfSplitter', name: 'PDF Splitter', icon: <FiDivide />, desc: 'Split PDF by pages' },
    { id: 'converter', component: 'PdfConverter', name: 'PDF Converter', icon: <FiFileText />, desc: 'Convert to other formats' },
    { id: 'compressor', component: 'PdfCompressor', name: 'PDF Compressor', icon: <FiMinusCircle />, desc: 'Reduce file size' },
    { id: 'editor', component: 'PdfEditor', name: 'PDF Editor', icon: <FiEdit />, desc: 'Edit PDF content' },
    { id: 'reader', component: 'PdfReader', name: 'PDF Reader', icon: <FiEye />, desc: 'View PDFs' },
    { id: 'protector', component: 'PdfProtector', name: 'PDF Protector', icon: <FiLock />, desc: 'Add password protection' },
    { id: 'unlocker', component: 'PdfUnlocker', name: 'PDF Unlocker', icon: <FiUnlock />, desc: 'Remove passwords' },
    { id: 'ocr', component: 'PdfOcr', name: 'PDF OCR', icon: <FiImage />, desc: 'Extract text from images' }
  ];

  return (
    <ToolsGrid>
      {tools.map(tool => (
        <ToolCard 
          key={tool.id} 
          onClick={() => onToolSelect(tool)}
        >
          {tool.icon}
          <h3>{tool.name}</h3>
          <p>{tool.desc}</p>
        </ToolCard>
      ))}
    </ToolsGrid>
  );
}