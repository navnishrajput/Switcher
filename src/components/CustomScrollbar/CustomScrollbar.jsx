import React from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// Glowing neon animation
const neonGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 5px #0ff,
      0 0 10px #0ff,
      0 0 20px #0ff;
  }
  50% {
    box-shadow: 
      0 0 10px #0ff,
      0 0 20px #0ff,
      0 0 30px #0ff;
  }
`;

const pulse = keyframes`
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
`;

const GlobalScrollbarStyle = createGlobalStyle`
  /* Modern Neon Webkit Scrollbar */
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    background-color: rgba(0, 0, 20, 0.8);
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 5, 15, 0.8);
    border-radius: 0;
    border-left: 1px solid rgba(0, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(
      45deg,
      #00ffff,
      #00ffcc,
      #00ff99
    );
    background-size: 200% 200%;
    border-radius: 8px;
    border: 2px solid rgba(0, 255, 255, 0.3);
    animation: 
      ${neonGlow} 2s ease infinite,
      ${pulse} 3s ease infinite;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      45deg,
      #00ff99,
      #00ffff,
      #00ccff
    );
    transform: scale(1.05);
    animation: 
      ${neonGlow} 1s ease infinite,
      ${pulse} 2s ease infinite;
  }

  ::-webkit-scrollbar-corner {
    background: rgba(0, 5, 15, 0.8);
  }

  /* Firefox Neon Scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: #00ffff rgba(0, 5, 15, 0.8);
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
`;

const NeonScrollContainer = styled.div`
  position: relative;
  overflow: auto;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    rgba(0, 10, 20, 0.9),
    rgba(0, 5, 15, 0.95)
  );

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      45deg,
      #ff00ff,
      #00ffff,
      #ff00ff
    );
  }
`;

const CustomNeonScrollbar = ({ children }) => {
  return (
    <>
      <GlobalScrollbarStyle />
      <NeonScrollContainer>
        {children}
      </NeonScrollContainer>
    </>
  );
};

export default CustomNeonScrollbar;