import React from 'react';
import styled from 'styled-components';
import { FiImage } from 'react-icons/fi';
import ToolCard from '../ToolCard';

const Container = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

export default function ImgToolsSection() {
  const tools = [
    {
      title: "Image to PDF",
      description: "Convert images to PDF documents",
      icon: <FiImage />,
      path: "/image-to-pdf",
      color: "#3E92CC"
    },
    {
      title: "PDF to Images",
      description: "Extract images from PDF files",
      icon: <FiImage />,
      path: "/pdf-to-images",
      color: "#4CAF50"
    },
    {
      title: "Image Compressor",
      description: "Reduce image file size",
      icon: <FiImage />,
      path: "/image-compressor",
      color: "#FF9800"
    },
    {
      title: "Format Converter",
      description: "Convert between image formats",
      icon: <FiImage />,
      path: "/image-converter",
      color: "#9C27B0"
    },
    {
      title: "Image Editor",
      description: "Basic image editing tools",
      icon: <FiImage />,
      path: "/image-editor",
      color: "#F44336"
    }
  ];

  return (
    <Container>
      <Title>
        <FiImage size={24} /> Image Tools
      </Title>
      <ToolsGrid>
        {tools.map((tool, index) => (
          <ToolCard 
            key={index}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            path={tool.path}
            color={tool.color}
          />
        ))}
      </ToolsGrid>
    </Container>
  );
}