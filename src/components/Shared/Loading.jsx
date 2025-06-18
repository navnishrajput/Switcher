import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoadingContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const Spinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(10, 36, 99, 0.2);
  border-radius: 50%;
  border-top-color: #3E92CC;
`;

export default function Loading() {
  return (
    <LoadingContainer>
      <Spinner
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </LoadingContainer>
  );
}