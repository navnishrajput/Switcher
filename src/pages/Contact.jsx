import styled from 'styled-components';
import { motion } from 'framer-motion';
import ContactForm from '../components/Contact/ContactForm';

const ContactContainer = styled(motion.div)`
  padding: 5rem 10%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary.navy};
  margin-bottom: 2rem;
`;

export default function Contact() {
  return (
    <ContactContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Contact Us</Title>
      <ContactForm />
    </ContactContainer>
  );
}