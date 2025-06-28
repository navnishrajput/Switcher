import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

const Cursor = styled.div`
  position: fixed;
  width: 20px;
  height: 20px;
  background-color: ${({ theme }) => theme.colors?.secondary?.mint || '#4ECDC4'};
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: 
    transform 150ms ease-out,
    width 200ms ease,
    height 200ms ease,
    background-color 200ms ease;
  z-index: 9999;
  mix-blend-mode: difference;
  will-change: transform;
  
  ${({ $isActive }) => $isActive && css`
    transform: translate(-50%, -50%) scale(0.7);
    background-color: #ff6b6b;
  `}
  
  ${({ $isHovering }) => $isHovering && css`
    width: 40px;
    height: 40px;
    background-color: rgba(255, 107, 107, 0.5);
  `}
`;

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Don't run on mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);
    
    const handleHover = (e) => {
      const shouldHover = e.target.closest('a, button, [data-cursor-hover]');
      setIsHovering(!!shouldHover);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  // Don't render on mobile devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <Cursor
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      $isActive={isActive}
      $isHovering={isHovering}
    />
  );
};

export default CustomCursor;