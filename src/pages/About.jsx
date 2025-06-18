import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled(motion.div)`
  padding: 5rem 10%;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary.navy};
  margin-bottom: 2rem;
`;

const Content = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 800px;
`;

export default function About() {
  return (
    <AboutContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>About Us</Title>
      <Content>
        We are a team of passionate designers and developers creating modern,
        visually stunning websites with cutting-edge technologies. Our focus is on
        delivering exceptional user experiences through thoughtful design and
        smooth animations.
      </Content>
    </AboutContainer>
  );
}