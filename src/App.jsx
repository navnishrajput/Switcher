import React, { useState } from 'react';
import { ThemeProvider, styled } from 'styled-components';
import { theme } from './styles/theme';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ToolsSection from './components/ToolsSection/ToolsSection';
import ToolModal from './components/modals/ToolModal';
import './App.css';

const PdfToolsIntro = styled.section`
  width: 100%;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #0a1128 0%, #1a2a6c 100%);
  color: white;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.headings};
  font-size: 1.8rem;
  font-weight: 700;
  box-sizing: border-box;
  margin-top: 2rem;
`;

function App() {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <Navbar />
        <Hero />
        <PdfToolsIntro>
          These tools are for PDF Files
        </PdfToolsIntro>
        <ToolsSection onToolSelect={handleToolSelect} />
        {selectedTool && (
          <ToolModal tool={selectedTool} onClose={handleCloseModal} />
        )}
        <div className="app">
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;
