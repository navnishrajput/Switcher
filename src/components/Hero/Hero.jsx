import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { FaArrowRight, FaFilePdf, FaFileImage, FaFileWord } from 'react-icons/fa';

// Floating file icons animation
const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

// Background pulse animation
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(168, 249, 255, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(168, 249, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(168, 249, 255, 0); }
`;

const AnimatedBackground = () => {
  return (
    <div className="bg-elements">
      {/* Floating file icons */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-file"
          initial={{ 
            y: Math.random() * 100,
            x: Math.random() * 100,
            opacity: 0,
            rotate: Math.random() * 360
          }}
          animate={{ 
            y: [0, -50, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${1 + Math.random() * 3}rem`,
            color: `hsla(${Math.random() * 360}, 80%, 70%, 0.3)`
          }}
        >
          {[<FaFilePdf />, <FaFileImage />, <FaFileWord />][i % 3]}
        </motion.div>
      ))}
      
      {/* Grid lines */}
      <div className="grid-lines">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="grid-line" />
        ))}
      </div>
    </div>
  );
};

const HeroContainer = styled.section`
  width: 100vw;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a1128 0%, #1a2a6c 100%);
  color: white;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  margin-left: calc(-50vw + 50%);
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(62, 146, 204, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(255, 107, 107, 0.15) 0%, transparent 40%);
    z-index: 0;
  }

  .bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }

  .bg-file {
    position: absolute;
    animation: ${floatAnimation} 8s ease-in-out infinite;
    opacity: 0.2;
  }

  .grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    opacity: 0.05;
  }

  .grid-line {
    border-right: 1px solid rgba(168, 249, 255, 0.3);
    border-bottom: 1px solid rgba(168, 249, 255, 0.3);
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  box-sizing: border-box;
`;

const MainTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #fff 0%, #a8f9ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const HighlightText = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(3px);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  border: 1px solid rgba(168, 249, 255, 0.3);
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.5rem);
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const CtaButton = styled(motion.a)`
  padding: 1.2rem 3rem;
  border-radius: 50px;
  background: linear-gradient(45deg, #ff6b6b, #a8f9ff);
  color: #0a1128;
  font-weight: 700;
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  border: none;
  animation: ${pulseAnimation} 2s infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #a8f9ff, #ff6b6b);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

const ToolHighlights = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
  max-width: 800px;
`;

const ToolBadge = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid rgba(168, 249, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

export default function Hero() {
  const tools = [
    { icon: <FaFilePdf />, name: 'PDF Tools' },
    { icon: <FaFileImage />, name: 'Image Converter' },
    { icon: <FaFileWord />, name: 'Document Tools' },
    { icon: <FaFilePdf />, name: 'Merge PDF' },
    { icon: <FaFileImage />, name: 'Compress Images' }
  ];

  return (
    <HeroContainer>
      <AnimatedBackground />
      
      <ContentWrapper>
        <MainTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Transform Your Files <br />
          <HighlightText>In Just One Click</HighlightText>
        </MainTitle>
        
        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The most powerful online file conversion toolkit. Convert between <strong>50+ formats</strong> instantly with our lightning-fast, secure, and completely free tools.
        </Subtitle>
        
        <CtaButton
          href="#tools"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Start Converting Now <FaArrowRight />
        </CtaButton>
        
        <ToolHighlights
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {tools.map((tool, i) => (
            <ToolBadge
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tool.icon} {tool.name}
            </ToolBadge>
          ))}
        </ToolHighlights>
      </ContentWrapper>
    </HeroContainer>
  );
}