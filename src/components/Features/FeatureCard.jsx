import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  perspective: 1000px;
  width: 300px;
  height: 400px;
`;

const CardInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  border-radius: 20px;
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FrontFace = styled(CardFace)`
  background: linear-gradient(
    135deg,
    rgba(10, 36, 99, 0.8),
    rgba(62, 146, 204, 0.8)
  );
  color: white;
`;

const BackFace = styled(CardFace)`
  background: linear-gradient(
    135deg,
    rgba(255, 107, 107, 0.8),
    rgba(168, 249, 255, 0.8)
  );
  color: ${({ theme }) => theme.colors.neutral.charcoal};
  transform: rotateY(180deg);
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

export default function FeatureCard({ title, description, frontDescription }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <CardContainer
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      <CardInner animate={{ rotateY: isFlipped ? 180 : 0 }}>
        <FrontFace>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{frontDescription}</CardDescription>
        </FrontFace>
        <BackFace>
          <CardTitle>More About {title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </BackFace>
      </CardInner>
    </CardContainer>
  );
}