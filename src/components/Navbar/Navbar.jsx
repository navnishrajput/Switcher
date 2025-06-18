import { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 1rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background-color: rgba(10, 36, 99, 0.8);
  box-sizing: border-box;
`;

const Logo = styled(motion.div)`
  font-family: ${({ theme }) => theme.fonts.headings};
  color: ${({ theme }) => theme.colors.neutral.offWhite};
  font-size: 1.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  
  span {
    color: ${({ theme }) => theme.colors.secondary.mint};
  }
`;

const NavLinks = styled(motion.div)`
  display: flex;
  gap: 2rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.primary.navy};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    transform: none;
    left: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    transition: all 0.3s ease;
    z-index: 999;
  }
`;

const NavLink = styled(motion.a)`
  color: ${({ theme }) => theme.colors.neutral.offWhite};
  text-decoration: none;
  font-weight: 500;
  position: relative;
  font-size: 1.1rem;
  padding: 0.5rem 0;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.secondary.coral};
    transition: ${({ theme }) => theme.transitions.default};
  }

  &:hover::after {
    width: 100%;
  }
`;

const AuthButton = styled(motion.button)`
  padding: 0.7rem 1.5rem;
  border-radius: 50px;
  background: transparent;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary.mint};
  transition: all 0.3s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background: rgba(168, 249, 255, 0.2);
  }

  @media (max-width: 1024px) {
    position: relative;
    z-index: 1001;
  }
`;

const MenuButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.neutral.offWhite};
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  z-index: 1001;
  margin-left: 1rem;

  @media (max-width: 1024px) {
    display: block;
  }
`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
    >
      <Logo
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Multi<span>Tool</span>
      </Logo>

      <NavLinks isOpen={isOpen}>
        <NavLink
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          href="/pdf-tools"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(false)}
        >
          PDF Tools
        </NavLink>
        <NavLink
          href="/doc-tools"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(false)}
        >
          DOC Tools
        </NavLink>
        <NavLink
          href="/image-tools"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(false)}
        >
          Image Tools
        </NavLink>
        <NavLink
          href="/other-tools"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(false)}
        >
          Other Tools
        </NavLink>
      </NavLinks>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <AuthButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUser /> Login
        </AuthButton>
        <MenuButton 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>
      </div>
    </NavContainer>
  );
}