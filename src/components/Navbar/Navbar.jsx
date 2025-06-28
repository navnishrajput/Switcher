import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaBars, FaTimes, FaUser, FaChevronDown } from 'react-icons/fa';

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
  display: flex;
  align-items: center;
  gap: 0.3rem;

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

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.colors.primary.navy};
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 200px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};

  @media (max-width: 1024px) {
    position: static;
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    align-items: center;
    background: transparent;
    box-shadow: none;
    padding: 1rem 0;
    gap: 1rem;
  }
`;

const DropdownItem = styled(NavLink)`
  padding: 0.75rem 1.5rem;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(168, 249, 255, 0.1);
  }

  @media (max-width: 1024px) {
    text-align: center;
    padding: 0.5rem 0;
  }
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1024px) {
    width: 100%;
    align-items: center;
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

const toolCategories = {
  'PDF Tools': [
    { name: 'Merge PDF', path: '/pdf-tools/merge' },
    { name: 'Split PDF', path: '/pdf-tools/split' },
    { name: 'Compress PDF', path: '/pdf-tools/compress' },
  ],
  'Image Tools': [
    { name: 'Resize Image', path: '/image-tools/resize' },
    { name: 'Convert Image', path: '/image-tools/convert' },
    { name: 'Compress Image', path: '/image-tools/compress' },
  ],
  'DOC Tools': [
    { name: 'Word to PDF', path: '/doc-tools/word-to-pdf' },
    { name: 'PDF to Word', path: '/doc-tools/pdf-to-word' },
  ],
  'Other Tools': [
    { name: 'Text Tools', path: '/other-tools/text' },
    { name: 'File Converter', path: '/other-tools/converter' },
  ]
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setActiveDropdown(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (category) => {
    setActiveDropdown(activeDropdown === category ? null : category);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

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
          onClick={closeMobileMenu}
        >
          Home
        </NavLink>

        {Object.keys(toolCategories).map((category) => (
          <NavItem 
            key={category}
            ref={el => dropdownRefs.current[category] = el}
            onMouseEnter={() => !isOpen && setActiveDropdown(category)}
            onMouseLeave={() => !isOpen && setActiveDropdown(null)}
          >
            <NavLink
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isOpen ? toggleDropdown(category) : null}
            >
              {category} <FaChevronDown size={12} />
            </NavLink>
            
            <DropdownMenu 
              isOpen={activeDropdown === category}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {toolCategories[category].map((tool) => (
                <DropdownItem
                  key={tool.path}
                  href={tool.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeMobileMenu}
                >
                  {tool.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </NavItem>
        ))}
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