import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const FormContainer = styled(motion.form)`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.neutral.charcoal};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.charcoal};
  outline: none;
  background: transparent;

  &:focus ~ label,
  &:valid ~ label {
    top: -20px;
    left: 0;
    color: ${({ theme }) => theme.colors.primary.violet};
    font-size: 0.8rem;
  }
`;

const Label = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.neutral.charcoal};
  pointer-events: none;
  transition: ${({ theme }) => theme.transitions.default};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.neutral.charcoal};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.charcoal};
  outline: none;
  background: transparent;
  resize: none;
  min-height: 100px;

  &:focus ~ label,
  &:valid ~ label {
    top: -20px;
    left: 0;
    color: ${({ theme }) => theme.colors.primary.violet};
    font-size: 0.8rem;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(
    45deg,
    ${({ theme }) => theme.colors.primary.violet},
    ${({ theme }) => theme.colors.secondary.coral}
  );
  color: white;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      ${({ theme }) => theme.colors.secondary.coral},
      ${({ theme }) => theme.colors.primary.violet}
    );
    z-index: -1;
    opacity: 0;
    transition: ${({ theme }) => theme.transitions.default};
  }

  &:hover::before {
    opacity: 1;
  }
`;

const SuccessMessage = styled(motion.div)`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.secondary.mint};
  color: ${({ theme }) => theme.colors.neutral.charcoal};
  border-radius: 10px;
  margin-top: 1rem;
  text-align: center;
`;

const ErrorMessage = styled(motion.div)`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.secondary.coral};
  color: white;
  border-radius: 10px;
  margin-top: 1rem;
  text-align: center;
`;

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  return (
    <FormContainer
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <InputGroup>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Label>Name</Label>
      </InputGroup>

      <InputGroup>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Label>Email</Label>
      </InputGroup>

      <InputGroup>
        <TextArea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <Label>Message</Label>
      </InputGroup>

      <SubmitButton
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Send Message
      </SubmitButton>

      <AnimatePresence>
        {status === 'success' && (
          <SuccessMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            Thank you! Your message has been sent successfully.
          </SuccessMessage>
        )}
        {status === 'error' && (
          <ErrorMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            Oops! Something went wrong. Please try again.
          </ErrorMessage>
        )}
      </AnimatePresence>
    </FormContainer>
  );
}